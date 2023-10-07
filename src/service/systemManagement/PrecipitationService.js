const axios = require("axios"); // Import Axios or your preferred HTTP library
const { client } = require("../../cachingSystem/redisClient"); // Import your Redis client
const clearCache = require("../../cachingSystem/middleware/clearCache"); // Import your clearCache middleware
const CACHE_KEY = "participation";
async function fetchCachedValue(client, key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, value) => {
      console.log(value);
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
}
// Use the clearCache middleware with the CACHE_KEY
const cacheMiddleware = clearCache(CACHE_KEY);

const get = async (body) => {
  try {
    const coordinates = body.coordinates;

    // Check cache first

    const cachedValue = await fetchCachedValue(client, CACHE_KEY);


    if (cachedValue) {
      console.log("Using cached participation value");
      return JSON.parse(cachedValue);
    }

    const apiKey = "9a7d9fa4042e4beebd6161458232409"; // Replace with your actual WeatherAPI API key
    const apiUrl = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${
      coordinates[0]
    },${coordinates[1]}&dt=${new Date().toISOString().slice(0, 10)}`;

    const response = await axios.get(apiUrl);

    if (response.status === 200) {
      const dailyPrecipitation = response.data.forecast.forecastday.map(
        (day) => {
          // The precipitation data is in the "total_precip_mm" property (in mm) for each day.
          // If there's no precipitation, it will be 0.
          return {
            date: new Date(day.date_epoch * 1000), // Convert Unix timestamp to JavaScript date
            precipitation: day.day.total_precip_mm || 0,
          };
        }
      );

      // Store the data in the cache with a 1-hour expiration
      client.setEx(CACHE_KEY, 3600, JSON.stringify(dailyPrecipitation));
      return dailyPrecipitation;
    } else {
      console.error("Failed to fetch weather data");
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

module.exports = { get, cacheMiddleware };
