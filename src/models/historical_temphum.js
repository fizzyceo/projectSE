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
    const historicalData = new this(body);
    await historicalData.save();
    const TempData = await this.find({ detectionTime: body.detectionTime });

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

      console.log(averageHumidity, averagetemperature);
      //update the avg table by detectiondate
      const body2 = {
        detectionTime: body.detectionTime,
        humidity: averageHumidity,
        temperature: averagetemperature,
      };
      console.log(body2);
      const updatedavg = await AvgTemp.updateAvgTempByDate(body2);

    } else {
      // No document with the specified date exists in the AvgTemp collection.
      console.log("No document found for the specified date.");
      const createAvg = await AvgTemp.createAvgTemp(body)
      
    }

    return historicalData;
  } else {
      throw new Error("device not found");
    }
  }else{
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
