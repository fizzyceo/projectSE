const express = require("express");
const { validate } = require("express-validation");
const AvgWindController = require("../../controller/systemManagement/AvgWindController");
const { verifyToken } = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const Dtos = require("../../schema");
const clearCache = require("../../cachingSystem/middleware/clearCache");
const router = express.Router();

// authorizeRoles('client')
router.post("/create",clearCache("avgWind"),AvgWindController.createAvgWind);
router.get("/get", AvgWindController.getAvgWind);
router.post("/dates",AvgWindController.getAvgWindBetweenDates)
router.get("/get/:id", AvgWindController.getOneAvgWind);
router.put("/update/:id", clearCache("avgWind"),verifyToken, AvgWindController.updateAvgWind);
router.put("/update/", clearCache("avgWind"),AvgWindController.updateAvgWindByDate);
router.delete("/delete/:id",clearCache("avgWind"), verifyToken, AvgWindController.DeleteAvgWind);

module.exports = router;
