const express = require("express");
const { validate } = require("express-validation");
const HistoricalTempHumController = require("../../controller/systemManagement/HistoricalTempHumController");
const { verifyToken } = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const Dtos = require("../../schema");
const clearCache = require("../../cachingSystem/middleware/clearCache");
const router = express.Router();

// authorizeRoles('client')
router.post("/create",HistoricalTempHumController.createHistoricalTemphum);
router.get("/get", HistoricalTempHumController.getHistoricalTemphum);
router.get("/get/:id", HistoricalTempHumController.getOneHistoricalTemphum);
router.put("/update/:id", verifyToken, HistoricalTempHumController.updateHistoricalTemphum);
router.delete("/delete/:id", verifyToken, HistoricalTempHumController.DeleteHistoricalTemphum);

module.exports = router;
