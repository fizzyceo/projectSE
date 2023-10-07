const express = require("express");
const { validate } = require("express-validation");
const precipitationController = require('../../controller/systemManagement/precipitationController')
const { verifyToken } = require('../../middlewares/verifyToken')
const authorizeRoles = require('../../middlewares/authorizeRoles')
const Dtos = require('../../schema');
const clearCache = require('../../cachingSystem/middleware/clearCache')

const router = express.Router();


// authorizeRoles('client')

router.post('/get', precipitationController.getPrecipitation)

module.exports = router;