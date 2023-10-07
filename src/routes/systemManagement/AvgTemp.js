const express = require("express");
const { validate } = require("express-validation");
const AvgTempController = require("../../controller/systemManagement/AvgTempController");
const { verifyToken } = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const Dtos = require("../../schema");
const clearCache = require("../../cachingSystem/middleware/clearCache");
const router = express.Router();

// authorizeRoles('client')
router.post("/create",clearCache("avgTemp"),AvgTempController.createAvgTemp);
router.get("/get", AvgTempController.getAvgTemp);
router.get("/get/:id", AvgTempController.getOneAvgTemp);
router.post("/dates",AvgTempController.getAvgTempBetweenDates)

router.put("/update/:id", clearCache("avgTemp"),verifyToken, AvgTempController.updateAvgTemp);
router.put("/update/", clearCache("avgTemp"),AvgTempController.updateAvgTempByDate);
router.delete("/delete/:id",clearCache("avgTemp"), verifyToken, AvgTempController.DeleteAvgTemp);

module.exports = router;
