const bcrypt = require("bcryptjs");
const ApiError = require("../../error/api-error.js");
const MailService = require("../sendMailService/sendMail");
const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
const { getUniqueId } = require("../../helpers/getUniqueId");
const connectDb = require("../../database/connectDb.js");
const supabase = connectDb();

const create = async (body) => {
  const { text, image, file, vocal, datemsg, idconv } = body;
  try {
    const message = await supabase.from("message").insert({
      text: text,
      image: image,
      file: file,
      datemsg: datemsg,
      vocal: vocal,
      idconv: idconv,
    });
    if (message) {
      return {
        result: true,
        message: "insert message successful",
        data: message,
      };
    } else {
      throw ApiError.badRequest("insert message failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const deleteRecord = async (id) => {
  try {
    const message = await supabase.from("message").delete().eq("idmsg", id);
    if (message) {
      return {
        result: true,
        message: "deleteRecord message successful",
        data: message,
      };
    } else {
      throw ApiError.badRequest("deleteRecord message failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const update = async (body, id) => {
  try {
    let query = supabase.from("message").update(body).eq("idmsg", id);

    const data = await query;
    return {
      result: true,
      message: "update message successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("update message failed");
    // nextError(error);
  }
};
const get = async (body) => {
  try {
    let query = supabase.from("message").select("*");

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
      message: "insert message successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("insert message failed");
    // nextError(error);
  }
};
const getone = async (id) => {
  try {
    const data = await supabase.from("message").select("*").eq("idmsg", id);

    return {
      result: true,
      message: "getone message successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("getone message failed");
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
