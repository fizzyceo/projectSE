const mongoose = require("mongoose");
const { getUniqueId } = require('../helpers/getUniqueId');
const moment = require('moment');
const ApiError = require("../error/api-error");

const AvgTempSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        // site:{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref:'Site'
        // },
 
        detectionTime: {
            type: String,
            default: moment(new Date()).format("YYYY-MM-DD HH:mm")
        },
       temperature:{
            type:Number,
            required: true,
            
       },
       humidity:{
            type:Number,
            required: true,

       },
       count:{
        type:Number,
        
       },
        source: {
            type: String,
            enum: ['user', 'device'],
            default: 'device'
        },
        isDeleted: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true },
);

AvgTempSchema.statics.getAvgTemp= async function() {
    try {
    
        const limit = 10;
    
        const AvgData = await this.find({} )
          .limit(limit);
    
        return AvgData;
      } catch (error) {
        console.error(error);
        throw error;
      }
}
//ERROR HERE
AvgTempSchema.statics.createAvgTemp= async function(body) {
    console.log("testt in function");
    body.code = await getUniqueId(this);
    try {
      const AvgData = new this(body);
      await AvgData.save();
      return AvgData;
    } catch (error) {
      console.error(error);
      throw error;
    }
}
AvgTempSchema.statics.updateAvgTemp= async function(body) {
    try {
        const { id, ...updateFields } = body;
        const updatedData = await this.findByIdAndUpdate(
          id,
          { $set: updateFields },
          { new: true }
        );
        if (!updatedData) {
          throw new ApiError.notFound(
            "Avg Temperature and Humidity Data not found"
          );
        }
        return updatedData;
      } catch (error) {
        console.error(error);
        throw error;
      }
}

AvgTempSchema.statics.updateAvgTempByDate = async function (body) {
    try {
      const { detectionTime, ...updateFields } = body;
      const updatedData = await this.updateOne(
          { detectionTime: detectionTime },
          { $set: updateFields },
          { new: true }
        );
        //if it isnt in the table create a new one with the detectiontime, speed and direction
      
      if (!updatedData) {
        throw new ApiError.notFound(
          "Avg Temperature and Humidity Data not found"
        );
      }
      return updatedData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  AvgTempSchema.statics.getAvgTempBetweenDates = async function (body) {

    try {
      
      const limit = 10;
  
      const AvgData = await this.find({
        detectionTime:{
          $gte: body.selectedDates[0],
          $lte: body.selectedDates[1]
        }
      } )
        .limit(limit);
  
      return AvgData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
AvgTempSchema.statics.softDelete = async function(id) {
    try {
        const deletedData = await this.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } },
            { new: true }
        );
        if (!deletedData) {
            throw new ApiError.notFound('Historical Temperature and Humidity Data not found');
        }
        return deletedData;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
AvgTempSchema.statics.getOne=async function(id) {
    try {
        const data = await this.findOne({ _id: id }).populate('site', 'name');
        if (!data) {
            throw new ApiError.notFound('Historical Temperature and Humidity Data not found');
        }
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
 AvgTempSchema.statics.getCount=async function() {
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
}
module.exports =mongoose.model('AvgTempSchema', AvgTempSchema);
