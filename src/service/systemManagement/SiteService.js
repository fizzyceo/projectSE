const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
const ApiError = require("../../error/api-error");
const { db } = require("../../models");
const { logger } = require("../../Logger");
const moment = require("moment");
const isExpired = require("../../helpers/isExpired");
const PrecipitationService = require("../../service/systemManagement/PrecipitationService");
const { max } = require("../../helpers/max");
const frequent = require("../../helpers/frequent");
// create device
const createSite = async (body) => {
  try {
    const Site = await db.Site.createSite(body);
    return {
      result: true,
      message: "Site created successfully",
      data: _.omit(Site, ["updatedAt", "__v", "_id"]),
    };
  } catch (e) {
    logger.error(JSON.stringify(e));
  }
};

// update Site
const updateSite = async (SiteId, body) => {
  body.id = SiteId;
  const newSite = await db.Site.updateSite(body);
  return {
    result: true,
    message: "Site updated successfully",
    data: newSite,
  };
};

//delete

const deleteSite = async (userId, SiteId) => {
  let body = {};
  body.id = SiteId;
  body.userId = userId;
  const deleteSite = await db.Site.softDelete(body);

  return {
    result: true,
    message: "Site deleted successfully",
  };
};

// get all
const getSites = async (body) => {
  const Sites = await db.Site.getSites(body);
  const count = await db.Site.getSitesCount();

  return {
    result: true,
    message: "Site data fetched successfully",
    data: Sites,
    count,
  };
};

