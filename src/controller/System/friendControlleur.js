const freindService = require("../../service/System/friendService");
const tryCatchWrapper = require("../../helpers/tryCatchWrapper");
const _ = require("lodash");
const { formatSuccessResponse } = require("../../helpers/formatResponse");

const create = tryCatchWrapper(async (req, res, next) => {
  const body = req.body;
  const result = await freindService.create(body);
  return res.status(200).json(formatSuccessResponse(result, req));
});
/*const update = tryCatchWrapper(async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const result = await freindService.update(body, id);
  return res.status(200).json(formatSuccessResponse(result, req));
});*/
const get = tryCatchWrapper(async (req, res, next) => {
  const body = req.body;
  const result = await freindService.get(body);
  return res.status(200).json(formatSuccessResponse(result, req));
});
const getone = tryCatchWrapper(async (req, res, next) => {
  const id = req.params.id;

  const result = await freindService.getone(id);
  return res.status(200).json(formatSuccessResponse(result, req));
});
const deleteRecord = tryCatchWrapper(async (req, res, next) => {
  const id = req.params.id;

  const result = await freindService.deleteRecord(id);
  return res.status(200).json(formatSuccessResponse(result, req));
});
module.exports = {
  create,
  get,
  getone,
  //update,
  deleteRecord,
};
