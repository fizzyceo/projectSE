
const User = require('./users');
const Alert = require('./alerts')
const Device = require('./devices')
const HistoricalTemphum = require('./historical_temphum')
const HistoricalWind= require('./historical_wind')
const AvgWind = require('./avg_wind')
const AvgTemp = require('./avg_temp')
const db = {
    User,
    Alert,
    Device,
    HistoricalTemphum,
    HistoricalWind,
    AvgWind,
    AvgTemp
}
module.exports = {
    db,

};