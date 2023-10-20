const express = require("express");
const router = express.Router();
const staffRoutes = require("./staff");
const alertRoutes = require('./alert')
const deviceRoutes = require('./device')
const HistoricalTemphum = require('./HistoricalTempHum')
const HistoricalWind = require("./HistoricalWind")

const windTemp = require('./WindTemp')

const AvgWind = require("./AvgWind")
const AvgTemp = require("./AvgTemp")

const SitesRoutes = require("./Site")
const SiteHistoryRoutes = require("./SiteHistory")
const regionRoutes = require("./regions")
const regionForecastRoutes = require("./regionForecast")
const PercipitationRoutes = require("./Percipitation")

router.use("/manage-staff", staffRoutes);
router.use("/alert", alertRoutes);
router.use("/device", deviceRoutes);
router.use("/temp",HistoricalTemphum)
router.use("/wind",HistoricalWind)
router.use("/windTemp",windTemp)
router.use("/avgwind",AvgWind)
router.use("/avgtemp",AvgTemp)
router.use("/site",SitesRoutes)
router.use("/siteHistory",SiteHistoryRoutes)
router.use("/region",regionRoutes)
router.use("/regionForecast",regionForecastRoutes)
router.use("/precipitation",PercipitationRoutes)
module.exports = router;

