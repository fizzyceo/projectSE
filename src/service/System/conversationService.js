const bcrypt = require("bcryptjs");
const ApiError = require("../../error/api-error.js");
const MailService = require("../sendMailService/sendMail");
const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
const { getUniqueId } = require("../../helpers/getUniqueId");
const connectDb = require("../../database/connectDb.js");
const supabase = connectDb();

const create = async (body) => {
  const { nom, photo } = body;
  try {
    const conv = await supabase.from("conversation").insert({
      nom: nom,
      photo: photo,
    });
    if (conv) {
      return {
        result: true,
        message: "insert conversation successful",
        data: conv,
      };
    } else {
      throw ApiError.badRequest("insert conversation failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const deleteRecord = async (id) => {
  try {
    const conv = await supabase.from("conversation").delete().eq("idconv", id);
    if (conv) {
      return {
        result: true,
        message: "deleteRecord conversation successful",
        data: conv,
      };
    } else {
      throw ApiError.badRequest("deleteRecord conversation failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const update = async (body, id) => {
  try {
    let query = supabase.from("conversation").update(body).eq("idconv", id);

    const data = await query;
    return {
      result: true,
      message: "update conversation successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("update conversation failed");
    // nextError(error);
  }
};
const get = async (body) => {
  console.log("fetching conv ......");
  try {
    let query = supabase.from("conversation").select("*");

    // Iterate through the keys in the request body
    Object.keys(body).forEach((key) => {
      // Check if the key exists and is not empty
      if (body[key]) {
        // Add a filter condition for each key-value pair in the request body
        query = query.eq(key, body[key]);
      }
    });
    console.log("fetching ......");

    const data = await query;
    console.log("finished ......", data);

    return {
      result: true,
      message: "insert conversation successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("insert conversation failed");
    // nextError(error);
  }
};
const getone = async (id) => {
  try {
    const data = await supabase
      .from("conversation")
      .select("*")
      .eq("idconv", id);

    return {
      result: true,
      message: "getone conversation successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("getone conversation failed");
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
