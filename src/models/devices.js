const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require('../helpers/getUniqueId');
const moment = require('moment');
const ApiError = require("../error/api-error");
const deviceSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        status: {
            type: String
        },
        statusDetails: {
            type: String
        },
        devId: {
            type: String,
            unique: true,
            required: true
        },
        type: {
            type: String,
            enum:['camera','wind','temperature',"windTemp"],
            required: true


        },
        battery:{   
              type: Number,

        },
        signal:{
            type:Number
        },
        location: {
            type: pointSchema,
        },
        label: {
            type: String,
            required: true
        },
        version: {
            type: String,
            required: true
        },
        wilaya: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true
        },
        lastOnline: {
            type: String,
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        siteId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Site'
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }

    },
    { timestamps: true },
);
deviceSchema.index({ location: '2dsphere' });

deviceSchema.statics.get = async function (body) {
    const page = (body.page || 1) - 1;
    const limit = body.limit || 10;
    const skip = page * limit;
    const sort = [[body.sortField || "createdAt", body.sortDirection || "desc"]];
    let options = {
        code: 1,
        label: 1,
        status: 1,
        location: 1,
        version: 1,
        battery: 1,
        signal: 1,
        wilaya: 1,
        region: 1,
        statusDetails:1,
        type: 1,
        devId:1,
        siteId:1,
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1,
    }
    const devices = await this.find({
        isDeleted: { $ne: true },
        ...(body.wilaya && { wilaya: body.wilaya }),
        ...(body.siteId && { siteId: body.siteId }),
        ...(body.region && { region: body.region }),
        ...(body.type && { type: body.type }),
        ...(body.label && { label: body.label }),
        ...(body.status && { status: body.status }),
        ...(body.devId && { devId: body.devId }),
        ...(body.code && { code: body.code }),
        ...(body.version && { version: body.version }),
        ...(body.battery && { battery: body.battery }),
        ...(body.signal && { signal: body.signal }),
        ...(body.search && {
            $or: [
                { code: { $regex: body.search, $options: 'i' } },
                { label: { $regex: body.search, $options: 'i' } },
                { type: { $regex: body.search, $options: 'i' } },
                { version: { $regex: body.search, $options: 'i' } },
                { wilaya: { $regex: body.search, $options: 'i' } },
                { region: { $regex: body.search, $options: 'i' } },
            ]
        }),
        ...(body.location && {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: body.location
                    },
                    // $maxDistance: body.maxDistance
                }
            }
        }),
        ...(body.dateFrom &&
            body.dateTo && {
            createdAt: { $gte: body.dateFrom, $lte: body.dateTo }
        }),
    }, options).sort(sort)
        .skip(skip)
        .limit(limit).cache('device').lean();
    return devices;
};


// create device
deviceSchema.statics.createDevice = async function (body) {

    const oldDevice = await this.findOne({ devId: body.devId })
    if (oldDevice)
        throw ApiError.badRequest('Device already exist')
    if (body.location) {
        body.location = {
            type: 'Point',
            coordinates: body.location
        }
    }
    body.code = await getUniqueId(this);
    const device = new this(body)
    await device.save();
    return device;
}

// update device
deviceSchema.statics.updateDevice = async function (body) {
    if (body.location) {
        body.location = {
            type: 'Point',
            coordinates: body.location
        }
    }
    const device = await this.findById(body.id)
    if (!device)
        throw ApiError.notFound('Device not found')
    //change last update 
    if (body.status !== device.status) {
        body.lastOnline = moment(new Date()).format("YYYY-MM-DD HH:mm");
    }

    const newDevice = await this.findByIdAndUpdate({
        _id: body.id
    }, {
        $set: body
    }, {
        new: true
    })
    return newDevice;
}

// soft delete 
deviceSchema.statics.softDelete = async function (body) {
    const device = await this.findByIdAndUpdate({
        _id: body.id
    }, {
        $set: {
            isDeleted: true,
            updatedBy: body.userId
        }
    }, {
        new: true
    })
    if (!device)
        throw ApiError.notFound('Device not found')
    return device;
}

//get one
deviceSchema.statics.getOne = async function (id) {
    const device = await this.findOne({
        _id: id
    }).cache('device');
    if (!device)
        throw ApiError.notFound('Device not found')
    return device;
}
deviceSchema.statics.getDevicesCount=async function (body){
    const count = await this.countDocuments({
        isDeleted: { $ne: true },
        ...(body.wilaya && { wilaya: body.wilaya }),
        ...(body.region && { region: body.region }),
        ...(body.type && { type: body.type }),
        ...(body.label && { label: body.label }),
        ...(body.status && { status: body.status }),
        ...(body.devId && { devId: body.devId }),
        ...(body.code && { code: body.code }),
        ...(body.version && { version: body.version }),
        ...(body.search && {
            $or: [
                { code: { $regex: body.search, $options: 'i' } },
                { label: { $regex: body.search, $options: 'i' } },
                { type: { $regex: body.search, $options: 'i' } },
                { version: { $regex: body.search, $options: 'i' } },
                { wilaya: { $regex: body.search, $options: 'i' } },
                { region: { $regex: body.search, $options: 'i' } },
                { devId: { $regex: body.search, $options: 'i' } },
            ]
        }),
        ...(body.location && {
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: body.location
                    },
                    // $maxDistance: body.maxDistance
                }
            }
        }),
        ...(body.dateFrom &&
            body.dateTo && {
            createdAt: { $gte: body.dateFrom, $lte: body.dateTo }
        }),
    })
    return count;
}
module.exports = mongoose.model("Device", deviceSchema);


