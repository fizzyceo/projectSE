// redis-connection.js
const redis = require('redis');
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

const redisClient = new RedisClient();
const client = redisClient.getClient();


module.exports = {
    client
};