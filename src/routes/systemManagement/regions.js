const express = require("express");
const { validate } = require("express-validation");
const regionController = require('../../controller/systemManagement/regionController')
const authorizeRoles = require('../../middlewares/authorizeRoles')
const Dtos = require('../../schema');
const clearCache = require('../../cachingSystem/middleware/clearCache')
const router = express.Router();


// authorizeRoles('client')
router.post('/create', regionController.createRegion)
router.post('/createmany', regionController.createManyRegions)
router.post('/get', regionController.getRegions)
router.get('/get/:id', regionController.getRegion)
router.delete('/delete/:id', regionController.deleteRegion)

module.exports = router;
