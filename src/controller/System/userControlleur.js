const userService = require("../../service/System/userService");
const { formatSuccessResponse, formatErrorResponse } = require("../../helpers/formatResponse");
const { generateAccessToken } = require("../../helpers/jwt");
const tryCatchWrapper = require("../../helpers/tryCatchWrapper");
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
const login = async (body) => {
  try {
    if (!body || !body.username || !body.password) {
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
      throw error;
    }

    if (users.length === 0) {
      return {
        result: false,
        message: "Invalid credentials",
      };
    }

    const user = users[0];

    // Assurez-vous que body.password n'est pas vide
    if (!body.password) {
      return {
        result: false,
        message: "Invalid request. Password is missing.",
      };
    }

    const passwordMatch = await bcrypt.compare(body.password, user.hashedPassword);

    if (!passwordMatch) {
      return {
        result: false,
        message: "Invalid credentials",
      };
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
  create,
  get,
  getone,
  update,
  deleteRecord,
  login
};
