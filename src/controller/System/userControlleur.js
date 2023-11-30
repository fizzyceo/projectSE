const userService = require("../../service/System/userService");
const { formatSuccessResponse, formatErrorResponse } = require("../../helpers/formatResponse");
const { generateAccessToken } = require("../../helpers/jwt");
const nextError = require("../../helpers/tryCatchWrapper")
const tryCatchWrapper = require("../../helpers/tryCatchWrapper");
//const userService = require('../service/System/userService'); // Assurez-vous d'ajuster le chemin selon la structure de votre projet
//const { formatSuccessResponse } = require('../../chemin-vers-vos-fonctions-utilitaires'); // Assurez-vous d'ajuster le chemin selon la structure de votre projet

const _ = require("lodash");
//const { formatSuccessResponse } = require("../../helpers/formatResponse");

const create = tryCatchWrapper(async (req, res, next) => {
  const body = req.body;
  const result = await userService.create(body);
  return res.status(200).json(formatSuccessResponse(result, req));
});
const update = tryCatchWrapper(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const result = await userService.update(body, id);
  return res.status(200).json(formatSuccessResponse(result, req));
});
const get = tryCatchWrapper(async (req, res, next) => {
  const body = req.body;
  const result = await userService.get(body);
  return res.status(200).json(formatSuccessResponse(result, req));
});
const getone = tryCatchWrapper(async (req, res, next) => {
  const id = req.params.id;

  const result = await userService.getone(id);
  return res.status(200).json(formatSuccessResponse(result, req));
});
const deleteRecord = tryCatchWrapper(async (req, res, next) => {
  const id = req.params.id;

  const result = await userService.deleteRecord(id);
  return res.status(200).json(formatSuccessResponse(result, req));
});
/*
const login = async (body) => {
  try {
    console.log("Login function called with body:", body);

    if (!body || !body.username || !body.password) {
      console.error("Invalid request. Username or password is missing.");
      return {
        result: false,
        message: "Invalid request. Username or password is missing.",
      };
    }

    const { data: users, error } = await supabase
      .from("user")
      .select("*")
      .eq("username", body.username);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (users.length === 0) {
      console.error("Invalid credentials. User not found.");
      return {
        result: false,
        message: "Invalid credentials",
      };
    }

    const user = users[0];

    const token = jwt.sign({ userId: user.idu, username: user.username }, "yourSecretKey", { expiresIn: "1h" });

    console.log("Login successful. Returning token and user data.");
    return {
      result: true,
      message: "Login successful",
      token: token,
      user: {
        idu: user.idu,
        username: user.username,
      },
    };
  } catch (error) {
    console.error("Error in login function:", error);
    throw ApiError.badRequest("Login failed");
  }
};*/
// userService.js

const login = async (body) => {
  if (!body || !body.username || !body.password) {
    console.error("Invalid request. Username or password is missing.");
    throw ApiError.badRequest("Invalid request. Username or password is missing.");
  }

  try {
    const { data: users, error } = await supabase
      .from("user")
      .select("*")
      .eq("username", body.username);

    if (error) {
      throw error;
    }

    if (users.length === 0) {
      throw ApiError.badRequest("Invalid credentials");
    }

    const user = users[0];

    // Vérifiez si la propriété hashedPassword existe dans l'objet user
    if (!user.hashedPassword) {
      throw ApiError.badRequest("Invalid user data. Hashed password not found.");
    }

    const passwordMatch = await bcrypt.compare(body.password, user.hashedPassword);

    if (!passwordMatch) {
      throw ApiError.badRequest("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.idu, username: user.username }, "yourSecretKey", { expiresIn: "1h" });

    return {
      result: true,
      message: "Login successful",
      token: token,
      user: {
        idu: user.idu,
        username: user.username,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    throw ApiError.badRequest("Login failed");
  }
};

module.exports = {
  login,
};


module.exports = {
  create,
  get,
  getone,
  update,
  deleteRecord,
  login
};
