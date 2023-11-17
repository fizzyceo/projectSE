const frequent = require("./frequent");
const historicalTemp = require("../service/systemManagement/HistoricalTempHumService");
const historicalWind = require("../service/systemManagement/HistoricalWindService");
const siteService = require("../service/systemManagement/SiteService");
const deviceService = require("../service/systemManagement/deviceService");
const PrecipitationService = require("../service/systemManagement/PrecipitationService");
const { FDI_THRESHOLDS } = require("../config/FdiThresholds");

const classifyFDI = (FDI) => {
  for (let threshold in FDI_THRESHOLDS) {
      if (FDI < threshold) {
        
          return {
              type: FDI_THRESHOLDS[threshold].type,
              danger: FDI_THRESHOLDS[threshold].danger
          };
      }
  }
  // If FDI is above the highest threshold, set it to the highest category
  const highestThreshold = Math.max(...Object.keys(FDI_THRESHOLDS));
  return {
      type: FDI_THRESHOLDS[highestThreshold].type,
      danger: FDI_THRESHOLDS[highestThreshold].danger
  };
};

const classifySite = async (alertData, siteId) => {
  const temperatureThreshold = 30;
  const humidityThreshold = 30;
  const windSpeedThreshold = 15;
  const site = await siteService.getSites({ name: siteId });

  let siteClassification30 = "good"; // Default classification for the site
  let siteConnectivity = "online";
  let siteClassificationFDI = {
    type: "low",
    danger: false,
  }; // Default classification for the site

  const siteTriggers = [];

  let offline_devices = 0; // Assuming the device is not offline initially
  console.log(("DIIIRRRR"));
  console.log( alertData)
  const common_direction = alertData.wind.direction; // Use the provided wind direction directly
  let siteAverageWindDirection = 0
  switch (common_direction) {
    case "N":
      siteAverageWindDirection = 0; // North corresponds to 0 degrees
      break;
    case "NE":
      siteAverageWindDirection = 45; // North East corresponds to 45 degrees
      break;
    case "S":
      siteAverageWindDirection = 180; // South corresponds to 180 degrees
      break;
    case "SE":
      siteAverageWindDirection = 135; // South East corresponds to 135 degrees
      break;
    case "E":
      siteAverageWindDirection = 90; // East corresponds to 90 degrees
      break;
    case "W":
      siteAverageWindDirection = 270; // West corresponds to 270 degrees
      break;
    default:
      // Handle any other direction that may not be covered
      // You can assign a default value or throw an error, depending on your requirements.
      break;
  }

  if (
    alertData.temp.humidity <= humidityThreshold &&
    alertData.wind.speed >= windSpeedThreshold &&
    alertData.temp.temperature >= temperatureThreshold
  ) {
    siteClassification30 = "danger";
    if (alertData.temp.humidity <= humidityThreshold) {
      siteTriggers.push("humidity");
    }
    if (alertData.wind.speed >= windSpeedThreshold) {
      siteTriggers.push("wind");
    }
    if (alertData.temp.temperature >= temperatureThreshold) {
      siteTriggers.push("temperature");
    }
  }
  const Precipitation = await PrecipitationService.get({
    coordinates: site.data[0]?.location?.coordinates,
  });
  const siteAveragePrecipitation = Precipitation[0].precipitation;
  // site classification based on the FDI rule
  const FDI =
    10 * alertData.temp.temperature +
    10 * siteAveragePrecipitation+
    10 * (1 - alertData.temp.humidity / 100) +
    10 * alertData.wind.speed +
    10 * (siteAverageWindDirection / 10);
    console.log(FDI,alertData.temp.temperature,siteAveragePrecipitation,alertData.temp.humidity,alertData.wind.speed,siteAverageWindDirection);
   siteClassificationFDI =  classifyFDI(FDI)
  // switch (true) {
  //   case FDI < 200:
  //     siteClassificationFDI = FDI_THRESHOLDS[200];
  //     break;
  //   case FDI < 400:
  //     siteClassificationFDI = FDI_THRESHOLDS[200];
  //     break;
  //   case FDI < 800:
  //     siteClassificationFDI = FDI_THRESHOLDS[400];
  //     break;
  //   case FDI < 1000:
  //     siteClassificationFDI = FDI_THRESHOLDS[800];
  //     break;
  //   case FDI < 1600:
  //     siteClassificationFDI = FDI_THRESHOLDS[1000];
  //     break;
  //   case FDI < 2500:
  //     siteClassificationFDI = FDI_THRESHOLDS[1600];
  //     break;
  //   default:
  //     siteClassificationFDI = FDI_THRESHOLDS[2500];
  // }
  
  if (alertData.status === 0) {
    siteConnectivity = "offline";
  }

  return {
    siteClassificationFDI,
    siteClassification30,
    siteConnectivity,
    siteId:site.data[0]._id,
  };
};

module.exports = classifySite;

