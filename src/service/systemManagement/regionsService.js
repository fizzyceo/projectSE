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
        const siteHistorical = await db.regions.createRegion(body)
        return {
            result: true,
            message: 'region created successfully',
            data: siteHistorical
        };
    } catch (e) {
        logger.error(JSON.stringify(e))
    }
}


const deleteRegion = async (userId, regionId) => {
    let body={}
    body.id = regionId
    body.userId = userId
    const deletedRegion = await db.regions.softDelete(body)

    return {
        result: true,
        message: 'region deleted successfully',
    }
}

// get all
const get = async (body) => {
    const regions = await db.regions.get(body)
    const count = await db.regions.getRegionsCount(body)

    return {
        result: true,
        message: 'region data fetched successfully',
        data: regions,
        count
    }
}

// get one
const getOne= async (regionId) => {
    const region = await db.regions.getOne(regionId)
    return {
        result: true,
        message: 'region data fetched successfully',
        data: region
    }
}

const createMany = async (body) => {
    try {

         await db.regions.createMany(body);
        client.del('regions')
    } catch (e) {
        logger.error(JSON.stringify(e))
    }
}
module.exports = {
    create,
    deleteRegion,
    get,
    getOne,
    createMany
}