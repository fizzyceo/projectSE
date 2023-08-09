const staffDto = require('./staff');
const deviceDto = require('./device');
const alertDto = require('./alert');

module.exports = {
    ...staffDto,
    ...alertDto,
    ...deviceDto
    
}
