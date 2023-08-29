const express = require("express");
const { validate } = require("express-validation");
const AvgWindController = require("../../controller/systemManagement/AvgWindController");
const { verifyToken } = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const Dtos = require("../../schema");
const clearCache = require("../../cachingSystem/middleware/clearCache");
const router = express.Router();

// authorizeRoles('client')
router.post("/create",AvgWindController.createAvgWind);
router.get("/get", AvgWindController.getAvgWind);
router.post("/dates",AvgWindController.getAvgWindBetweenDates)
router.get("/get/:id", AvgWindController.getOneAvgWind);
router.put("/update/:id", verifyToken, AvgWindController.updateAvgWind);
router.put("/update/", AvgWindController.updateAvgWindByDate);
router.delete("/delete/:id", verifyToken, AvgWindController.DeleteAvgWind);

module.exports = router;
