const nextError = require('../../helpers/errorTypeFunction');
const _ = require('lodash');
const ApiError = require('../../error/api-error');
const { db } = require('../../models');
const { logger } = require('../../Logger');
const { uploadImage } = require('../mqttFileUpload')
const { getUniqueId } = require('../../helpers/getUniqueId');
const moment = require('moment');
const { client } = require('../../cachingSystem/redisClient')


// create alert 
const createAlert = async (userId, body) => {
    userId ? body.source = "user" : "device";
    const device = await db.Device.findOne({ ...(body.device && { _id: body.device }), ...(body.devId && { devId: body.devId }) });
    body.wilaya = device.wilaya;
    body.region = device.region;
    body.devId = device.devId
    const alert = await db.Alert.createAlert(body);
    return {
        result: true,
        message: 'Alert created successfully',
        data: _.omit(alert, ['updatedAt', '__v', '_id'])
    };
}

const createMany = async (device, alerts) => {
    try {
        let body = await Promise.all(alerts.map(async (alert) => ({
            device: device._id,
            wilaya: device.wilaya,
            region: device.region,
            type: alert.type,
            location: {
                type: 'Point',
                coordinates: [alert.lat, alert.lon]
            },
            locationAccurate: alert.locAccu,
            icon: alert.icon,
            photo: await uploadImage(alert.img, 'photos'),
            labels: alert.labels,
            detectionTime: moment(new Date(alert.ts)).format("YYYY-MM-DD HH:mm") || moment(new Date()).format("YYYY-MM-DD HH:mm"),
            source: 'device',
            code: alert.id,
            expiredAt: moment(new Date()).add(1, 'minutes')
        })))
        // upload all photos 

         await db.Alert.createMany(body);
        client.del('alert')
    } catch (e) {
        logger.error(JSON.stringify(e))
    }
}
// update alert
const updateAlert = async (userId, alertId, body) => {
    body.id = alertId
    const newAlert = await db.Alert.updateAlert(body)
    return {
        result: true,
        message: 'Alert updated successfully',
        data:newAlert
    };
}

//delete

const deleteAlert = async (userId, alertId) => {
    let body={}
    body.id = alertId
    body.userId = userId
    const deleteAlert = await db.Alert.softDelete(body)

    return {
        result: true,
        message: 'Alert deleted successfully',
    }
}

// get all
const getAlerts = async (body) => {
    const alerts = await db.Alert.get(body)
    const count = await db.Alert.getAlertsCount(body)
    const mapAlerts = alerts.filter(alert=>!moment(alert.expiredAt).isBefore(moment(new Date())))
    return {
        result: true,
        message: 'Alert data fetched successfully',
        data: alerts,
        mapAlerts,
        count
    }
}
const getAlertsByDates = async(body)=>{
    const betweendates = await db.Alert.getAlertsByDates(body);
    
    if (!betweendates) {
        throw new Error('no data between those dates');
    }
    return {
        result: true,
        message: 'Avg Temperature and Humidity Data updated successfully',
        data: betweendates,
    };
}
// get one
const getAlert = async (alertId) => {
    const alert = await db.Alert.getOne(alertId)
    return {
        result: true,
        message: 'Alert data fetched successfully',
        data: alert
    }
}
module.exports = {
    createAlert,
    updateAlert,
    deleteAlert,
    getAlerts,
    getAlertsByDates,
    getAlert,
    createMany

}

