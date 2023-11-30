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

const login = tryCatchWrapper(async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw ApiError.badRequest("Invalid request. Username or password is missing.");
    }

    console.log('Request body:', req.body);

    const result = await userService.login({ username, password });

    if (result.result) {
      const token = generateAccessToken(result.data);
      return res.status(200).json({ success: true, message: "Login successful", token });
    } else {
      const errorResponse = formatErrorResponse(result.message, {
        method: req.method,
        url: req.url,
        headers: req.headers,
        // Ajoutez d'autres informations pertinentes si nécessaire
      });

      return res.status(401).json(errorResponse);
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



module.exports = {
  create,
  get,
  getone,
  update,
  deleteRecord,
  login
};
