const bcrypt = require("bcryptjs");
const ApiError = require("../../error/api-error.js");
const MailService = require("../sendMailService/sendMail");
const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
//const crypto = require('crypto');
const { getUniqueId } = require("../../helpers/getUniqueId");
const connectDb = require("../../database/connectDb.js");
const supabase = connectDb();
//const secretKey = 'myDatabase@1';


const create = async (body) => {
  const {  idComment, textes } = body;
  try {
    const conv = await supabase.from("Comment").insert({
     idComment: idComment,
      textes: textes,
    });
    if (conv) {
      return {
        result: true,
        message: "insert comment successful",
        data: conv,
      };
    } else {
      throw ApiError.badRequest("insert comment failed");
    }
  } catch (error) {
    nextError(error);
  }
};

const deleteRecord = async (id) => {
  try {
    const conv = await supabase.from("Comment").delete().eq("idComment", id);
    if (conv) {
      return {
        result: true,
        message: "deleteRecord comment successful",
        data: conv,
      };
    } else {
      throw ApiError.badRequest("deleteRecord comment failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const update = async (body, id) => {
  try {
    let query = supabase.from("Comment").update(body).eq("idComment", id);

    const data = await query;
    return {
      result: true,
      message: "update comment successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("update comment failed");
    // nextError(error);
  }
};
const get = async (body) => {
  console.log("fetching comment ......");
  try {
    let query = supabase.from("comment").select("*");

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
      message: "insert comment successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("insert comment failed");
    // nextError(error);
  }
};
const getone = async (id) => {
  try {
    const data = await supabase
      .from("Comment")
      .select("*")
      .eq("idComment", id);

    return {
      result: true,
      message: "getone comment successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("getone comment failed");
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