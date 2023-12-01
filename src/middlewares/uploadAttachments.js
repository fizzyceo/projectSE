const multer = require("multer");


var uploadAttachments = multer({
    fileFilter: function (req, file, callback) {
        callback(null, true);
    },
    storage: multer.memoryStorage()
});


module.exports = uploadAttachments;