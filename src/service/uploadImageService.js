const bcrypt = require("bcryptjs");
const nextError = require("../helpers/errorTypeFunction");
const { getUniqueId } = require("../helpers/getUniqueId");
const MailService = require("./sendMailService/sendMail");
const _ = require("lodash");
const ApiError = require("../error/api-error");

//#region upload image
const uploadImage = async (body) => {
  try {
    let image = {};
    for (const [key, value] of Object.entries(body)) {
      if (value.size === "normal") {
        image.normal = value.url;
      }
      if (value.size === "small") {
        image.small = value.url;
      }
    }

    if (!body) throw ApiError("Image not found");
    return {
      result: true,
      message: "Image uploaded successfully",
      data: image,
    };
  } catch (error) {
    nextError(error);
  }
};

module.exports = {
  uploadImage,
};
