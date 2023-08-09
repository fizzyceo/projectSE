const { formatErrorResponse } = require("../helpers/formatResponse");
const { logger } = require("../Logger");
// const { mapLanguage } = require('../helpers/mapLanguage')
function apiErrorHandler(err, req, res, next) {
  logger.error(JSON.stringify(err));
  console.log(err);
  //handle language based on request header
  const lang = req.get("Accept-Language") || req.get("accept-language") || "en"

  const error = {
    statusCode: err.code || err.statusCode || 500,
    message: err.message || 'Something went wrong',
  };
  return res.status(error.statusCode).json(formatErrorResponse(error.message, err?.details || []));
}

module.exports = apiErrorHandler;
