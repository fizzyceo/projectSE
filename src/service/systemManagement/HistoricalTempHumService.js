const { db } = require('../../models'); // Import your Mongoose model here
const moment = require('moment');
const { logger } = require('../../Logger');
const ApiError = require('../../error/api-error');

// Create Historical Temperature and Humidity Data
const createHistTemp = async (body) => {
    console.log(body);
    try {
        const historicalData = await db.HistoricalTemphum.createHistoricalTemphum(body);
        return {
            result: true,
            message: 'Historical Temperature and Humidity Data created successfully',
            data: historicalData,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new Error('Error creating Historical Temperature and Humidity Data');
    }
};

// Update Historical Temperature and Humidity Data
const updateHistoricalTemphum = async (id, body) => {
    try {
        body.id = id
        body.updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm');
        const updatedData = await db.HistoricalTemphum.updateHistoricalTemphum(body);

        if (!updatedData) {
            throw new ApiError.NotFound('Historical Temperature and Humidity Data not found');
        }

        return {
            result: true,
            message: 'Historical Temperature and Humidity Data updated successfully',
            data: updatedData,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error updating Historical Temperature and Humidity Data');
    }
};

// Soft Delete Historical Temperature and Humidity Data
const DeleteHistoricalTemphum = async (id) => {
    try {
        const deletedData = await db.HistoricalTemphum.softDeleteHistoricalTemphum(id);

        if (!deletedData) {
            throw new ApiError.NotFound('Historical Temperature and Humidity Data not found');
        }

        return {
            result: true,
            message: 'Historical Temperature and Humidity Data soft deleted successfully',
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error deleting Historical Temperature and Humidity Data');
    }
};

// Get All Historical Temperature and Humidity Data
const getHistoricalTemphum = async (filterParams) => {
    try {


        const historicalData = await db.HistoricalTemphum.getHistoricalTemphum()


        const count = await db.HistoricalTemphum.getCount();

        return {
            result: true,
            message: 'Historical Temperature and Humidity Data fetched successfully',
            data: historicalData,
            count,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error fetching Historical Temperature and Humidity Data');
    }
};

// Get One Historical Temperature and Humidity Data
const getOneHistoricalTemphum = async (id) => {
    try {
        const data = await db.HistoricalTemphum.getOne(id);

        if (!data) {
            throw new ApiError.NotFound('Historical Temperature and Humidity Data not found');
        }

        return {
            result: true,
            message: 'Historical Temperature and Humidity Data fetched successfully',
            data,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error fetching Historical Temperature and Humidity Data');
    }
};

// Get the count of Historical Temperature and Humidity Data


module.exports = {
    createHistTemp,
    updateHistoricalTemphum,
    DeleteHistoricalTemphum,
    getHistoricalTemphum,
    getOneHistoricalTemphum,
    
};
