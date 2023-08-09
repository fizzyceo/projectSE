const authDtos = require('./auth');
const systemDtos = require('./systemManagement');
const uploadImageDto = require('./uploadImage');

module.exports = {
    ...authDtos,
    ...systemDtos,
    ...uploadImageDto,
}


