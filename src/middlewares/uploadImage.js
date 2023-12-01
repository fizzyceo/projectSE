
const multer = require("multer");
const storage = multer.memoryStorage();

const filter = function (req, file, callback) {
    let fileExtension = (file.originalname.split('.')[file.originalname.split('.').length - 1]).toLowerCase(); // convert extension to lower case
    if (["png", "jpg", "jpeg"].indexOf(fileExtension) === -1) {
        return callback('Wrong file type', false);
    }
    file.extension = fileExtension.replace(/jpeg/i, 'jpg'); // all jpeg images to end .jpg
    callback(null, true);
}

const uploadImage = multer({
        fileFilter: filter,
        storage: storage
    })

module.exports = uploadImage;






// const multer = require("multer");


// var uploadImage = multer({
//     // limits: { fileSize: 10 * 1000 * 1000 }, // now allowing user uploads up to 10MB
//     fileFilter: function (req, file, callback) {
//         let fileExtension = (file.originalname.split('.')[file.originalname.split('.').length - 1]).toLowerCase(); // convert extension to lower case
//         if (["png", "jpg", "jpeg"].indexOf(fileExtension) === -1) {
//             return callback('Wrong file type', false);
//         }
//         file.extension = fileExtension.replace(/jpeg/i, 'jpg'); // all jpeg images to end .jpg
//         callback(null, true);
//     },
//     storage: multer.diskStorage({
//         destination: './tmp', // store in local filesystem
//         filename: function (req, file, cb) {
//             cb(null, `${Date.now().toString()}-${file.originalname}`)
//         }
//     })
// });
