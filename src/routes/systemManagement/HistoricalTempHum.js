const express = require("express");
const { validate } = require("express-validation");
const HistoricalTempHumController = require("../../controller/systemManagement/HistoricalTempHumController");
const { verifyToken } = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const Dtos = require("../../schema");
const clearCache = require("../../cachingSystem/middleware/clearCache");
const router = express.Router();

// authorizeRoles('client')
router.post("/create", clearCache("histTemp"),HistoricalTempHumController.createHistoricalTemphum);
router.post("/get", HistoricalTempHumController.getHistoricalTemphum);
router.post("/period", HistoricalTempHumController.getTempPerPeriod);
router.get("/latest/:devid", HistoricalTempHumController.getLatestTempHum);
router.get("/get/:id", HistoricalTempHumController.getOneHistoricalTemphum);
router.put("/update/:id", clearCache("histTemp"), verifyToken, HistoricalTempHumController.updateHistoricalTemphum);
router.delete("/delete/:id",clearCache("histTemp"), HistoricalTempHumController.DeleteHistoricalTemphum);

module.exports = router;
