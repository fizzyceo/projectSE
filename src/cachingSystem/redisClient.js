// redis-connection.js
const redis = require('redis');
require('dotenv').config()
// create a singleton redisClient class
class RedisClient {
    getClient() {
        if (!RedisClient.instance) {
            let client = redis.createClient({
                legacyMode:true,
                url:`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
            });
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

const redisClient = new RedisClient();
const client = redisClient.getClient();


module.exports = {
    client
};