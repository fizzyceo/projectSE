const bcrypt = require("bcryptjs");
const ApiError = require("../../error/api-error.js");
const MailService = require("../sendMailService/sendMail");
const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
const { getUniqueId } = require("../../helpers/getUniqueId");
const connectDb = require("../../database/connectDb.js");
const supabase = connectDb();

const create = async (body) => {
  const {  nom, prenom,  username,  password,  dateN, active } = body;
  try {
    const user = await supabase.from("user").insert({
      nom: nom,
      prenom: prenom,
      username: username,
      password: password,
      dateN: dateN,
      active: active,
    });
    if (user) {
      return {
        result: true,
        message: "insert user successful",
        data: user,
      };
    } else {
      throw ApiError.badRequest("insert user failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const deleteRecord = async (id) => {
  try {
    const user = await supabase.from("user").delete().eq("idu", id);
    if (user) {
      return {
        result: true,
        message: "deleteRecord user successful",
        data: user,
      };
    } else {
      throw ApiError.badRequest("deleteRecord user failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const update = async (body, id) => {
  try {
    let query = supabase.from("user").update(body).eq("idu", id);

    const data = await query;
    return {
      result: true,
      message: "update user successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("update user failed");
    // nextError(error);
  }
};
const get = async (body) => {
  try {
    let query = supabase.from("user").select("*");

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
      message: "get successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("get failed");
    // nextError(error);
  }
};
const getone = async (id) => {
  try {
    const data = await supabase.from("user").select("*").eq("idu", id);

    return {
      result: true,
      message: "getone user successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("getone user failed");
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