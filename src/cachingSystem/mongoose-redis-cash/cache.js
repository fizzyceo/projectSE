// cach system with mongoose

const mongoose = require('mongoose')
const { client } = require('../redisClient')
const exec = mongoose.Query.prototype.exec
require('dotenv').config()
mongoose.Query.prototype.cache = function (hashKey) {
    this.useCache = true;
    this.hashKey = hashKey
    return this;
}

if (client && !process.env.VERCEL) {
    mongoose.Query.prototype.exec = async function () {

        if (!this.useCache) {
            return await exec.apply(this, arguments)
        }
        const key = JSON.stringify(
            Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name })
        );

        // See if we have a value for 'key' in redis
        const cachedValue = await client.HGET(this.hashKey, key)
        if (cachedValue  ) {
            console.log('getting data from cash');
            const doc = JSON.parse(cachedValue) || {}
            return Array.isArray(doc) ?
                doc.map((val) => new this.model(val))
                : new this.model(doc)
        }
        console.log('getting data from db');
        // Else , issue the query and store the result in redis
        const result = await exec.apply(this, arguments);
        client.hSet(this.hashKey, key, JSON.stringify(result))
        return result;

    }
}