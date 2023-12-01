const bcrypt = require("bcryptjs");
const ApiError = require("../../error/api-error.js");
const MailService = require("../sendMailService/sendMail");
const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
const { getUniqueId } = require("../../helpers/getUniqueId");
const connectDb = require("../../database/connectDb.js");
const moment = require("moment");
const supabase = connectDb();
//we want to fetch all messages that belong to a specific chat/convo
//we want to
const create = async (userId, body) => {
  const { text, idconv } = body;
  try {
    const datemsg = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const message = await supabase
      .from("message")
      .insert({
        text: text,

        datemsg: datemsg,
        idconv: idconv,
        sender: userId,
      })
      .select();

    if (message) {
      io.emit("new_message", { text, idconv, sender: userId, datemsg });

      //emit socket message
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
