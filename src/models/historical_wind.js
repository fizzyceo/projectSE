const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require("../helpers/getUniqueId");
const moment = require("moment");
const ApiError = require("../error/api-error");
const AvgWind = require("./avg_wind");

const device = require("./devices");
const { default: axios } = require("axios");
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

historicalWindSchema.statics.getHistoricalWind = async function () {
  try {
    const historicalData = await this.find({});

    return historicalData;
  } catch (error) {
    console.error(error);
    throw error;
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
          // No document with the specified date exists in the AvgTemp collection.
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
        "Historical Temperature and Humidity Data not found"
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
        "Historical Temperature and Humidity Data not found"
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
    const data = await this.findOne({ _id: id }).populate("site", "name");
    if (!data) {
      throw new ApiError.notFound(
        "Historical Temperature and Humidity Data not found"
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
    // Find the latest historical temperature entry
    const latestWindEntry = await this.findOne({ deviceId: devId })
      .sort({ detectionTime: -1 }) // Sort by detectionTime in descending order to get the latest entry
      .populate({
        path: "deviceId",
        model: "Device",
        select: "devId label type status location", // Include only state and coordinates fields from the Device model
      });

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
