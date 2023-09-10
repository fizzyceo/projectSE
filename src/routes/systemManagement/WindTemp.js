const express = require("express");
const { validate } = require("express-validation");
const windTempController = require("../../controller/systemManagement/WindTempController");
const { verifyToken } = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const Dtos = require("../../schema");
const clearCache = require("../../cachingSystem/middleware/clearCache");
const router = express.Router();

// authorizeRoles('client')
router.post("/create",windTempController.createWindTemp);
router.get("/get", windTempController.getWindTemp);
router.get("/get/:id", windTempController.getOneWindTemp);
router.put("/update/:id", verifyToken, windTempController.updateWindTemp);
router.delete("/delete/:id", verifyToken, windTempController.DeleteWindTemp);

module.exports = router;
