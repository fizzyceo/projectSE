const nextError = require('../../helpers/errorTypeFunction');
const _ = require('lodash');
const ApiError = require('../../error/api-error');
const { db } = require('../../models');
const { logger } = require('../../Logger')
const moment = require('moment')
// create device 
const createSite = async (body) => {
    try {
        console.log(body);
        const Site = await db.Site.createSite(body)
        console.log(Site);
        return {
            result: true,
            message: 'Site created successfully',
            data: _.omit(Site, ['updatedAt', '__v', '_id'])
        };
    } catch (e) {
        logger.error(JSON.stringify(e))
    }
}

// update Site
const updateSite = async (SiteId, body) => {
    body.id = SiteId
    const newSite = await db.Site.updateSite(body)
    return {
        result: true,
        message: 'Site updated successfully',
        data:newSite
    };
}

//delete

const deleteSite = async (userId, SiteId) => {
    let body={}
    body.id = SiteId
    body.userId = userId
    const deleteSite = await db.Site.softDelete(body)

    return {
        result: true,
        message: 'Site deleted successfully',
    }
}

// get all
const getSites = async () => {
    const Sites = await db.Site.getSites()
    const count = await db.Site.getSitesCount()

    return {
        result: true,
        message: 'Site data fetched successfully',
        data: Sites,
        count
    }
}

// get one
const getSite = async (SiteId) => {
    const Site = await db.Site.getOne(SiteId)
    return {
        result: true,
        message: 'Site data fetched successfully',
        data: Site
    }
}

module.exports = {
    createSite,
    updateSite,
    deleteSite,
    getSites,
    getSite,
    }