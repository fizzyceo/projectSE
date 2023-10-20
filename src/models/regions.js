const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require('../helpers/getUniqueId');
const moment = require('moment');
const ApiError = require("../error/api-error");

const regionSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },

        type: {
            type: String,
            required: true

        },

        coordinates: {
            type: pointSchema,
        },
        number:{
            type: Number,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
);

regionSchema.statics.get = async function (body) {

    let options = {
        code: 1,
        coordinates: 1,
        isDeleted: 1,
        name:1,
        number:1


    }
    const regions = await this.find({
        isDeleted: { $ne: true },

        ...(body?.code && { code: body?.code }),
        ...(body?.name && { name: body?.name }),
        ...(body?.number && { number: body?.number }),
        ...(body?.search && {
            $or: [
                { code: { $regex: body.search, $options: 'i' } },
                { name: { $regex: body.search, $options: 'i' } },
                { number: { $regex: body.search, $options: 'i' } },
            ]
        }),
        ...(body?.coordinates && {
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

    }, options).cache('regions').lean();


    return regions;
};

regionSchema.statics.createRegion = async function (body) {
    if (body.coordinates) {
        body.coordinates = {
            type: 'Point',
            coordinates: body.coordinates
        }
    }

    body.code = await getUniqueId(this);
    const region = new this(body)
    await region.save();
    return region;
}

// update region
regionSchema.statics.updateRegion = async function (body) {
    const newregion = await this.findByIdAndUpdate({
        _id: body.id
    }, {
        $set: body
    }, {
        new: true
    })
    if (!newregion)
        throw ApiError.notFound('region not found')
    return newregion;
}

// soft delete 
regionSchema.statics.softDelete = async function (body) {
    const region = await this.findByIdAndUpdate({
        _id: body.id
    }, {
        $set: {
            isDeleted: true
        }
    }, {
        new: true
    })
    if (!region)
        throw ApiError.notFound('region not found')
    return region;
}

//get one
regionSchema.statics.getOne = async function (id) {
    const region = await this.findOne({
        _id: id
    })
    // .cache('regions')
    if (!region)
        throw ApiError.notFound('Region not found')

    return region;
}

regionSchema.statics.createMany = async function (data) {



    // Insert the new regions
    if (data.length > 0) {
        for (let region of data) {
            const code = await getUniqueId(this); // Assuming 'this' refers to the context needed for getUniqueId
            region.code = code;
            if (region.coordinates) {
                region.coordinates = {
                    type: 'Point',
                    coordinates: region.coordinates
                }
            }
        }

        try {

            const regions = await this.insertMany(data);
                console.log(regions);
            return regions;

        } catch (error) {
            console.log(error?.message);
            console.error(error);
            // Handle the error appropriately
        }
    }
    

};

regionSchema.statics.getRegionsCount = async function (body) {
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
module.exports = mongoose.model("region", regionSchema);


// updateMany()

// delete many 

