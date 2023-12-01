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


/*
const login = async (body) => {
  const { username, password } = body;

  try {
    // Recherche de l'utilisateur dans la base de données
    const { data: users, error } = await supabase
      .from("user")
      .select("*")
      .eq("username", username);

    if (error) {
      throw error;
    }

    if (users.length === 0) {
      // Aucun utilisateur trouvé avec le nom d'utilisateur donné
      return {
        result: false,
        message: "Invalid credentials",
      };
    }

    const user = users[0];

    // Vérification du mot de passe
    if (user.password !== password) {
      // Mot de passe incorrect
      return {
        result: false,
        message: "Invalid credentials",
      };
    }

    // Login réussi
    return {
      result: true,
      message: "Login successful",
      user: {
       // idu: user.id,
        username: user.username,
        // Ajoutez d'autres champs d'utilisateur si nécessaire
      },
    };
  } catch (error) {
    console.error("Error:", error);
    throw ApiError.badRequest("Login failed");
  }
};

*/





const jwt = require('jsonwebtoken');

const login = async (body) => {
  const { username, password } = body;

  try {
    // Recherche de l'utilisateur dans la base de données
    const { data: users, error } = await supabase
      .from("user")
      .select("*")
      .eq("username", username);

    if (error) {
      throw error;
    }

    if (users.length === 0) {
      // Aucun utilisateur trouvé avec le nom d'utilisateur donné
      return {
        result: false,
        message: "Invalid credentials",
      };
    }

    const user = users[0];

    // Vérification du mot de passe avec bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Mot de passe incorrect
      return {
        result: false,
        message: "Invalid credentials",
      };
    }

    // Génération du jeton
    const token = jwt.sign({ userId: user.id, username: user.username }, "votreClefSecrete", { expiresIn: '1h' });

    // Login réussi avec jeton
    return {
      result: true,
      message: "Login successful",
      user: {
        username: user.username,
      },
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
