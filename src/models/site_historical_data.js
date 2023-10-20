const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require("../helpers/getUniqueId");
const moment = require("moment");
const ApiError = require("../error/api-error");
const AvgTemp = require("./avg_temp");
const device = require("./devices");

const siteHistoricalData = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    // site:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Site'
    // },
    siteId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Site'
    },
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
    direction: {
        type: String,
        enum: ["N", "SE", "E", "W", "NE", "NW", "S", "SW"],
        required: true,
      },
      speed: {
        type: Number,
        required: true,
      },
      globalStatus:{
        type: String,
        enum: ["good", "danger"],
        default: "good",
      },
      statusFDI: {
        type: String,
  
        default: "good",
      },
      status30: {
        type: String,
  
        default: "good",
      },
    source: {
      type: String,
      enum: ["user", "device"],
      default: "device",
    },
    isDangerous:{
      type: Boolean,
      default: false,
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
siteHistoricalData.statics.getHistory = async function (body) {
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
      humidity: 1,
      temperature: 1,
      direction:1,
      speed:1,
      source: 1,
      isDangerous:1,
      statusFDI:1,
      status30:1,
      globalStatus:1,
      deviceId: 1,
      siteId: 1,
      isDeleted: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    const siteData = await this.find(
      {
        isDeleted: { $ne: true },
        ...(body?.humidity && { humidity: body?.humidity }),
        ...(body?.isDangerous && { isDangerous: body?.isDangerous }),
        ...(body?.temperature && { temperature: body?.temperature }),
        ...(body?.direction && { direction: body?.direction }),
        ...(body?.detectionTime && { detectionTime: body?.detectionTime }),
        ...(body?.speed && { speed: body?.speed }),
        ...(body?.globalStatus && { globalStatus: body?.globalStatus }),
        ...(body?.statusFDI && { statusFDI: body?.statusFDI }),
        ...(body?.status30 && { status30: body?.status30 }),
        ...(body?.source && { source: body?.source }),
        ...(body?.deviceId && { deviceId: body?.deviceId }),
        ...(body?.siteId && { siteId: body?.siteId }),
        ...(body?.code && { code: body?.code }),
        
        ...(body?.search && {
          $or: [
            { code: { $regex: body?.search, $options: "i" } },
            { detectionTime: { $regex: body?.search, $options: "i" } },
            { source: { $regex: body?.search, $options: "i" } },
            { globalStatus: { $regex: body?.search, $options: "i" } },
            { statusFDI: { $regex: body?.search, $options: "i" } },
            { status30: { $regex: body?.search, $options: "i" } },
            { isDangerous: { $regex: body?.search, $options: "i" } },
            { source: { $regex: body?.search, $options: "i" } },
            { source: { $regex: body?.search, $options: "i" } },

            { deviceId: { $regex: body?.search, $options: "i" } },
            { siteId: { $regex: body?.search, $options: "i" } },
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
      .cache("siteHistory")
      .lean();
    return siteData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


//ERROR HERE
siteHistoricalData.statics.create = async function (body) {
  body.code = await getUniqueId(this);
  try {
    if (body.detectionTime) {
        body.detectionTime = moment(body.detectionTime).format("YYYY-MM-DD HH:mm")
    }
    const siteHistory = new this(body)
    await siteHistory.save();
    return siteHistory;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
siteHistoricalData.statics.update = async function (body) {
  try {
    const { id, ...updateFields } = body;
    const updatedData = await this.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedData) {
      throw new ApiError.notFound(
        "Historical Site Data not found"
      );
    }
    return updatedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

siteHistoricalData.statics.softDelete = async function (id) {
  try {
    const deletedData = await this.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    if (!deletedData) {
      throw new ApiError.notFound(
        "Historical Site Data not found"
      );
    }
    return deletedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
siteHistoricalData.statics.getOne = async function (id) {
  try {
    const data = await this.findOne({ _id: id }).cache('siteHistory').lean();
    if (!data) {
      throw new ApiError.notFound(
        "Historical Site Data not found"
      );
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


siteHistoricalData.statics.getCount = async function () {
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
module.exports = mongoose.model("siteHistory", siteHistoricalData);
