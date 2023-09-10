const { db } = require("../../models"); // Import your Mongoose model here
const moment = require("moment");
const { logger } = require("../../Logger");
const ApiError = require("../../error/api-error");

// Create WindxTemp Data
const createWindTemp = async (body) => {
  console.log(body);
  try {
    const WindData = await db.HistoricalWind.createHistoricalWind(body.wind);
    const TempData = await db.HistoricalTemphum.createHistoricalTemphum(
      body.temp
    );
    return {
      result: true,
      message: " WindxTemp Data created successfully",
      data: {
        WindData,
        TempData,
      },
    };
  } catch (e) {
    logger.error(JSON.stringify(e));
    throw new Error("Error creating  WindxTemp Data");
  }
};

// Update WindxTemp Data
//PROBLEM : WE SHOULD HAVE DOUBLE IDS
const updateWindTemp = async (id, body) => {
  try {
    body.id = id;
    body.updatedAt = moment(new Date()).format("YYYY-MM-DD HH:mm");
    const WindData = await db.HistoricalWind.updateHistoricalWind(body.wind);
    const TempData = await db.HistoricalTemphum.updateHistoricalTemphum(
      body.temp
    );

    if (!updatedData) {
      throw new ApiError.NotFound("WindxTemp Data not found");
    }

    return {
      result: true,
      message: "WindxTemp Data updated successfully",
      data: {
        WindData,
        TempData,
      },
    };
  } catch (e) {
    logger.error(JSON.stringify(e));
    throw new ApiError.InternalServerError(
      "Error updating WindxTemp Data"
    );
  }
};

// Soft Delete WindxTemp Data
const DeleteWindTemp = async (windid,tempid) => {
  try {
    const deletedWind = await db.HistoricalWind.softDeleteHistoricalWind(windid);
    const deletedTemp = await db.HistoricalTemphum.softDeleteHistoricalTemphum(
      tempid
    );

    if (!deletedTemp || !deletedWind) {
      throw new ApiError.NotFound("WindxTemp Data not found");
    }

    return {
      result: true,
      message: "WindxTemp Data soft deleted successfully",
    };
  } catch (e) {
    logger.error(JSON.stringify(e));
    throw new ApiError.InternalServerError("Error deleting WindxTemp Data");
  }
};

// Get All WindxTemp Data
const getWindTemp = async () => {
  try {
    const WindData = await db.HistoricalWind.getHistoricalWind();

    const Windcount = await db.HistoricalWind.getCount();

    const TempData = await db.HistoricalTemphum.getHistoricalTemphum();

    const Tempcount = await db.HistoricalTemphum.getCount();
    return {
      result: true,
      message: "WindxTemp Data fetched successfully",
      data: {
        wind: {
          data: WindData,
          Windcount,
        },
        tmep: {
          data: TempData,
          Tempcount,
        },
      },
    };
  } catch (e) {
    logger.error(JSON.stringify(e));
    throw new ApiError.InternalServerError(
      "Error fetching WindxTemp Data"
    );
  }
};

// Get One WindxTemp Data
const getOneWindTemp = async (ids) => {
  try {
    const wind = await db.HistoricalWind.findById(id);
    const temp = await db.HistoricalTemphum.getOne(id);

    if (!wind || !temp) {
      throw new ApiError.NotFound("WindxTemp Data not found");
    }

    return {
      result: true,
      message: "WindxTemp Data fetched successfully",
      data,
    };
  } catch (e) {
    logger.error(JSON.stringify(e));
    throw new ApiError.InternalServerError(
      "Error fetching WindxTemp Data"
    );
  }
};


// Get the count of WindxTemp Data

module.exports = {
  createWindTemp,
  updateWindTemp,
  DeleteWindTemp,
  getWindTemp,
  getOneWindTemp,
};


//******************PROBLEM SHARING THE IDS ******************** */