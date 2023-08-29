const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require("../helpers/getUniqueId");
const moment = require("moment");
const ApiError = require("../error/api-error");
const AvgWind = require("./avg_wind");

const device = require("./devices");
const { default: axios } = require("axios");
async function calculate_avg(detectionTime) {
  try {
    // Find all historical wind data for the given detectionTime
    const windData = await this.find({ detectionTime });

    if (windData.length === 0) {
      return {
        averageSpeed: 0,
        dominantDirection: null,
      };
    }

    // Calculate the average speed
    const totalSpeed = windData.reduce((sum, data) => sum + data.speed, 0);
    const averageSpeed = totalSpeed / windData.length;

    // Count occurrences of "left" and "right" directions
    const directionCounts = {
      left: 0,
      right: 0,
    };

    windData.forEach((data) => {
      if (data.direction === "left") {
        directionCounts.left += 1;
      } else if (data.direction === "right") {
        directionCounts.right += 1;
      }
    });

    // Determine the dominant direction
    let dominantDirection = null;
    if (directionCounts.left > directionCounts.right) {
      dominantDirection = "left";
    } else if (directionCounts.right >= directionCounts.left) {
      dominantDirection = "right";
    }

    return {
      averageSpeed,
      dominantDirection,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
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
      enum: ["left", "right"],
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
        const historicalData = new this(body);
        await historicalData.save();

        //*********************AVG CALCULATIONS********************************************
        const windData = await this.find({ detectionTime: body.detectionTime });

        const Avgexists = await AvgWind.findOne({
          detectionTime: body.detectionTime,
        });
        if (Avgexists) {
          // Calculate the average speed
          const totalSpeed = windData.reduce(
            (sum, data) => sum + data.speed,
            0
          );
          const averageSpeed = totalSpeed / windData.length;

          // Count occurrences of "left" and "right" directions
          const directionCounts = {
            left: 0,
            right: 0,
          };

          windData.forEach((data) => {
            if (data.direction === "left") {
              directionCounts.left += 1;
            } else if (data.direction === "right") {
              directionCounts.right += 1;
            }
          });
          // Determine the dominant direction
          let dominantDirection = null;
          if (directionCounts.left > directionCounts.right) {
            dominantDirection = "left";
          } else if (directionCounts.right >= directionCounts.left) {
            dominantDirection = "right";
          }
          //update the avg table by detectiondate
          const body2 = {
            detectionTime: body.detectionTime,
            direction: dominantDirection,
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
    }else{
      throw new Error("theres no device Id");

    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
historicalWindSchema.statics.updateHistoricalWind = async function (body) {
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