// get one
const getSite = async (SiteId) => {
  const Site = await db.Site.getOne(SiteId);
  return {
    result: true,
    message: "Site data fetched successfully",
    data: Site,
  };
};
const monitor = async () => {
  const temperatureThreshold = 30;
  const humidityThreshold = 30;
  const windSpeedThreshold = 15;
  const FDIthreshold = 1000;
  const classifiedData = [];
  const body = null;
  try {
    const sites = await db.Site.getSites(body);
    //////****************************FETCHING DEVICES OF EACH SITE*********************************** */
    for (const site of sites) {
      const devices = await db.Device.get({ siteId: site._id });
      let siteClassification30 = "Online"; // Default classification for the site by the 30% rule
      let siteClassificationFDI = "Online"; // Default classification for the site by the FDI rule

      let allDevicesOffline = true; // Flag to check if all devices are offline
      let temperatureSum = 0; // Sum of temperature values for the site
      let temperatureCount = 0; // Count of temperature devices for the site
      let windSum = 0; // Sum of wind values for the site
      let windCount = 0; // Count of wind devices for the site
      let humiditySum = 0; // Sum of humidity values for the site
      let humidityCount = 0; // Count of humidity devices for the site
      let windDirectionSum = 0; // Sum of wind directions for the site
      let windDirectionCount = 0;
      const tempDevicesUsed = [];
      const windDevicesUsed = [];
      const siteTriggers = [];
      let latestDT = null;
      let offline_devices = 0;
      let expired = false;
      //**this is the direction necessary calculations  */
      const directions = [];

      for (const device of devices) {
        
        //***************************DATA FETCHING BY TYPE OF DEVICE OF THE SITE************************** */
        let dataResponse = null;
        let optionalResponse = null;
        if (device.type === "temperature") {
          dataResponse = await db.HistoricalTemphum.getLatest(device._id);
        } else if (device.type === "wind") {
          dataResponse = await db.HistoricalWind.getLatest(device._id);
        } else if (device.type === "windTemp") {
          dataResponse = await db.HistoricalWind.getLatest(device._id);

          optionalResponse = await db.HistoricalTemphum.getLatest(device._id);
        }
        if (!dataResponse || (!dataResponse && !optionalResponse)) {
          continue; // Skip this device if there's no data
        }

        //******************************LATEST DETECTION TIME  *********************************/
        if (!latestDT) {
          latestDT = dataResponse.detectionTime;
        } else {
          latestDT = max(dataResponse.detectionTime, latestDT);
          if (optionalResponse) {
            latestDT = max(optionalResponse?.detectionTime, latestDT);
          }
        }

        //******************************CHECK IF EXPIRED  *********************************/

        expired = isExpired(
          max(dataResponse?.createdAt, optionalResponse?.createdAt)
        );
        if (
          latestDT === "Invalid date" ||
          (!dataResponse?.createdAt && !optionalResponse?.createdAt)
        ) {
          expired = true;
        }
        //**********************CLASSIFICATION & TRIGGERS*************************** */
        //**********************USE FDI OR 30% RULES ******************************* */

        //SETUP THE DEVICE CLASSIFICATION


        // Count the average and keep track of devices used for each data type
        if (device.type === "temperature") {
          temperatureSum += dataResponse?.temperature || 0;
          humiditySum += dataResponse?.humidity || 0;
          if (dataResponse?.temperature) {
            temperatureCount++;
          }
          if (dataResponse?.humidity) {
            humidityCount++;
          }

          tempDevicesUsed.push({
            temperature: dataResponse?.temperature,
            humidity: dataResponse?.humidity,
            device: device,
            detectionTime: dataResponse?.detectionTime,
          });
        } else if (device.type === "wind") {
          directions.push(dataResponse?.direction);

          windSum += dataResponse?.speed || 0;
          if (dataResponse?.speed) {
            windCount++;
          }

          windDevicesUsed.push({
            speed: dataResponse?.speed,
            direction: dataResponse?.direction,
            device: device,

            
            detectionTime: dataResponse?.detectionTime,
          });
        } else if (device.type === "windTemp") {
          temperatureSum += optionalResponse?.temperature || 0;
          humiditySum += optionalResponse?.humidity || 0;

          humidityCount = optionalResponse?.humidity
            ? humidityCount + 1
            : humidityCount;
          temperatureCount = optionalResponse?.temperature
            ? temperatureCount + 1
            : temperatureCount;
          //direction is a string that  needs to be calculated
          directions.push(dataResponse?.direction);


          windSum += dataResponse?.speed || 0;
          if (dataResponse?.speed) {
            windCount++;
          }

          tempDevicesUsed.push({
            temperature: optionalResponse?.temperature,
            humidity: optionalResponse?.humidity,
            device: device,
            
            detectionTime: optionalResponse?.detectionTime,
          });

          windDevicesUsed.push({
            speed: dataResponse?.speed,
            direction: dataResponse?.direction,
            device: device,
            
            detectionTime: dataResponse?.detectionTime,
          });
        }
      }

      //**********************AVERAGE CALUCLATIONS FOR EACH PARAMS
      const common_direction = frequent(directions);
      switch (common_direction) {
        case "N": {
          siteAverageWindDirection = 0; // North corresponds to 0 degrees
          break;
        }
        case "NE": {
          siteAverageWindDirection = 45; // North East corresponds to 45 degrees
          break;
        }
        case "S": {
          siteAverageWindDirection = 180; // South corresponds to 180 degrees
          break;
        }
        case "SE": {
          siteAverageWindDirection = 135; // South East corresponds to 135 degrees
          break;
        }
        case "E": {
          siteAverageWindDirection = 90; // East corresponds to 90 degrees
          break;
        }
        case "W": {
          siteAverageWindDirection = 270; // West corresponds to 270 degrees
          break;
        }
        default: {
          // Handle any other direction that may not be covered
          // You can assign a default value or throw an error, depending on your requirements.
          break;
        }
      }

      const siteAverageTemperature = parseFloat(
        temperatureCount > 0 ? temperatureSum / temperatureCount : null
      ).toFixed(0);
      const siteAverageWindSpeed = parseFloat(
        windCount > 0 ? windSum / windCount : null
      ).toFixed(0);
      const siteAverageHumidity = parseFloat(
        humidityCount > 0 ? humiditySum / humidityCount : null
      ).toFixed(0);

      

      //update the site status /********************************* */

      //handle the trigger
      classifiedData.push({
        siteInfo: site, // Store site information
        detectionTime: latestDT,
        expired: expired,
        tempData: {
          avg_temp: siteAverageTemperature,
          avg_humi: siteAverageHumidity,
          devices_used: tempDevicesUsed,
        },
        windData: {
          avg_speed: siteAverageWindSpeed,
          avg_direction: common_direction,
          devices_used: windDevicesUsed,
        },
      });
    }
    return classifiedData;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createSite,
  updateSite,
  deleteSite,
  getSites,
  getSite,
  monitor,
};
