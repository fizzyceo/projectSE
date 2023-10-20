const nextError = require('../../helpers/errorTypeFunction');
const _ = require('lodash');
const ApiError = require('../../error/api-error');
const { db } = require('../../models');
const { logger } = require('../../Logger')
const moment = require('moment');
const { client } = require('../../cachingSystem/redisClient');
// create region 
const create = async ( body) => {
    try {
        // body.createdBy = userId
        // body.updatedBy = userId
        const siteHistorical = await db.regionForecast.createRegionForecast(body)
        return {
            result: true,
            message: 'regionForecast created successfully',
            data: siteHistorical
        };
    } catch (e) {
        logger.error(JSON.stringify(e))
    }
}


const deleteRegionForecast = async (userId, regionId) => {
    let body={}
    body.id = regionId
    body.userId = userId
    const deletedRegionForecast = await db.regionForecast.softDelete(body)

    return {
        result: true,
        message: 'regionForecast deleted successfully',
    }
}

// get all
const get = async (body) => {
    const regions = await db.regionForecast.get(body)
    const count = await db.regionForecast.getRegionsForecastCount(body)

    return {
        result: true,
        message: 'regionForecast data fetched successfully',
        data: regions,
        count
    }
}

// get one
const getOne= async (regionId) => {
    const region = await db.regionForecast.getOne(regionId)
    return {
        result: true,
        message: 'regionForecast data fetched successfully',
        data: region
    }
}


module.exports = {
    create,
    deleteRegionForecast,
    get,
    getOne,
}