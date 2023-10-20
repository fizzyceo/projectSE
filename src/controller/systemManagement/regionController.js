const regionsService = require("../../service/systemManagement/regionsService");
const tryCatchWrapper = require("../../helpers/tryCatchWrapper");
const { formatSuccessResponse } = require("../../helpers/formatResponse");

//#region staffManagement

const createRegion = tryCatchWrapper(async (req, res, next) => {
  const data = req.body;
  const result = await regionsService.create( data);
  return res.status(201).json(formatSuccessResponse(result, req));
});
const createManyRegions = tryCatchWrapper(async (req, res, next) => {
  const data = req.body;
  const result = await regionsService.createMany( data);
  return res.status(201).json(formatSuccessResponse(result, req));
});

const getRegions = tryCatchWrapper(async (req, res, next) => {
  const result = await regionsService.get(req.body);
  return res.status(200).json(formatSuccessResponse(result, req));
});

const getRegion = tryCatchWrapper(async (req, res, next) => {
  const result = await regionsService.getOne(req.params.id);
  return res.status(200).json(formatSuccessResponse(result, req));
});

const deleteRegion = tryCatchWrapper(async (req, res, next) => {
  const result = await regionsService.deleteRegion(req.user.id, req.params.id);
  return res.status(200).json(formatSuccessResponse(result, req));
});

//#endregion staffManagement

module.exports = {
  createRegion,
  getRegions,
  createManyRegions,
  getRegion,
  deleteRegion,
  
};
