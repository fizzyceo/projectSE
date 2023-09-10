const { db } = require('../../models'); // Import your Mongoose model here
const moment = require('moment');
const { logger } = require('../../Logger');
const ApiError = require('../../error/api-error');

// Create Historical Wind Data
const createHistWind = async (body) => {
    console.log(body);
    try {
        const historicalData = await db.HistoricalWind.createHistoricalWind(body);
        return {
            result: true,
            message: 'Historical Wind Data created successfully',
            data: historicalData,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new Error('Error creating Historical Wind Data');
    }
};

// Update Historical Wind Data
const updateHistoricalWind = async (id, body) => {
    try {
        body.id = id
        body.updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm');
        const updatedData = await db.HistoricalWind.updateHistoricalWind(body);

        if (!updatedData) {
            throw new ApiError.NotFound('Historical Wind Data not found');
        }

        return {
            result: true,
            message: 'Historical Wind Data updated successfully',
            data: updatedData,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error updating Historical Wind Data');
    }
};

// Soft Delete Historical Wind Data
const DeleteHistoricalWind = async (id) => {
    try {

        console.log("id***************",id);
        const deletedData = await db.HistoricalWind.softDelete(id);
        console.log(deletedData);
        if (!deletedData) {
            throw new ApiError.NotFound('Historical Wind Data not found');
        }

        return {
            result: true,
            message: 'Historical Wind Data soft deleted successfully',
        };
    } catch (e) {
        console.log("ERRORRRRR," ,e);
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error deleting Historical Wind Data');
    }
};

// Get All Historical Wind Data
const getHistoricalWind = async () => {
    try {


        const historicalData = await db.HistoricalWind.getHistoricalWind()


        const count = await db.HistoricalWind.getCount();

        return {
            result: true,
            message: 'Historical Wind Data fetched successfully',
            data: historicalData,
            count,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error fetching Historical Wind Data');
    }
};

// Get One Historical Wind Data
const getOneHistoricalWind = async (id) => {
    try {
        const data = await db.HistoricalWind.findById(id);

        if (!data) {
            throw new ApiError.NotFound('Historical Wind Data not found');
        }

        return {
            result: true,
            message: 'Historical Wind Data fetched successfully',
            data,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error fetching Historical Wind Data');
    }
};
const getLatestWind = async (devid) => {
    try {

        const historicalData = await db.HistoricalWind.getLatest(devid)

        return {
            result: true,
            message: 'Latest Historical Wind Data fetched successfully',
            data: historicalData,
            
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error fetching Latest Historical Wind Data');
    }
};


// Get the count of Historical Wind Data


module.exports = {
    createHistWind,
    updateHistoricalWind,
    DeleteHistoricalWind,
    getHistoricalWind,
    getLatestWind,
    getOneHistoricalWind,
    
};
