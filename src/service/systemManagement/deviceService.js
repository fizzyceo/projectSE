const nextError = require('../../helpers/errorTypeFunction');
const _ = require('lodash');
const ApiError = require('../../error/api-error');
const { db } = require('../../models');
const { logger } = require('../../Logger')
const moment = require('moment')
// create device 
const createDevice = async (userId, body) => {
    try {
        body.createdBy = userId
        body.updatedBy = userId
        const device = await db.Device.createDevice(body)
        return {
            result: true,
            message: 'Device created successfully',
            data: _.omit(device, ['updatedAt', '__v', '_id'])
        };
    } catch (e) {
        logger.error(JSON.stringify(e))
    }
}

// update device
const updateDevice = async (userId, deviceId, body) => {
    body.id = deviceId
    body.updatedBy = userId
    const newDevice = await db.Device.updateDevice(body)
    return {
        result: true,
        message: 'Device updated successfully',
        data:newDevice
    };
}

//delete

const deleteDevice = async (userId, deviceId) => {
    let body={}
    body.id = deviceId
    body.userId = userId
    const deleteDevice = await db.Device.softDelete(body)

    return {
        result: true,
        message: 'Device deleted successfully',
    }
}

// get all
const getDevices = async (body) => {
    const devices = await db.Device.get(body)
    const count = await db.Device.getDevicesCount(body)

    return {
        result: true,
        message: 'Device data fetched successfully',
        data: devices,
        count
    }
}

// get one
const getDevice = async (deviceId) => {
    const device = await db.Device.getOne(deviceId)
    return {
        result: true,
        message: 'Device data fetched successfully',
        data: device
    }
}

const getMqttDeviceAndUpdate = async (data) => {
    try {

        const device = await db.Device.findOne({ devId: data.devId });
        if (!device) {
            logger.error('MQTT: Device not found')
            return null
        }

        db.Device.updateDevice({
            id:device._id,
            status: data.status ? "online" : "offline",
            statusDetails: data.statusDetails || "",
            ...(
                (device.status !== (data.status ? "online" : "offline"))
                && { lastOnline: moment(new Date()).format("YYYY-MM-DD HH:mm") }
            )

        })
        return {
            wilaya: device.wilaya,
            region: device.region,
            _id:device._id
        }
    } catch (e) {
        logger.error(JSON.stringify(e))
    }
}
module.exports = {
    createDevice,
    updateDevice,
    deleteDevice,
    getDevices,
    getDevice,
    getMqttDeviceAndUpdate
}