const frequent = require("./frequent");
const historicalTemp = require("../service/systemManagement/HistoricalTempHumService");
const historicalWind = require("../service/systemManagement/HistoricalWindService");
const siteService = require("../service/systemManagement/SiteService");
const deviceService = require("../service/systemManagement/deviceService");

const classifySite = async (siteId)=>{
    const temperatureThreshold = 30;
    const humidityThreshold = 60;
    const windSpeedThreshold = 15;
    const classifiedData = [];
    const site = await siteService.getSites({name:siteId});
    console.log(site);
    const devices = await deviceService.getDevices({
        siteId: site.data[0]._id,
      });
    
      let siteClassification = "Online"; // Default classification for the site
      let allDevicesOffline = true; // Flag to check if all devices are offline
      let temperatureSum = 0; // Sum of temperature values for the site
      let temperatureCount = 0; // Count of temperature devices for the site
      let windSum = 0; // Sum of wind values for the site
      let windCount = 0; // Count of wind devices for the site
      let humiditySum = 0; // Sum of humidity values for the site
      let humidityCount = 0; // Count of humidity devices for the site
      let windDirectionSum = 0; // Sum of wind directions for the site
      let windDirectionCount = 0;
      const siteTriggers = [];
      let offline_devices = 0;
      //**this is the direction necessary calculations  */
      const directions = [];


      for (const device of devices.data) {
        //***************************DATA FETCHING BY TYPE OF DEVICE OF THE SITE************************** */
        let dataResponse = null;
        let optionalResponse = null;
        if (device.type === "temperature") {
          dataResponse = await historicalTemp.getLatestTemp(
            device._id
          );
        } else if (device.type === "wind") {
            dataResponse = await historicalWind.getLatestWind(
                device._id
              );
        } else if (device.type === "windTemp") {
            dataResponse = await historicalWind.getLatestWind(
                device._id
              );
          optionalResponse = await historicalTemp.getLatestTemp(
            device._id
          );
        }
        if (
          !dataResponse ||
          !dataResponse.result ||
          (!dataResponse && !optionalResponse)
        ) {
          
          continue; // Skip this device if there's no data
        }

        let deviceClassification = "Online"; // Default classification for the device

        if (
          dataResponse.data?.temperature > temperatureThreshold ||
          dataResponse.data?.humidity > humidityThreshold ||
          (device.type === "wind" &&
            dataResponse.data?.speed > windSpeedThreshold) ||
          optionalResponse?.data?.temperature > temperatureThreshold ||
          optionalResponse?.data?.humidity > humidityThreshold
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
        }else if (device.type === "wind") {
            //direction is a string that  needs to be calculated
            directions.push(dataResponse.data?.direction);
            // windDirectionSum += dataResponse.data?.direction || 0;
            // windDirectionCount++;
            windSum += dataResponse.data?.speed || 0;
            if (dataResponse.data?.speed) {
              windCount++;
            }
//*****************1 */
            console.log(windSum, windCount);

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
    const common_direction = frequent(directions);
    //*****************1 */
            const siteAverageTemperature = parseFloat(
              temperatureCount > 0 ? temperatureSum / temperatureCount : null
            ).toFixed(0);
            const siteAverageWindSpeed =parseFloat( windCount > 0 ? windSum / windCount : null).toFixed(0);
            const siteAverageHumidity =parseFloat(
              humidityCount > 0 ? humiditySum / humidityCount : null).toFixed(0);
            //to be changed
            //here goes the triggers *************************************************************************
    
            const siteAverageWindDirection =
              windDirectionCount > 0 ? windDirectionSum / windDirectionCount : null;
            if (siteAverageHumidity >= humidityThreshold) {
              siteClassification = "Danger";
              siteTriggers.push("humidity");
            }
            if (siteAverageWindSpeed >= windSpeedThreshold) {
              siteClassification = "Danger";
    
              siteTriggers.push("wind");
            }
            if (siteAverageTemperature >= temperatureThreshold) {
              siteTriggers.push("temperature");
              siteClassification = "Danger";
            }
            if (siteClassification !== "Danger") {
              if (allDevicesOffline) {
                siteClassification = "Offline";
              } else if (offline_devices > 0) {
                siteClassification = "semi-Online";
              }
            
            }
            //add avg wind,avg temp...ect to the site table ? 
            const modification = await siteService.updateSite(site.data[0]._id,{status:siteClassification});
            if(!modification){
                throw new Error("error applying the status update to the site")
            }
            

    return modification
    }

    module.exports = classifySite