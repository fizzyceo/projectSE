const express = require("express");
const { validate } = require("express-validation");
const HistWindController = require("../../controller/systemManagement/HistoricalWindController");
const { verifyToken } = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const Dtos = require("../../schema");
const clearCache = require("../../cachingSystem/middleware/clearCache");
const router = express.Router();

// authorizeRoles('client')
router.post("/create",clearCache("histWind"),HistWindController.createHistoricalWind);
router.get("/get", HistWindController.getHistoricalWind);
router.get("/latest/:devid",HistWindController.getLatestWind)
router.get("/get/:id", HistWindController.getOneHistoricalWind);
router.put("/update/:id",clearCache("histWind") ,verifyToken, HistWindController.updateHistoricalWind);
router.delete("/delete/:id",clearCache("histWind"), HistWindController.DeleteHistoricalWind);

module.exports = router;
