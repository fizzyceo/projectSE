const express = require("express");
const router = express.Router();
const staffRoutes = require("./staff");
const alertRoutes = require('./alert')
const deviceRoutes = require('./device')

router.use("/manage-staff", staffRoutes);
router.use("/alert", alertRoutes);
router.use("/device", deviceRoutes);


module.exports = router;
