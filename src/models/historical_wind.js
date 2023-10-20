const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require("../helpers/getUniqueId");
const moment = require("moment");
const ApiError = require("../error/api-error");
const AvgWind = require("./avg_wind");

const device = require("./devices");
const frequent = require("../helpers/frequent");

const historicalWindSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    // site:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Site'
    // },

    detectionTime: {
      type: String,
      default: moment(new Date()).format("YYYY-MM-DD HH:mm"),
    },
    direction: {
      type: String,
      enum: ["N", "SE", "E", "W", "NE", "NW", "S", "SW"],
      required: true,
    },
    speed: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: ["user", "device"],
      default: "device",
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


historicalWindSchema.statics.getHistoricalWind = async function (body) {
  try {
    const page = (body?.page || 1) - 1;
    const limit = body?.limit || 10;
    const skip = page * limit;
    const sort = [
      [body?.sortField || "createdAt", body?.sortDirection || "desc"],
    ];
    let options = {
      code: 1,
      detectionTime: 1,
      direction: 1,
      speed: 1,
      source: 1,
      deviceId: 1,
      isDeleted: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    const historicalData = await this.find(
      {
        isDeleted: { $ne: true },
        ...(body?.direction && { direction: body?.direction }),
        ...(body?.detectionTime && { detectionTime: body?.detectionTime }),
        ...(body?.speed && { speed: body?.speed }),
        ...(body?.source && { source: body?.source }),
        ...(body?.deviceId && { deviceId: body?.deviceId }),
        ...(body?.code && { code: body?.code }),
        
        ...(body?.search && {
          $or: [
            { code: { $regex: body?.search, $options: "i" } },
            { detectionTime: { $regex: body?.search, $options: "i" } },
            { source: { $regex: body?.search, $options: "i" } },

            { deviceId: { $regex: body?.search, $options: "i" } },
            { region: { $regex: body?.search, $options: "i" } },
          ],
        }),
        ...(body?.dateFrom &&
          body?.dateTo && {
            createdAt: { $gte: body?.dateFrom, $lte: body?.dateTo },
          }),
      },
      options
    )
      .sort(sort)
      .skip(skip)
      .limit(limit)
      // .cache("histWind")
      .lean();
    return historicalData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


historicalWindSchema.statics.getPerPeriod = async function (body) {
  try {
    const specificDate = body.date;
    const interval = body.interval; // period between each data
    //body.date

    //body.period
    // Calculate the start and end timestamps for the specific date
    const startDate = moment(specificDate)
      .startOf("day")
      .format("YYYY-MM-DD HH:mm");
    const endDate = moment(specificDate)
      .endOf("day")
      .format("YYYY-MM-DD HH:mm");
    // Query for historical data within the date range

    const historicalData = await this.find({
      detectionTime: {
        $gte: startDate,
        $lte: endDate,
      },

    }).sort({ detectionTime: "asc" });
    console.log("================================",historicalData)
    // Initialize variables to calculate the average
    let currentInterval = null;
    let totalWindSpeed = 0;
    
    let count = 0;

    // Store the averaged data
    const averagedData = [];
    for (let i = 0; i < historicalData.length; i++) {
      const data = historicalData[i];
      const detectionTime = moment(data.detectionTime);

      if (!currentInterval) {
        // Start a new interval
        currentInterval = {
          start: detectionTime.format("YYYY-MM-DD HH:mm"), // Start time
          end: null, // End time (to be calculated)
          exactdate: specificDate,
          data: [],
        };
      }

      // Check if the current interval has reached the desired duration
      if (
        detectionTime.diff(moment(currentInterval.start), "minutes") >= interval
      ) {
        // Calculate the end time for the interval
        currentInterval.end = detectionTime.format("YYYY-MM-DD HH:mm");
        // Calculate the average for the current interval
        currentInterval.speed = parseFloat(
          totalWindSpeed / count
        ).toFixed(0);
        
        // Push the current interval to the result
        averagedData.push(currentInterval);

        // Reset counters and start a new interval
        totalWindSpeed = 0;
        
        count = 0;
        currentInterval = null;

        // Continue processing the current data point
        if (i != historicalData.length - 1) {
          i--;
        }
      } else {
        // Add data to the current interval
        currentInterval.data.push(data);

        // Accumulate speed and humidity values for averaging
        totalWindSpeed += data.speed;
        count++;
      }
    }

   

    return averagedData;
    //
  } catch (err) {
    throw new Error(err);
  }
};

//ERROR HERE
historicalWindSchema.statics.createHistoricalWind = async function (body) {
  body.code = await getUniqueId(this);

  //calculates the average wind (by fetching all the data from this table filtered by the the date and and store the avg in the avg_Table
  try {
    //*********************CHECK DEVICE AUTHENTICITY********************************************

    if (body.deviceId) {
      const deviceExists = await device.getOne(body.deviceId);
      if (deviceExists) {
        if(!body.detectionTime){ body.detectionTime = new Date().getTime(); }
        body.detectionTime = moment(new Date(body.detectionTime)).format(
          "YYYY-MM-DD HH:mm"
        );
        const historicalData = new this(body);
        await historicalData.save();
        body.detectionTime = moment(new Date(body.detectionTime)).format(
          "YYYY-MM-DD"
        );
        const startDate = moment(body.detectionTime)
          .startOf("day")
          .format("YYYY-MM-DD HH:mm");
        const endDate = moment(body.detectionTime)
          .endOf("day")
          .format("YYYY-MM-DD HH:mm");
        // Query for historical data within the date range
        const windData = await this.find({
          detectionTime: {
            $gte: startDate,
            $lte: endDate,
          },
        });

        const Avgexists = await AvgWind.findOne({
          detectionTime: body.detectionTime,
        });
        if (Avgexists) {
          // Calculate the average speed
          const totalSpeed = windData.reduce(
            (sum, data) => sum + data.speed,
            0
          );
          const averageSpeed = parseFloat(totalSpeed / windData.length).toFixed(0);

          const directions = windData.map((data) => data.direction);
          const mostCommonDirection = frequent(directions);

          const body2 = {
            detectionTime: body.detectionTime,
            direction: mostCommonDirection,
            speed: averageSpeed,
          };

          const updatedavg = await AvgWind.updateAvgWindByDate(body2);
        } else {
          // No document with the specified date exists in the AvgWind collection.
          console.log("No document found for the specified date.");
          const createAvg = await AvgWind.createAvgWind(body);
          return historicalData;
        }
      } else {
        throw new Error("device not found");
      }
    } else {
      throw new Error("theres no device Id");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
historicalWindSchema.statics.updateHistoricalWind = async function (body) {
  //recalculate all the information on the avg table
  try {
    const { id, ...updateFields } = body;
    const updatedData = await this.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedData) {
      throw new ApiError.notFound(
        "Historical Winderature and Humidity Data not found"
      );
    }
    return updatedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

historicalWindSchema.statics.softDelete = async function (id) {
  //recalculate all the information on the avg table
  try {
    
    //change the wind average 
    
    const deletedData = await this.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          isDeleted: true,
        },
      },
      {
        new: true,
      }
    );

    if (!deletedData) {
      throw new ApiError.notFound(
        "Historical Winderature and Humidity Data not found"
      );
    }
    // const body2 = {
    //   detectionTime: deletedData?.detectionTime,
    //   direction: deletedData?.direction,
    //   speed: deletedData?.speed,
    // };

    // const updatedavg = await AvgWind.updateAvgWindByDate(body2);
    return deletedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
historicalWindSchema.statics.getOne = async function (id) {
  try {
    const data = await this.findOne({ _id: id }).populate("site", "name").cache('histWind').lean();
    if (!data) {
      throw new ApiError.notFound(
        "Historical Winderature and Humidity Data not found"
      );
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
historicalWindSchema.statics.getLatest = async function (devId) {
  try {
    // Find the latest historical Winderature entry
    const latestWindEntry = await this.findOne({ deviceId: devId })
      .sort({ detectionTime: -1 }) // Sort by detectionTime in descending order to get the latest entry
      .populate({
        path: "deviceId",
        model: "Device",
        select: "devId label type status location", // Include only state and coordinates fields from the Device model
      }).cache('histWind').lean();
      
    if (!latestWindEntry) {
      return null;
    }

    return latestWindEntry;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

historicalWindSchema.statics.getCount = async function () {
  try {
    const query = {
      isDeleted: { $ne: true },
    };

    // Apply any filtering criteria to the query here, similar to the get function

    const count = await this.countDocuments(query);
    return count;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports = mongoose.model("HistoricalWind", historicalWindSchema);
