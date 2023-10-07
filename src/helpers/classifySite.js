const frequent = require("./frequent");
const historicalTemp = require("../service/systemManagement/HistoricalTempHumService");
const historicalWind = require("../service/systemManagement/HistoricalWindService");
const siteService = require("../service/systemManagement/SiteService");
const deviceService = require("../service/systemManagement/deviceService");
const PrecipitationService = require("../service/systemManagement/PrecipitationService");
const { FDI_THRESHOLDS } = require("../config/FdiThresholds");
const classifySite = async (siteId) => {
  const temperatureThreshold = 50;
  const humidityThreshold = 30;
  const FDIthreshold = 800;
  const windSpeedThreshold = 15;
  const site = await siteService.getSites({ name: siteId });
  const devices = await deviceService.getDevices({
    siteId: site.data[0]._id,
  });

  let siteClassification30 = "Online"; // Default classification for the site
  let siteClassificationFDI = {
    type: "low",
    danger: false,
  }; // Default classification for the site
  let allDevicesOffline = true; // Flag to check if all devices are offline
  let temperatureSum = 0; // Sum of temperature values for the site
  let temperatureCount = 0; // Count of temperature devices for the site
  let windSum = 0; // Sum of wind values for the site
  let windCount = 0; // Count of wind devices for the site
  let humiditySum = 0; // Sum of humidity values for the site
  let humidityCount = 0; // Count of humidity devices for the site

  const siteTriggers = [];
  let offline_devices = 0;
  //**this is the direction necessary calculations  */
  const directions = [];

  for (const device of devices.data) {
    //***************************DATA FETCHING BY TYPE OF DEVICE OF THE SITE************************** */
    let dataResponse = null;
    let optionalResponse = null;
    if (device.type === "temperature") {
      dataResponse = await historicalTemp.getLatestTemp(device._id);
    } else if (device.type === "wind") {
      dataResponse = await historicalWind.getLatestWind(device._id);
    } else if (device.type === "windTemp") {
      dataResponse = await historicalWind.getLatestWind(device._id);
      optionalResponse = await historicalTemp.getLatestTemp(device._id);
    }
    if (
      !dataResponse ||
      !dataResponse.result ||
      (!dataResponse && !optionalResponse)
    ) {
      continue; // Skip this device if there's no data
    }

    //FDI / 30% CLASSIFICATION

    let deviceClassification = "Online"; // Default classification for the device

    if (
      dataResponse.data?.temperature > temperatureThreshold ||
      dataResponse.data?.humidity > humidityThreshold ||
      (device.type === "wind" &&
        dataResponse.data?.speed > windSpeedThreshold) ||
      optionalResponse?.data?.temperature > temperatureThreshold ||
      optionalResponse?.data?.humidity < humidityThreshold
    ) {
      deviceClassification = "Danger";
    }

    if (device.status === "offline") {
      if (deviceClassification !== "Danger") {
        // If the device didn't report any danger, consider it offline
        deviceClassification = "Offline";
        offline_devices++;
      }
    } else {
      allDevicesOffline = false; // At least one device is not offline
    }
    // Count the average and keep track of devices used for each data type
    if (device.type === "temperature") {
      temperatureSum += dataResponse.data?.temperature || 0;
      humiditySum += dataResponse.data?.humidity || 0;
      if (dataResponse.data?.temperature) {
        temperatureCount++;
      }
      if (dataResponse.data?.humidity) {
        humidityCount++;
      }
    } else if (device.type === "wind") {
      //direction is a string that  needs to be calculated
      directions.push(dataResponse.data?.direction);
      // windDirectionSum += dataResponse.data?.direction || 0;
      // windDirectionCount++;
      windSum += dataResponse.data?.speed || 0;
      if (dataResponse.data?.speed) {
        windCount++;
      }
      //*****************1 */

      //*****************1 */
    } else if (device.type === "windTemp") {
      temperatureSum += optionalResponse?.data?.temperature || 0;
      humiditySum += optionalResponse?.data?.humidity || 0;

      humidityCount = optionalResponse?.data?.humidity
        ? humidityCount++
        : humidityCount;
      temperatureCount = optionalResponse?.data?.temperature
        ? temperatureCount++
        : temperatureCount;
      directions.push(dataResponse.data?.direction);

      // windDirectionSum += dataResponse.data?.direction || 0;
      // windDirectionCount++;
      //*****************1 */
      windSum += dataResponse.data?.speed || 0;
      if (dataResponse.data?.speed) {
        windCount++;
      }
    }
  }
  let siteAverageWindDirection = 0;
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
  //to be changed
  //here goes the triggers *************************************************************************
  if (
    siteAverageHumidity <= humidityThreshold ||
    siteAverageWindSpeed >= windSpeedThreshold ||
    siteAverageTemperature >= temperatureThreshold
  ) {
    siteClassification30 = "Danger";
    if (siteAverageHumidity <= humidityThreshold) {
      siteTriggers.push("humidity");
    }
    if (siteAverageWindSpeed >= windSpeedThreshold) {
      siteTriggers.push("wind");
    }
    if (siteAverageTemperature >= temperatureThreshold) {
      siteTriggers.push("temperature");
    }
  }

  // site classification based on the FDI rule
  const Precipitation = await PrecipitationService.get({
    coordinates: site.data[0]?.location?.coordinates,
  });
  const siteAveragePrecipitation = Precipitation[0].precipitation;
  const FDI =
    10 * siteAverageTemperature +
    10 * siteAveragePrecipitation +
    10 * (1 - siteAverageHumidity / 100) +
    10 * siteAverageWindSpeed +
    10 * siteAverageWindDirection;

  switch (true) {

    case FDI < 200:
      siteClassificationFDI = FDI_THRESHOLDS[200];
      break;
    case FDI < 400:
      siteClassificationFDI = FDI_THRESHOLDS[200];
      break;
    case FDI < 800:
      siteClassificationFDI = FDI_THRESHOLDS[400];
      break;
    case FDI < 1000:
      siteClassificationFDI = FDI_THRESHOLDS[800];
      break;
    case FDI < 1600:
      siteClassificationFDI = FDI_THRESHOLDS[1000];
      break;
    case FDI < 2500:
      siteClassificationFDI = FDI_THRESHOLDS[1600];
      break;
    default:
      siteClassificationFDI = FDI_THRESHOLDS[2500];
  }

  //checks if the site is currently offline
  //the FDI check and the 30% rule check are seperated
  if (!siteClassificationFDI.danger) {
    if (allDevicesOffline) {
      siteClassificationFDI.type = "Offline";
    } else if (offline_devices > 0) {
      siteClassificationFDI.type = "semi-Online";
    }
  }
  if (siteClassification30 !== "Danger") {
    if (allDevicesOffline) {
      siteClassification30 = "Offline";
    } else if (offline_devices > 0) {
      siteClassification30 = "semi-Online";
    }
  }

  //add avg wind,avg temp...ect to the site table ?
  // const modification = await siteService.updateSite(site.data[0]._id, {
  //   statusFDI: siteClassificationFDI,
  //   status30: siteClassification30,
  // });
  // if (!modification) {
  //   throw new Error("error applying the status update to the site");
  // }

  // return modification;
  return {
    siteClassificationFDI,
    siteClassification30,
    siteId: site.data[0]._id,
  };
};

module.exports = classifySite;
