
const User = require('./users');
const Alert = require('./alerts')
const Device = require('./devices')

const db = {
    User,
    Alert,
    Device
}
module.exports = {
    db,

};