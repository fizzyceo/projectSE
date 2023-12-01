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
const deleteRecord = async (id) => {
  try {
    const user = await supabase.from("publication").delete().eq("idpub", id);
    if (user) {
      return {
        result: true,
        message: "deleteRecord publication successful",
        data: user,
      };
    } else {
      throw ApiError.badRequest("deleteRecord publication failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const update = async (body, id) => {
  try {
    let query = supabase.from("publication").update(body).eq("idpub", id);

    const data = await query;
    return {
      result: true,
      message: "update publication successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("update publication failed");
    // nextError(error);
  }
};
const get = async (body) => {
  try {
    let query = supabase.from("publication").select("*");

    // Iterate through the keys in the request body
    Object.keys(body).forEach((key) => {
      // Check if the key exists and is not empty
      if (body[key]) {
        // Add a filter condition for each key-value pair in the request body
        query = query.eq(key, body[key]);
      }
    });
    const data = await query;
    return {
      result: true,
      message: "insert publication successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("insert publication failed");
    // nextError(error);
  }
};
const getone = async (id) => {
  try {
    const data = await supabase.from("publication").select("*").eq("idpub", id);

    return {
      result: true,
      message: "getone publication successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("getone publication failed");
    // nextError(error);
  }
};

module.exports = {
  create,
  get,
  getone,
  update,
  deleteRecord,
};
