const express = require("express");
const { validate } = require("express-validation");
const alertController = require('../../controller/systemManagement/alertsController')
const { verifyToken } = require('../../middlewares/verifyToken')
const authorizeRoles = require('../../middlewares/authorizeRoles')
const Dtos = require('../../schema');
const clearCache = require('../../cachingSystem/middleware/clearCache')
const router = express.Router();


// authorizeRoles('client')
router.post('/create', validate(Dtos.createAlertDto), verifyToken,clearCache('alert'), alertController.createAlert)
router.post('/get', validate(Dtos.getAlertsDto), verifyToken, alertController.getAlerts)
router.get('/get/:id', validate(Dtos.getAlertDto), verifyToken, alertController.getAlert)
router.put('/update/:id', validate(Dtos.updateAlertDto), verifyToken, clearCache('alert'), alertController.updateAlert)
router.delete('/delete/:id', validate(Dtos.deleteAlertDto), verifyToken, clearCache('alert'), alertController.deleteAlert)

module.exports = router;
