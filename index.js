const dotenv = require("dotenv");
const { logger } = require("./src/Logger");
const connectDb = require("./src/database/connectDb");

dotenv.config();
const server = require("./src/app");
const { INTERVAL_TO_CHECK_DEVICE_STATUS } = require("./src/config/systemManagement/TimeToGoOffline");
const verifyDevicesConnectivity = require("./src/helpers/verifyDevicesConnectivity");
const regionForecastService = require("./src/service/systemManagement/regionForecast");
const regionsService = require("./src/service/systemManagement/regionsService");
const { default: axios } = require("axios");
const { FDI_THRESHOLDS } = require("./src/config/FdiThresholds");
const { TIME_TO_CALL_WEATHER_API } = require("./src/config/timers");
//============================================================
const myServer = () => {
  server.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
  });
};
console.log(process.env.MONGO_URL);
connectDb(process.env.MONGO_URL, myServer);
require('./src/mqtt')


setInterval(() => {

  verifyDevicesConnectivity()
}, INTERVAL_TO_CHECK_DEVICE_STATUS);



setInterval(() => {
  console.log("Hi from calculating danger function");
  //fetch all the regions on the database
  //for each region perform this fetching function 
  //and store it on the new table for the regionsData equipped with the name of the region, coordinates, and 
  
  const fetchingForecast = async () => {
    const regions = await regionsService.get()
    const regionsForecasts = []
    const key = process.env.WEATHER_API_KEY 

    for( const region of regions.data) {
          const api_string = `https://api.weatherapi.com/v1/forecast.json?${key}=&q=${region.coordinates.coordinates[0]},${region.coordinates.coordinates[1]}&days=3` //36.19,5.41
          const response = await axios.get(api_string);
          
          if (response.status === 200) {
            const location = {
              name:response.data.location.name,
              coordinates:[response.data.location.lat,response.data.location.lon]
            }
            // we calculate the FDI here for every hour and we select the max FDI and the hour associated with it 
            // we do this for everyday of the forecast 
            
            const {wind_kph,precip_mm,temp_c,humidity,last_updated,wind_degree} = response.data.current
            const fdi_current = fdi_formula(wind_kph,wind_degree,precip_mm,humidity,temp_c)
            const rule30_current = rule30_formula(wind_kph,humidity,temp_c)
            const current = {
              fdi:fdi_current,
              rule30:rule30_current,
              windSpeed: wind_kph,
              windDirectionToDegrees: wind_degree,
              humidity,
              temperature:temp_c,
              precipitation:precip_mm,
              date:last_updated

            }
            const forecastdata = response.data.forecast.forecastday.map(
              (day) => {
                let fdimax = 0;
                let temp_max = null
                let precip_mm_max = null
                let humidity_max = null
                let windspeed_max = null
                let windDirectionDegrees_max = null
                let date_max = null
                let rule_30 = null

                  day.hour.map(hour => {
                      
                    let fdi = fdi_formula(hour.wind_kph, hour.wind_degree,hour.precip_mm,hour.humidity,hour.temp_c)
                    if(fdi > fdimax){
                      fdimax = fdi;
                      date_max = hour.time
                      windspeed_max = hour.wind_kph
                      windDirectionDegrees_max = hour.wind_degree
                      temp_max = hour.temp_c
                      precip_mm_max = hour.precip_mm
                      humidity_max = hour.humidity

                      rule_30 = rule30_formula(hour.wind_kph,hour.humidity,hour.temp_c)
                    }

                  })
                  
                  
                return {
                  rule30:rule_30,
                  fdi:fdimax,
                  date:date_max,
                  temperature:temp_max,
                  humidity:humidity_max,
                  windspeed:windspeed_max,
                  windDirectionToDegrees:windDirectionDegrees_max,
                  percipitation: precip_mm_max,
                };
              }
            );
               

                //we should not return cause we have multiple regions, use a map maybe or an array 
                //extract the location too from the api and store its values on the regionForecast table 
            regionsForecasts.push({
              regionId:region._id,
              current,
              location:location,
              forecastData:forecastdata
            })
        }
    }
   return regionsForecasts 
  
  }
  function rule30_formula(windSpeed,humidity,temp){
    let state = "good"  
    if(windSpeed >= 30 && humidity <=30 && temp>=30){
      state = 'danger'
      }
      return state;
  }
  function fdi_formula(windSpeed,windDirection,precip_mm,humidity,temp){
      let result = 10 * parseFloat(temp) +
      10 * parseFloat(precip_mm) +
      10 * (1 - parseFloat(humidity) / 100) +
      10 * parseFloat(windSpeed) +
      10 * (parseFloat(windDirection) / 10);
  

      return result;
  }
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
const calculateFDI = (forecast)=>{
  

const classifiedFDI_0 = classifyFDI(forecast[0]?.fdi);
const classifiedFDI_24 = classifyFDI(forecast[1]?.fdi);
const classifiedFDI_48 = classifyFDI(forecast[2]?.fdi);

return{

  classifiedFDI_0,
  classifiedFDI_24,
  classifiedFDI_48
}
}

const calculateRule30 = (forecast)=>{
  let rule30_0 = "good"  
  let rule30_24= "good"  
  let rule30_48 = "good"  
  if(forecast[0]?.temperature >= 30 && forecast[0]?.humidity <=30 && forecast[0]?.windspeed>=30){
        rule30_0 = 'danger'
    }
  if(forecast[1]?.temperature >= 30 && forecast[1]?.humidity <=30 && forecast[1]?.windspeed>=30){
        rule30_24 = 'danger'
    }
  if(forecast[2]?.temperature >= 30 && forecast[2]?.humidity <=30 && forecast[2]?.windspeed>=30){
        rule30_48 = 'danger'
    }

    return {
        rule30_0,
        rule30_24,
        rule30_48
    };

}
const classification = async () => {
  const regionForecasts = await fetchingForecast();


  for (const regionForecast of regionForecasts) {
      const { location, forecastData,current,regionId } = regionForecast;
      const current_fdi = classifyFDI(current.fdi)
      console.log(current_fdi);
      const fdi_classifications = calculateFDI(forecastData);
      
      
      console.log(fdi_classifications);

      const newRegionForecast = await regionForecastService.create({
        regionId:regionId,
        name: location.name,
        date: current.date,
        temperature: current.temperature,
        humidity: current.humidity,
        windSpeed: current.windSpeed,
        windDirectionDegrees: current.windDirectionToDegrees,
        percipitation: current.precipitation,
        coordinates: location.coordinates,
        date_0: forecastData[0].date,
        date_24: forecastData[1].date,
        date_48: forecastData[2].date,
        temperature_0: forecastData[0].temperature,
        percipitation_0: forecastData[0].percipitation,
        humidity_0: forecastData[0].humidity,
        windSpeed_0: forecastData[0].windspeed,
        windDirectionDegrees_0: forecastData[0].windDirectionToDegrees,
        temperature_24: forecastData[1].temperature,
        percipitation_24: forecastData[1].percipitation,
        humidity_24: forecastData[1].humidity,
        windSpeed_24: forecastData[1].windspeed,
        windDirectionDegrees_24: forecastData[1].windDirectionToDegrees,
        temperature_48: forecastData[2].temperature,
        percipitation_48: forecastData[2].percipitation,
        humidity_48: forecastData[2].humidity,
        windSpeed_48: forecastData[2].windspeed,
        windDirectionDegrees_48: forecastData[2].windDirectionToDegrees,
        rule30:current.rule30,
        FDI:current_fdi.type,
        isDangerous_FDI : current_fdi.danger,
        FDI_0: fdi_classifications.classifiedFDI_0.type,
        FDI_24: fdi_classifications.classifiedFDI_24.type,
        FDI_48: fdi_classifications.classifiedFDI_48.type,
        rule30_0: forecastData[0].rule30,
        rule30_24: forecastData[1].rule30,
        rule30_48: forecastData[2].rule30,
    });
    
}   
  }

classification()
  
  
}
, TIME_TO_CALL_WEATHER_API);

