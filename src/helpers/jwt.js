const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateAccessToken = (payload) => { 
    
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
}

module.exports = {
    generateAccessToken
};