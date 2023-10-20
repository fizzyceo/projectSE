const regionForecast = require("../../service/systemManagement/regionForecast");
const tryCatchWrapper = require("../../helpers/tryCatchWrapper");
const { formatSuccessResponse } = require("../../helpers/formatResponse");

//#region staffManagement

const createRegionForecast = tryCatchWrapper(async (req, res, next) => {
  const data = req.body;
  const result = await regionForecast.create( data);
  return res.status(201).json(formatSuccessResponse(result, req));
});


const getRegionForecasts = tryCatchWrapper(async (req, res, next) => {
  const result = await regionForecast.get(req.body);
  return res.status(200).json(formatSuccessResponse(result, req));
});

const getRegionForecast = tryCatchWrapper(async (req, res, next) => {
  const result = await regionForecast.getOne(req.params.id);
  return res.status(200).json(formatSuccessResponse(result, req));
});

const deleteRegionForecast = tryCatchWrapper(async (req, res, next) => {
  const result = await regionForecast.deleteRegionForecast(req.user.id, req.params.id);
  return res.status(200).json(formatSuccessResponse(result, req));
});

//#endregionForecast staffManagement

module.exports = {
  createRegionForecast,
  getRegionForecasts,

  getRegionForecast,
  deleteRegionForecast,
  
};
