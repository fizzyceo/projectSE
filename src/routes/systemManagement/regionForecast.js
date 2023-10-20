const express = require("express");
const { validate } = require("express-validation");
const regionForecastController = require('../../controller/systemManagement/regionForecastController')
const authorizeRoles = require('../../middlewares/authorizeRoles')
const Dtos = require('../../schema');
const clearCache = require('../../cachingSystem/middleware/clearCache')
const router = express.Router();


// authorizeRoles('client')
router.post('/create', regionForecastController.createRegionForecast)
router.post('/get', regionForecastController.getRegionForecasts)
router.get('/get/:id', regionForecastController.getRegionForecast)
router.delete('/delete/:id', regionForecastController.deleteRegionForecast)

module.exports = router;
