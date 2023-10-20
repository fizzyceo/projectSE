
const User = require('./users');
const Alert = require('./alerts')
const Device = require('./devices')
const HistoricalTemphum = require('./historical_temphum')
const HistoricalWind= require('./historical_wind')
const AvgWind = require('./avg_wind')
const AvgTemp = require('./avg_temp')
const Site = require('./Site');
const site_historical_data = require('./site_historical_data');
const regions = require("./regions")
const regionForecast = require('./regionForecast');
const db = {
    User,
    Alert,
    Device,
    HistoricalTemphum,
    HistoricalWind,
    AvgWind,
    AvgTemp,
    Site,
    site_historical_data,
    regions,
    regionForecast
}
module.exports = {
    db,

};