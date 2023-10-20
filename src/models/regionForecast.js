const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require('../helpers/getUniqueId');
const moment = require('moment');
const ApiError = require("../error/api-error");

const regionSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },

        regionId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'region'
        },
        coordinates: {
            type: pointSchema,
        },
       date_0:{
            type: String,
            required: true
       },
       date_24:{
            type: String,
            required: true
       },
       date_48:{
            type: String,
            required: true
       },
       date:{
        type: String,
       },
       temperature:{
        type: Number,
       },
       windSpeed:{
        type: Number,
        },
        windDirectionDegrees:{
            type: Number,
            },
        percipitation:{
            type: Number,
        },
        humidity:{
            type: Number,
        },
        FDI:{
            type: String,

        },
        isDangerous_FDI:{
            type:Boolean,

        },
        rule30:{
            type: String,

        },


       //date_0 24...
       //current temp wind...
           
        name:{
            type: String,
            required: true
        },
        temperature_0:{
            type: Number,
            required: true
        },
        windSpeed_0:{
            type: Number,
            required: true
        },
        windDirectionDegrees_0:{
            type: Number,
            required: true
        },
        percipitation_0:{
            type: Number,
            required: true
        },
        humidity_0:{
            type: Number,
            required: true
        },
        temperature_24:{
            type: Number,
            required: true
        },
        windSpeed_24:{
            type: Number,
            required: true
        },
        windDirectionDegrees_24:{
            type: Number,
            required: true
        },
        percipitation_24:{
            type: Number,
            required: true
        },
        humidity_24:{
            type: Number,
            required: true
        },
        temperature_48:{
            type: Number,
            required: true
        },
        windSpeed_48:{
            type: Number,
            required: true
        },
        windDirectionDegrees_48:{
            type: Number,
            required: true
        },
        percipitation_48:{
            type: Number,
            required: true
        },
        humidity_48:{
            type: Number,
            required: true
        },
        FDI_0:{
            type: String,
            required: true
        },
        FDI_24:{
            type: String,
            required: true
        },
        FDI_48:{
            type: String,
            required: true
        },
        rule30_0:{
            type: String,
            required: true
        },
        rule30_24:{
            type: String,
            required: true
        },
        rule30_48:{
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }

);
// const forecastSchema = new mongoose.Schema({
    //     date: { type: String, required: true },
    //     temperature: { type: Number, required: true },
    //     windSpeed: { type: Number, required: true },
    //     windDirectionDegrees: { type: Number, required: true },
    //     precipitation: { type: Number, required: true },
    //     humidity: { type: Number, required: true },
    //     FDI: { type: Number, required: true },
    //     rule30: { type: String, required: true }
    // });
    
    // const regionSchema = new mongoose.Schema(
    //     {
    //         code: { type: String, required: true, unique: true },
    //         coordinates: {
    //             type: pointSchema,
    //         },
    //         name: {
    //             type: String,
    //             required: true
    //         },
    //         forecast_0: { type: forecastSchema, required: true },
    //         forecast_24: { type: forecastSchema, required: true },
    //         forecast_48: { type: forecastSchema, required: true },
    //         isDeleted: {
    //             type: Boolean,
    //             default: false
    //         }
    //     },
    //     { timestamps: true }
    // );
    
