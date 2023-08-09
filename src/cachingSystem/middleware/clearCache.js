const { client } = require('../redisClient')

const clearCache = (keyName) => {
    return async (req, res, next) => {
        await next()
        client.del(keyName)
    }
}

module.exports = clearCache