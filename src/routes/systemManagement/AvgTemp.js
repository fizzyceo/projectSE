const express = require("express");
const { validate } = require("express-validation");
const AvgTempController = require("../../controller/systemManagement/AvgTempController");
const { verifyToken } = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const Dtos = require("../../schema");
const clearCache = require("../../cachingSystem/middleware/clearCache");
const router = express.Router();

// authorizeRoles('client')
router.post("/create",AvgTempController.createAvgTemp);
router.get("/get", AvgTempController.getAvgTemp);
router.get("/get/:id", AvgTempController.getOneAvgTemp);
router.post("/dates",AvgTempController.getAvgTempBetweenDates)

router.put("/update/:id", verifyToken, AvgTempController.updateAvgTemp);
router.put("/update/", AvgTempController.updateAvgTempByDate);
router.delete("/delete/:id", verifyToken, AvgTempController.DeleteAvgTemp);

module.exports = router;
