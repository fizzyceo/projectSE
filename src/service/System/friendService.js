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
/*
const create = async (body) => {
    const { iduser1, iduser2 } = body;
  
    // Données à crypter
    const dataToEncrypt = { iduser1, iduser2 };
  
    // Convertir les données en chaîne JSON
    const jsonData = JSON.stringify(dataToEncrypt);
  
    // Générer un vecteur d'initialisation (IV)
    const iv = crypto.randomBytes(16);
  
    // Définir votre clé secrète (assurez-vous qu'elle est correctement définie)
    const secretKey = 'votre_cle_secrete'; // Remplacez par votre clé secrète
  
    // Créer un objet de chiffrement AES
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  
    // Crypter les données
    let encryptedData = cipher.update(jsonData, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');
  
    try {
      // Insérer les données cryptées dans Supabase
      const conv = await supabase.from("Friend").insert({
        encrypted_data: encryptedData,
        iv: iv.toString('hex'), // stocker l'IV pour le déchiffrement ultérieur
      });
  
      if (conv) {
        return {
          result: true,
          message: "Insertion d'ami réussie",
          data: conv,
        };
      } else {
        throw ApiError.badRequest("Échec de l'insertion d'ami");
      }
    } catch (error) {
      nextError(error);
    }
  };
  */
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
