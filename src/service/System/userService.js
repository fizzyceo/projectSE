const bcrypt = require('bcrypt');
const ApiError = require("../../error/api-error.js");
const MailService = require("../sendMailService/sendMail");
const nextError = require("../../helpers/errorTypeFunction");
const _ = require("lodash");
const { getUniqueId } = require("../../helpers/getUniqueId");
const connectDb = require("../../database/connectDb.js");
const supabase = connectDb();




const saltRounds = 10; // Le coût du hachage, vous pouvez ajuster selon vos besoins

const create = async (body) => {
  const { nom, prenom, username, password, dateN, active } = body;

  try {
    // Générez un sel
    const salt = await bcrypt.genSalt(saltRounds);
    // Hachez le mot de passe avec le sel
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await supabase.from("user").insert({
      nom: nom,
      prenom: prenom,
      username: username,
      password: hashedPassword, // Utilisez le mot de passe haché
      dateN: dateN,
      active: active,
    });

    if (user) {
      return {
        result: true,
        message: "Insertion d'utilisateur réussie",
        data: user,
      };
    } else {
      throw ApiError.badRequest("Échec de l'insertion de l'utilisateur");
    }
  } catch (error) {
    nextError(error);
  }
};






/*

const create2 = async (body) => {
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
};*/
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


const login = async (body) => {
  try {
    // Récupération de l'utilisateur depuis Supabase en utilisant l'e-mail comme filtre
    const { data: users, error } = await supabase
      .from("user")
      .select("*")
      .eq("username", body.username);

    if (error) {
      throw error;
    }

    // Vérification si l'utilisateur existe
    if (users.length === 0) {
      return {
        result: false,
        message: "Invalid credentials",
      };
    }

    const user = users[0]; // En supposant qu'il n'y a qu'un seul utilisateur avec cet e-mail

    // Vérification du mot de passe avec bcrypt
    const passwordMatch = await bcrypt.compare(body.password, user.hashedPassword);

    if (!passwordMatch) {
      // Mot de passe incorrect
      return {
        result: false,
        message: "Invalid credentials",
      };
    }

    // Si le mot de passe est correct, générer un jeton avec jsonwebtoken
    const token = jwt.sign({ userId: user.idu, username: user.username }, "yourSecretKey", { expiresIn: "1h" });

    // Réponse avec le token
    return {
      result: true,
      message: "Login successful",
      token: token,
    };
  } catch (error) {
    console.error("Error:", error);
    throw ApiError.badRequest("Login failed");
  }
};






module.exports = {
  create,
  get,
  getone,
  update,
  deleteRecord,
  login
};
