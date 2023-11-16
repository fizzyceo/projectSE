const express = require("express");
const uploadImageController = require("../controller/uploadImagesController");
const { verifyToken } = require("../middlewares/verifyToken");
const uploadImage = require("../middlewares/uploadImage");
const resizeImage = require("../middlewares/resizeImage");

const router = express.Router();

// upload images
router.post(
  "/upload",
  verifyToken,
  uploadImage.single("image"),
  resizeImage(),
  uploadImageController.uploadImage
);
module.exports = router;
// validate(Dtos.uploadImageDto),
