const multer = require("multer");


var uploadWrittenFile = (fileName) => {
    return multer({
        fileFilter: function (req, file, callback) {
            let fileExtension = (file.originalname.split('.')[file.originalname.split('.').length - 1]).toLowerCase(); // convert extension to lower case
            if (["pdf", "doc", "docx"].indexOf(fileExtension) === -1) {
                return callback('Wrong file type', false);
            }
            callback(null, true);
        },
        storage: multer.diskStorage({
            destination: './public', // store in local filesystem
            filename: function (req, file, cb) {
                let fileExtension = (file.originalname.split('.')[file.originalname.split('.').length - 1]).toLowerCase(); // convert extension to lower case
                req.fileUrl = process.env.SERVER_URL + `${fileName}.${fileExtension}`;
                cb(null, `${fileName}.${fileExtension}`)
            }
        })

    }).single('file')
};


module.exports = uploadWrittenFile;