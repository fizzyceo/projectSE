const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require('../helpers/getUniqueId');
const moment = require('moment');
const ApiError = require("../error/api-error");

const alertSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },

        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device',
        },
        detectionTime: {
            type: String,
            default: moment(new Date()).format("YYYY-MM-DD HH:mm")
        },
        type: {
            type: String,
            required: true

        },
        location: {
            type: pointSchema,
        },
        wilaya: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true
        },
        photo: {
            type: {
                _id: mongoose.Schema.ObjectId,
                normal: String,
                small: String
            },
        },
        falsePositive: {
            type: Boolean,
            default: false
        },
        labels: {
            type: Array,
            default: []
        },
        icon: {
            type: String
        },
        locationAccurate: {
            type: Number,
            default: null
        },
        source: {
            type: String,
            enum: ['user', 'device'],
            default: 'device'
        },
        expiredAt: {
            type: Date,
            default: moment(new Date()).add(1, 'minutes')
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true },
);

alertSchema.statics.get = async function (body) {
    const page = (body.page || 1) - 1;
    const limit = body.limit || 10;
    const skip = page * limit;
    const sort = [[body.sortField || "createdAt", body.sortDirection || "desc"]];
    let options = {
        code: 1,
        location: 1,
        wilaya: 1,
        region: 1,
        type: 1,
        falsePositive: 1,
        detectionTime: 1,
        locationAccurate: 1,
        isDeleted: 1,
        source: 1,
        photo: 1,
        icon: 1,
        device: 1,
        createdAt: 1,
        updatedAt: 1,
        expiredAt: 1
    }
    if (body.devId) {
        let device = await mongoose.model('Device').findOne({ devId: body.devId })
        if (!device) {
            return []
        }
        body.device = device._id
    }
    const alerts = await this.find({
        isDeleted: { $ne: true },
        ...(body.falsePositive && { falsePositive: body.falsePositive }),
        ...(body.wilaya && { wilaya: { $regex: `^${body.wilaya}`, $options: 'i' } }),
        ...(body.region && { region: body.region }),
        ...(body.type && { type: { $regex: `^${body.type}`, $options: 'i' } }),
        ...(body.code && { code: body.code }),
        ...(body.detectionTime && { detectionTime: body.detectionTime }),
        ...(body.device && { device: body.device }),
        ...(body.search && {
            $or: [
                { code: { $regex: body.search, $options: 'i' } },
                { type: { $regex: body.search, $options: 'i' } },
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
        .populate('device', 'devId')
        .skip(skip)
        .limit(limit).cache('alert').lean();

    // //check if document is expired
    // const isExpired = (alert) => {
    //     return moment(alert.expiredAt).isBefore(moment(new Date()))
    // }
    // //filter expired alerts
    // alerts.filter(alert => !isExpired(alert))
    return alerts;
};

alertSchema.index({ location: '2dsphere' });
alertSchema.statics.getAlertsByDates = async function (body){
    try {
      
        const limit = 10;
    
        const Data = await this.find({
          detectionTime:{
            $gte: body.selectedDates[0],
            $lte: body.selectedDates[1]
          }
        } )
          .limit(limit);
    
        return Data;
      } catch (error) {
        console.error(error);
        throw error;
      }
}
// create alert
alertSchema.statics.createAlert = async function (body) {
    if (body.location) {
        body.location = {
            type: 'Point',
            coordinates: body.location
        }
    }
    if (body.detectionTime) {
        body.detectionTime = moment(body.detectionTime).format("YYYY-MM-DD HH:mm")
    }
    body.code = await getUniqueId(this);
    const alert = new this(body)
    await alert.save();
    return alert;
}

// update alert
alertSchema.statics.updateAlert = async function (body) {
    const newAlert = await this.findByIdAndUpdate({
        _id: body.id
    }, {
        $set: body
    }, {
        new: true
    })
    if (!newAlert)
        throw ApiError.notFound('Alert not found')
    return newAlert;
}

// soft delete 
alertSchema.statics.softDelete = async function (body) {
    const alert = await this.findByIdAndUpdate({
        _id: body.id
    }, {
        $set: {
            isDeleted: true
        }
    }, {
        new: true
    })
    if (!alert)
        throw ApiError.notFound('Alert not found')
    return alert;
}

//get one
alertSchema.statics.getOne = async function (id) {
    const alert = await this.findOne({
        _id: id
    }).populate('device', 'devId').cache('alert')
    if (!alert)
        throw ApiError.notFound('Alert not found')

    return alert;
}

alertSchema.statics.createMany = async function (data) {
    // check for the alerts with same incident id 
    // make two arrays one to update and other to insert
    const existedAlerts = await this.find({
        code: { $in: data.map(alert => alert.code) }
    }).lean()
    const existedAlertsCodes = existedAlerts.map(alert => alert.code)
    const alertsToUpdate = data.filter(alert => existedAlertsCodes.includes(alert.code))
    const alertsToInsert = data.filter(alert => !existedAlertsCodes.includes(alert.code))
    // update the existed alerts
    if (alertsToUpdate.length>0)
        await Promise.all(alertsToUpdate.map(async alert => {
            try {
                await this.
                    findOneAndUpdate({
                        code: alert.code
                    }, {
                        $set: { ...alert, expiredAt: moment(new Date()).add(1, 'minutes') }
                    }, {
                        new: true
                    })
            } catch (err) {
                console.log(err)
            }
        }))
    // update the existed alerts
    if (alertsToInsert.length>0)
         await this.insertMany(alertsToInsert)
    
}

alertSchema.statics.getAlertsCount = async function (body) {
    if (body.devId) {
        let device = await mongoose.model('Device').findOne({ devId: body.devId })
        if (!device) {
            return 0
        }
        device = device._id
    }
    const count = await this.countDocuments({
        isDeleted: { $ne: true },
        ...(body.falsePositive && { falsePositive: body.falsePositive }),
        ...(body.wilaya && { wilaya: { $regex: body.wilaya, $options: 'i' } }),
        ...(body.region && { region: body.region }),
        ...(body.type && { type: { $regex: `^${body.type}`, $options: 'i' } }),
        ...(body.code && { code: body.code }),
        ...(body.detectionTime && { detectionTime: body.detectionTime }),
        ...(body.search && {
            $or: [
                { code: { $regex: body.search, $options: 'i' } },
                { type: { $regex: body.search, $options: 'i' } },
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
    })
    return count;
}
module.exports = mongoose.model("Alert", alertSchema);


const updateMany = async () => {
    const alerts = await mongoose.model("Alert", alertSchema).updateMany({
        isDeleted: false
    }, {
        $set: {
            expiredAt: moment(new Date()).add(1, 'days')
        }
    })
}

// updateMany()

// delete many 

