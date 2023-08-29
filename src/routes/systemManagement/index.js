const express = require("express");
const router = express.Router();
const staffRoutes = require("./staff");
const alertRoutes = require('./alert')
const deviceRoutes = require('./device')
const HistoricalTemphum = require('./HistoricalTempHum')
const HistoricalWind = require("./HistoricalWind")
const AvgWind = require("./AvgWind")
const AvgTemp = require("./AvgTemp")
router.use("/manage-staff", staffRoutes);
router.use("/alert", alertRoutes);
router.use("/device", deviceRoutes);
router.use("/temp",HistoricalTemphum)
router.use("/wind",HistoricalWind)
router.use("/avgwind",AvgWind)
router.use("/avgtemp",AvgTemp)
module.exports = router;
