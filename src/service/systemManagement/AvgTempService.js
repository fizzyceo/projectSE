const { db } = require('../../models'); // Import your Mongoose model here
const moment = require('moment');
const { logger } = require('../../Logger');
const ApiError = require('../../error/api-error');

// Create Avg Temperature and Humidity Data
const createAvgTemp = async (body) => {
    console.log(body);
    try {
        const AvgData = await db.AvgTemp.createAvgTemp(body);
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
const updateAvgTemp = async (id, body) => {
    try {
        body.id = id
        body.updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm');
        const updatedData = await db.AvgTemp.updateAvgTemp(body);

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
const getAvgTempBetweenDates = async(body)=>{
    const betweendates = await db.AvgTemp.getAvgTempBetweenDates(body);
    
    if (!betweendates) {
        throw new Error('no data between those dates');
    }
    return {
        result: true,
        message: 'Avg Temperature and Humidity Data updated successfully',
        data: betweendates,
    };
}
const updateAvgTempByDate = async (body) => {
    try {
       
        body.updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm');
        const updatedData = await db.AvgTemp.updateAvgTempByDate(body);

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
const DeleteAvgTemp = async (id) => {
    try {
        const deletedData = await db.AvgTemp.softDelete(id);

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
const getAvgTemp = async () => {
    try {


        const AvgData = await db.AvgTemp.getAvgTemp()
          
        const count = await db.AvgTemp.getCount();

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
const getOneAvgTemp = async (id) => {
    try {
        const data = await db.AvgTemp.getOne(id);

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
    updateAvgTempByDate,
    getAvgTempBetweenDates,
    createAvgTemp,
    updateAvgTemp,
    DeleteAvgTemp,
    getAvgTemp,
    getOneAvgTemp,
    
};
