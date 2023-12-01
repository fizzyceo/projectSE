const bcrypt = require("bcryptjs");
const ApiError = require("../../error/api-error.js");
const MailService = require("../sendMailService/sendMail");
const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
const { getUniqueId } = require("../../helpers/getUniqueId");
const connectDb = require("../../database/connectDb.js");
const supabase = connectDb();

const create = async (body) => {
  const { idu , idconv } = body;
  try {
    const conv = await supabase.from("groupe").insert({
        idu: idu ,
      idconv: idconv,
    });
    if (conv) {
      return {
        result: true,
        message: "insert group successful",
        data: conv,
      };
    } else {
      throw ApiError.badRequest("insert group failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const deleteRecord = async (id) => {
  try {
    const conv = await supabase.from("groupe").delete().eq("idgroupe", id);
    if (conv) {
      return {
        result: true,
        message: "deleteRecord group successful",
        data: conv,
      };
    } else {
      throw ApiError.badRequest("deleteRecord group failed");
    }
  } catch (error) {
    nextError(error);
  }
};
const update = async (body, id) => {
  try {
    let query = supabase.from("groupe").update(body).eq("idgroupe", id);

    const data = await query;
    return {
      result: true,
      message: "update groupe successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("update groupe failed");
    // nextError(error);
  }
};
const get = async (body) => {
  console.log("fetching conv.");
  try {
    let query = supabase.from("groupe").select("*");

    Object.keys(body).forEach((key) => {
   
      if (body[key]) {
        query = query.eq(key, body[key]);
      }
    });
    console.log("fetching ");

    const data = await query;
    console.log("finished ", data);

    return {
      result: true,
      message: " successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("get failed");
    // nextError(error);
  }
};
const getone = async (id) => {
  try {
    const data = await supabase
      .from("groupe")
      .select("*")
      .eq("idgroupe", id);

    return {
      result: true,
      message: "successful",
      data: data,
    };
  } catch (error) {
    throw ApiError.badRequest("failed");
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
