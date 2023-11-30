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
  const { username, password } = req.body;

  const result = await userService.login(username, password);

  if (result.result) {  
    const token = generateAccessToken(result.data); 
    return res.status(200).json({ success: true, message: "Login successful", token });
  } 
else {
  console.log('result.message:', result.message);
  console.log('req:', req);
  return res.status(401).json(formatErrorResponse(result.message, req));
  
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
