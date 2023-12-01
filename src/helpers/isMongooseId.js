const { default: mongoose } = require('mongoose');
const isMongooseId = (value, helpers) => {
    if (mongoose.Types.ObjectId.isValid(value)) {
        return value;
    }
    return helpers.message("Invalid advertiser id");
}



module.exports = isMongooseId;