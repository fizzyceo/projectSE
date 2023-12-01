const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const ApiError = require("../error/api-error");
const dotenv = require("dotenv");
dotenv.config();

const checkDirectory = (folder) => {
  const normalPath = `./public/images/${folder}/normal/`;
  const smallPath = `./public/images/${folder}/small/`;

  const paths = [normalPath, smallPath];
  paths.forEach((path) => {
    const directory = path.split("/").slice(0, -1).join("/");
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  });
};
const resizeImage = function (
  folder = "random",
  dimensions = {
    normal: { width: 900, height: 630 },
    small: { width: 200, height: 150 },
  }
) {
  return async (req, res, next) => {
    console.info("image uploaded to server");
    try {
      if (!req.file) {
        throw ApiError.badRequest("no file was uploaded");
      }
      const timestamp = +new Date();
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate() + 1;
      const datePath = `${year}/${month}/${day}`;
      checkDirectory(folder);
      const smallUrl = `images/${folder}/normal/${timestamp}-${req.file.originalname}`;
      const normalUrl = `images/${folder}/small/${timestamp}-${req.file.originalname}`;
      const image = sharp(req.file.buffer);
      const normalImagePath = path.resolve(`./public/${smallUrl}`);
      const smallImagePath = path.resolve(`./public/${normalUrl}`);
      await image
        .resize(dimensions.normal.width, dimensions.normal.height, {
          fit: sharp.fit.inside,
        })
        .toFile(normalImagePath);
      await image
        .resize(dimensions.small.width, dimensions.small.height, {
          fit: sharp.fit.inside,
        })
        .toFile(smallImagePath);

      console.info("image resize success");
      req.newImageUrls = [
        {
          size: "normal",
          url: process.env.SERVER_URL + "/" + encodeURIComponent(smallUrl),
        },
        {
          size: "small",
          url: process.env.SERVER_URL + "/" + encodeURIComponent(normalUrl),
        },
      ];
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = resizeImage;

// const sharp = require("sharp");
// const fs = require("fs");
// const path = require('path');
// const { console } = require("../console");
// const ApiError = require("../error/api-error");

// const tmpDirectory = path.resolve(`./tmp`);
// const normalImageSizeDirectory = path.resolve(`./tmp/normal`);
// const smallImageSizeDirectory = path.resolve(`./tmp/small`);

// if (!fs.existsSync(tmpDirectory)) {
//     fs.mkdirSync(tmpDirectory);
// }

// if (!fs.existsSync(normalImageSizeDirectory)) {
//     fs.mkdirSync(normalImageSizeDirectory);
// }

// if (!fs.existsSync(smallImageSizeDirectory)) {
//     fs.mkdirSync(smallImageSizeDirectory);
// }

// const resizeImage = function (dimensions = {
//     normal: { width: 900, height: 630 },
//     small: { width: 200, height: 150 }
// }) {
//     return async (req, res, next) => {
//         console.info('image uploaded to server');
//         try {
//             if (!req.file) {
//                 throw ApiError.badRequest('no file was uploaded');
//             }
//             const image = sharp(req.file.path);
//             const normalImagePath = path.resolve(`./tmp/normal/${req.file.filename}`);
//             const smallImagePath = path.resolve(`./tmp/small/${req.file.filename}`);
//             await image.resize(
//                 dimensions.normal.width, dimensions.normal.height,
//                 {
//                     fit: sharp.fit.inside
//                 }
//             ).toFile(normalImagePath);
//             await image.resize(dimensions.small.width, dimensions.small.height, {
//                 fit: sharp.fit.inside,
//             }).toFile(smallImagePath);
//             console.info('image resize success');
//             fs.rm(req.file.path, (err) => {
//                 if (err)
//                     console.error("failed to delete file after resizeing")
//             });

//             req.filesPaths = [{ type: "normal", path: normalImagePath }, { type: 'small', path: smallImagePath }];
//             next();
//         } catch (error) {
//             next(error);
//         }
//     }
// }

// module.exports = resizeImage;
