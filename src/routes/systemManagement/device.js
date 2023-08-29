const express = require("express");
const { validate } = require("express-validation");
const deviceController = require('../../controller/systemManagement/devicesController')
const { verifyToken } = require('../../middlewares/verifyToken')
const authorizeRoles = require('../../middlewares/authorizeRoles')
const Dtos = require('../../schema');
const clearCache = require('../../cachingSystem/middleware/clearCache')

const router = express.Router();


// authorizeRoles('client')
router.post('/create', validate(Dtos.createDeviceDto), verifyToken, clearCache('device'), deviceController.createDevice)
router.post('/get', validate(Dtos.getDevicesDto), deviceController.getDevices)
router.get('/get/:id', validate(Dtos.getDeviceDto), verifyToken, deviceController.getDevice)
router.put('/update/:id', validate(Dtos.updateDeviceDto), verifyToken, clearCache('device'), deviceController.updateDevice)
router.delete('/delete/:id', validate(Dtos.deleteDeviceDto), verifyToken, clearCache('device'), deviceController.deleteDevice)

module.exports = router;
