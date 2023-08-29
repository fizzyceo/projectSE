const { db } = require('../../models'); // Import your Mongoose model here
const moment = require('moment');
const { logger } = require('../../Logger');
const ApiError = require('../../error/api-error');

// Create Avg Temperature and Humidity Data
const createAvgWind = async (body) => {
    console.log(body);
    try {
        const AvgData = await db.AvgWind.createAvgWind(body);
        return {
            result: true,
            message: 'Avg Temperature and Humidity Data created successfully',
            data: AvgData,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new Error('Error creating Avg Temperature and Humidity Data');
    }
};

// Update Avg Temperature and Humidity Data
const updateAvgWind = async (id, body) => {
    try {
        body.id = id
        body.updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm');
        const updatedData = await db.AvgWind.updateAvgWind(body);

        if (!updatedData) {
            throw new ApiError.NotFound('Avg Temperature and Humidity Data not found');
        }

        return {
            result: true,
            message: 'Avg Temperature and Humidity Data updated successfully',
            data: updatedData,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error updating Avg Temperature and Humidity Data');
    }
};
const updateAvgWindByDate = async (body) => {
    try {
       
        body.updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm');
        const updatedData = await db.AvgWind.updateAvgWindByDate(body);

        if (!updatedData) {
            throw new Error('Avg Temperature and Humidity Data not found');
        }

        return {
            result: true,
            message: 'Avg Temperature and Humidity Data updated successfully',
            data: updatedData,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error updating Avg Temperature and Humidity Data');
    }
};
// Soft Delete Avg Temperature and Humidity Data
const DeleteAvgWind = async (id) => {
    try {
        const deletedData = await db.AvgWind.softDelete(id);

        if (!deletedData) {
            throw new ApiError.NotFound('Avg Temperature and Humidity Data not found');
        }

        return {
            result: true,
            message: 'Avg Temperature and Humidity Data soft deleted successfully',
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error deleting Avg Temperature and Humidity Data');
    }
};

// Get All Avg Temperature and Humidity Data
const getAvgWind = async () => {
    try {


        const AvgData = await db.AvgWind.getAvgWind()
          
        const count = await db.AvgWind.getCount();

        return {
            result: true,
            message: 'Avg Temperature and Humidity Data fetched successfully',
            data: AvgData,
            count,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error fetching Avg Temperature and Humidity Data');
    }
};
const getAvgWindBetweenDates = async (body) => {
    try {


        const AvgData = await db.AvgWind.getAvgWindBetweenDates(body)
          
        const count = await db.AvgWind.getCount();

        return {
            result: true,
            message: 'Avg Temperature and Humidity Data fetched successfully',
            data: AvgData,
            count,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error fetching Avg Temperature and Humidity Data');
    }
};

// Get One Avg Temperature and Humidity Data
const getOneAvgWind = async (id) => {
    try {
        const data = await db.AvgWind.getOne(id);

        if (!data) {
            throw new ApiError.NotFound('Avg Temperature and Humidity Data not found');
        }

        return {
            result: true,
            message: 'Avg Temperature and Humidity Data fetched successfully',
            data,
        };
    } catch (e) {
        logger.error(JSON.stringify(e));
        throw new ApiError.InternalServerError('Error fetching Avg Temperature and Humidity Data');
    }
};

// Get the count of Avg Temperature and Humidity Data


module.exports = {
    updateAvgWindByDate,
    createAvgWind,
    updateAvgWind,
    DeleteAvgWind,
    getAvgWind,
    getAvgWindBetweenDates,
    getOneAvgWind,
    
};
