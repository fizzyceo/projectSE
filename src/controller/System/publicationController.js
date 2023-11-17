const publicationService = require("../../service/System/publicationService");
const { generateAccessToken } = require("../../helpers/jwt");
const tryCatchWrapper = require("../../helpers/tryCatchWrapper");
const _ = require("lodash");
const { formatSuccessResponse } = require("../../helpers/formatResponse");

const create = tryCatchWrapper(async (req, res, next) => {
  const body = req.body;
  const result = await publicationService.create(body);
  result.accessToken = generateAccessToken(result.data); //add additional infos
  return res.status(200).json(formatSuccessResponse(result, req));
});
module.exports = {
  create,
};
