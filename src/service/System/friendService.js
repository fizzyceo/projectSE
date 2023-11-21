const bcrypt = require("bcryptjs");
const ApiError = require("../../error/api-error.js");
const MailService = require("../sendMailService/sendMail");
const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
const { getUniqueId } = require("../../helpers/getUniqueId");
const connectDb = require("../../database/connectDb.js");
const supabase = connectDb();

const create = async (body) => {
  const { iduser1 , iduser2 } = body;
  try {
    const conv = await supabase.from("Friend").insert({
     iduser1: iduser1,
      iduser2: iduser2,
    });
    if (conv) {
      return {
        result: true,
        message: "insert friend successful",
        data: conv,
      };
    } else {
      throw ApiError.badRequest("insert friend failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const deleteRecord = async (id) => {
  try {
    const conv = await supabase.from("Friend").delete().eq("idFriend", id);
    if (conv) {
      return {
        result: true,
        message: "deleteRecord friend successful",
        data: conv,
      };
    } else {
      throw ApiError.badRequest("deleteRecord conversation failed");
    }
  } catch (error) {
    nextError(error);
  }
};
/*const update = async (body, id) => {
  try {
    let query = supabase.from("conversation").update(body).eq("idconv", id);

    const data = await query;
    return {
      result: true,
      message: "update friend successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("update conversation failed");
    // nextError(error);
  }
};*/
const get = async (body) => {
  console.log("fetching conv ......");
  try {
    let query = supabase.from("Friend").select("*");

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
      message: "insert friend successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("insert friend failed");
    // nextError(error);
  }
};
const getone = async (id) => {
  try {
    const data = await supabase
      .from("Friend")
      .select("*")
      .eq("idFriend", id);

    return {
      result: true,
      message: "getone friend successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("getone friend failed");
    // nextError(error);
  }
};

module.exports = {
  create,
  get,
  getone,
  //update,
  deleteRecord,
};
