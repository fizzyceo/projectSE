// clearCache.js

const { client,redisClient } = require('../redisClient'); // Import the Redis client

const clearCache = (keyName) => {
  return async (req, res, next) => {
    try {
      await next(); // Continue with the request handling
        
      // Clear the cache after handling the request
      client.del(keyName, (err, data) => {
        if (err) {
          console.error(`Error clearing cache for key '${keyName}':`, err);
        } else {
          console.log(`Cleared cache for key '${keyName}'.`);
        }
      });
    } catch (error) {
      // Handle any errors here
      console.error('Error handling request:', error);
    }
  };
};

module.exports = clearCache;
