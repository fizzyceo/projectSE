// redis-connection.js
const redis = require('redis');
const clearCache = require('./middleware/clearCache');
const { CACHE_EXPIRATION_TIME } = require('../config/timers');
require('dotenv').config()
// create a singleton redisClient class
class RedisClient {
    getClient() {
        if (!RedisClient.instance) {
            console.log("creating redis instance ");
            
            let client = redis.createClient({
                legacyMode:true,
                password:"88QYdvYecTRnSBZ2CdU0V7KfkW2V0yvE",
                socket:{
                    host:process.env.REDIS_HOST,
                    port:process.env.REDIS_PORT
                }    
                // url:`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
            });
            console.log("creating redis instance success");
            client.connect().then(() => {
                console.log('Connected to Redis');
               
            }).catch((e) => {
                console.log('Redis client not connected',e);
            })
            return RedisClient.instance = client;
        }
        return RedisClient.instance;
    }

}

const redisC = new RedisClient();
const client = redisC.getClient();

client.keys("*", (error, keys) => {
  if (error) {
    console.error('Error fetching Redis keys:', error);
    return;
  }
  console.log('Fetched keys:', keys);

  // Set a global cache expiration for all keys
  keys.forEach((key) => {
    client.expire(key, CACHE_EXPIRATION_TIME, (err, result) => {
      if (err) {
        console.error(`Error setting expiration for key '${key}':`, err);
      } else {
        console.log(`Set expiration for key '${key}' to ${CACHE_EXPIRATION_TIME} seconds`);
      }
    });
  });
});

module.exports = {
    client
};