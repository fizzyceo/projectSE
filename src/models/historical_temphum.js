const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require("../helpers/getUniqueId");
const moment = require("moment");
const ApiError = require("../error/api-error");
const AvgTemp = require("./avg_temp");
const device = require("./devices");

const historicaltempSchema = new mongoose.Schema(
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
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
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

historicaltempSchema.statics.getHistoricalTemphum = async function () {
  try {
    const limit = 10;
    const historicalData = await this.find({}).limit(limit);

    return historicalData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
//ERROR HERE
historicaltempSchema.statics.createHistoricalTemphum = async function (body) {
  console.log("testt in function");
  body.code = await getUniqueId(this);
  try {
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
        const startDate = moment(body.detectionTime).startOf("day").format("YYYY-MM-DD HH:mm");
        const endDate = moment(body.detectionTime).endOf("day").format("YYYY-MM-DD HH:mm");
        // Query for historical data within the date range
        const TempData = await this.find({
          detectionTime: {
            $gte: startDate,
            $lte: endDate,
          },
        });


        const Avgexists = await AvgTemp.findOne({
          detectionTime: body.detectionTime,
        });
        if (Avgexists) {
          // Calculate the average temperature
          const totaltemperature = TempData.reduce(
            (sum, data) => sum + data.temperature,
            0
          );
          console.log(totaltemperature, TempData.length);
          const averagetemperature = totaltemperature / TempData.length;
          // Calculate the average humidity

          const totalHumidity = TempData.reduce(
            (sum, data) => sum + data.humidity,
            0
          );
          console.log(totalHumidity, TempData.length);
          const averageHumidity = totalHumidity / TempData.length;
          console.log(TempData.length);
          console.log(averageHumidity, averagetemperature);
          //update the avg table by detectiondate
          const body2 = {
            detectionTime: body.detectionTime,
            humidity: averageHumidity,
            temperature: averagetemperature,
            count:TempData.length
          };
          console.log(body2);
          const updatedavg = await AvgTemp.updateAvgTempByDate(body2);
        } else {
          // No document with the specified date exists in the AvgTemp collection.
          console.log("No document found for the specified date.");
          const createAvg = await AvgTemp.createAvgTemp(body);
        }

        return historicalData;
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
historicaltempSchema.statics.updateHistoricalTemphum = async function (body) {
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

historicaltempSchema.statics.softDelete = async function (id) {
  try {
    const deletedData = await this.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!deletedData) {
      throw new ApiError.notFound(
        "Historical Temperature and Humidity Data not found"
      );
      
    }
    deletedData.detectionTime = moment(new Date(deletedData.detectionTime)).format(
      "YYYY-MM-DD"
    );
    console.log(deletedData.detectionTime);
    const found_avg = await AvgTemp.find({detectionTime:deletedData.detectionTime})
    console.log("AVG************************",found_avg);
    if(!found_avg){
      throw new Error("NO AVERAGE FOUND WITHING THAT DETECTION TIME ")
    }
    //we have found_avg[0].count   = totalTemp => (totalTemp - deletedData.temperature ) / count -1 
    // const NewavgTemp = ((found_avg[0].temperature*count) - deletedData.temperature) / (count -1)
    const NewAvgtemperature =((found_avg[0].temperature*found_avg[0].count) - deletedData.temperature) / (found_avg[0].count -1)
    console.log(found_avg[0].temperature, NewAvgHumidity);
    const NewAvgHumidity =((found_avg[0].humidity*found_avg[0].count) - deletedData.humidity) / (found_avg[0].count -1)

    const updating_Avg = await AvgTemp.findOneAndUpdate({_id:found_avg[0]._id},{
      $set:{
        humidity: NewAvgHumidity,
        temperature: NewAvgtemperature,
        count : found_avg[0].count-1
      }
    })  
    console.log(updating_Avg);
    if(!updating_Avg){
      throw new Error("Failed updating Average table ")
    }
    return deletedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
historicaltempSchema.statics.getOne = async function (id) {
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

historicaltempSchema.statics.getLatest = async function (devId) {
  try {
    // Find the latest historical temperature entry
    const latestTemperatureEntry = await this.findOne({ deviceId: devId })
      .sort({ detectionTime: -1 }) // Sort by detectionTime in descending order to get the latest entry
      .populate({
        path: "deviceId",
        model: "Device",
        select: "devId label type status location", // Include only state and coordinates fields from the Device model
      });

    if (!latestTemperatureEntry) {
      return null;
    }

    return latestTemperatureEntry;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

historicaltempSchema.statics.getCount = async function () {
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
module.exports = mongoose.model("HistoricalTemphum", historicaltempSchema);
