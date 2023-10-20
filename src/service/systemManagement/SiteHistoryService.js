const nextError = require('../../helpers/errorTypeFunction');
const _ = require('lodash');
const ApiError = require('../../error/api-error');
const { db } = require('../../models');
const { logger } = require('../../Logger')
const moment = require('moment')
const siteService = require("./SiteService")
const {ObjectId} = require("mongodb")
const regionService = require("./regionForecast");
const { default: axios } = require('axios');
// create device 
const create = async ( body) => {
    try {
        // body.createdBy = userId
        // body.updatedBy = userId
        const siteHistorical = await db.site_historical_data.create(body)
        return {
            result: true,
            message: 'siteHistorical created successfully',
            data: siteHistorical
        };
    } catch (e) {
        logger.error(JSON.stringify(e))
    }
}

// update device
// const updateDevice = async (userId, deviceId, body) => {
//     body.id = deviceId
//     if(userId){
//         body.updatedBy = userId
//     }
    
//     const newDevice = await db.db.site_historical_data.updateDevice(body)
//     return {
//         result: true,
//         message: 'Device updated successfully',
//         data:newDevice
//     };
// }

//delete

const deleteHistSite = async (userId, deviceId) => {
    let body={}
    body.id = deviceId
    body.userId = userId
    const deletedHistSite = await db.site_historical_data.softDelete(body)

    return {
        result: true,
        message: 'Device deleted successfully',
    }
}

// get all
const get = async (body) => {
    const all_sites = await siteService.getSites();
    let alternatives = []
// if one of the sites doesn't have data, we return data from a 3rd party API

const HistSite = await db.site_historical_data.getHistory(body);
const all_available_siteIds = HistSite.map(siteData => siteData.siteId);
for (let site of all_sites.data) {
    


    if (all_available_siteIds.some(id => id.equals(site._id))) {
        // This site has data
        // Do something
        
        console.log(`Site with id ${site._id} has data.`);


        //search region this site belongs to 
        //
    } else {
        // This site doesn't have data, return data from 3rd party API
        // Call the 3rd party API and handle the response here
        console.log(`Site with id ${site._id} doesn't have data. Fetching from 3rd party API.`);
        //we return the coordinates of the region that 

        const region = await regionService.get({regionId:site.regionId})
         alternatives.push({

            siteId:site._id,
            humidity:region.data[0].humidity,
            speed:region.data[0].windSpeed,
            direction:region.data[0].windDirectionDegrees,
            temperature:region.data[0].temperature,
            status30:region.data[0].rule30,
            statusFDI:region.data[0].FDI,
            isDangerous : region.data[0].isDangerous_FDI
        })

        // if(region.data.coordinates?.coordinates.length>0){
        //     console.log(region.data.coordinates.coordinates);
        //     const tempApi = `https://api.weatherapi.com/v1/forecast.json?key=9a7d9fa4042e4beebd6161458232409&q=${region.data.coordinates?.coordinates[0]},${region.data.coordinates?.coordinates[1]}&days=1` //36.19,5.41
        //     const response = await axios.get(tempApi);
            
        //     if (response.status === 200) {
        //       const {current} = response.data.current
        //       const {hour} = response.data.forecast.forecastday[0]
        //       console.log(current);
        //       console.log(hour);
        //     }
        // }
        
    }
}
    const count = await db.site_historical_data.getCount(body)

    return {
        result: true,
        message: 'Site History data fetched successfully',
        data: HistSite,
        alternatives,
        count
    }
}

// get one
const getOne= async (histSiteId) => {
    const Site = await db.site_historical_data.getOne(histSiteId)
    return {
        result: true,
        message: 'Site data fetched successfully',
        data: Site
    }
}

module.exports = {
    create,
    deleteHistSite,
    get,
    getOne,
    
}