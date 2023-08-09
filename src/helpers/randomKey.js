const crypto = require('crypto');
const randomKey = (length = 32) => crypto.randomBytes(length).toString('hex');

module.exports = randomKey;