regionSchema.statics.get = async function (body) {

    let options = {
        code: 1,
        regionId:1,
        coordinates: 1,
        isDeleted: 1,
        name:1,
        rule30_48:1,
        rule30_24:1,
        rule30_0:1,
        rule30:1,
        FDI:1,
        isDangerous_FDI:1,
        humidity:1,
        percipitation:1,
        windSpeed:1,
        temperature:1,
        windDirectionDegrees:1,
        humidity_0:1,
        percipitation_0:1,
        windSpeed_0:1,
        temperature_0:1,
        windDirectionDegrees_0:1,
        humidity_24:1,
        percipitation_24:1,
        windSpeed_24:1,
        temperature_24:1,
        windDirectionDegrees_24:1,
        humidity_48:1,
        percipitation_48:1,
        windSpeed_48:1,
        temperature_48:1,
        windDirectionDegrees_48:1,
        FDI_48:1,
        FDI_24:1,
        FDI_0:1,
        date:1,
        date_0:1,
        date_24:1,
        date_48:1,
        createdAt:1,
        updatedAt:1

    }
    const regions = await this.find({
        isDeleted: { $ne: true },

        ...(body.code && { code: body.code }),
        ...(body.regionId && { regionId: body.regionId }),
        ...(body.name && { name: body.name }),
        ...(body.date && { date: body.date }),
        ...(body.FDI_0 && { FDI_0: body.FDI_0 }),
        ...(body.FDI_24 && { FDI_24: body.FDI_24 }),
        ...(body.FDI_48 && { FDI_48: body.FDI_48}),
        ...(body.rule30_0 && { rule30_0: body.rule30_0 }),
        ...(body.rule30_24 && { rule30_24: body.rule30_24 }),
        ...(body.rule30_48 && { rule30_48: body.rule30_4 }),
        ...(body.windSpeed_0 && { windSpeed_0: body.windSpeed_0 }),
        ...(body.windDirectionDegrees_0 && { windDirectionDegrees_0: body.windDirectionDegrees_0 }),
        ...(body.humidity_0 && { humidity_0: body.humidity_0 }),
        ...(body.percipitation_0 && { percipitation_0: body.percipitation_0 }),
        ...(body.temperature_0 && { temperature_0: body.temperature_0 }),
        ...(body.isDeleted && { isDeleted: body.isDeleted }),

        ...(body.search && {
            $or: [
                { code: { $regex: body.search, $options: 'i' } },
                { regionId: { $regex: body.search, $options: 'i' } },
                { name: { $regex: body.search, $options: 'i' } },
                { FDI_0: { $regex: body.search, $options: 'i' } },
                { FDI_24: { $regex: body.search, $options: 'i' } },
                { FDI_48: { $regex: body.search, $options: 'i' } },
                { rule30_0: { $regex: body.search, $options: 'i' } },
                { rule30_24: { $regex: body.search, $options: 'i' } },
                { rule30_48: { $regex: body.search, $options: 'i' } },
                
            ]
        }),
        ...(body.coordinates && {
            coordinates: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: body.coordinates
                    },
                    // $maxDistance: body.maxDistance
                }
            }
        }),

    }, options).cache('regionsData').lean();


    return regions;
};

regionSchema.statics.createRegionForecast = async function (body) {
    if (body.coordinates) {
        body.coordinates = {
            type: 'Point',
            coordinates: body.coordinates
        };
    }

    const existingForecast = await this.findOne({ name: body.name }).lean();

    if (existingForecast) {
        try {
            const updated = await this.findOneAndUpdate(
                { code: existingForecast.code },
                { $set: { ...body } },
                { new: true }
            );
            return updated;
        } catch (err) {
            console.log(err);
        }
    } else {
        body.code = await getUniqueId(this);
        const regionForecast = new this(body);
        await regionForecast.save();
        return regionForecast;
    }
};



// update region

// soft delete 
regionSchema.statics.softDelete = async function (body) {
    const regionForecast = await this.findByIdAndUpdate({
        _id: body.id
    }, {
        $set: {
            isDeleted: true
        }
    }, {
        new: true
    })
    if (!regionForecast)
        throw ApiError.notFound('regionForecast not found')
    return regionForecast;
}

//get one
regionSchema.statics.getOne = async function (id) {
    const regionForecast = await this.findOne({
        _id: id
    }).cache('regionsData')
    if (!regionForecast)
        throw ApiError.notFound('regionForecast not found')

    return regionForecast;
}


regionSchema.statics.getRegionsForecastCount = async function (body) {
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
module.exports = mongoose.model("regionForecast", regionSchema);


// updateMany()

// delete many 

