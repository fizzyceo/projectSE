const bcrypt = require("bcryptjs");
const ApiError = require("../../error/api-error.js");
const MailService = require("../sendMailService/sendMail");
const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
const { getUniqueId } = require("../../helpers/getUniqueId");
const connectDb = require("../../database/connectDb.js");
const supabase = connectDb();

const create = async (body) => {
  const { text, photo, file, likes, etat, iduser } = body;
  try {
    const user = await supabase.from("publication").insert({
      text: text,
      photo: photo,
      file: file,
      etat: etat,
      likes: likes,
      iduser: iduser,
    });
    if (user) {
      return {
        result: true,
        message: "insert publication successful",
        data: user,
      };
    } else {
      throw ApiError.badRequest("insert publication failed");
    }
  } catch (error) {
    nextError(error);
  }
};

module.exports = {
  create,
};
