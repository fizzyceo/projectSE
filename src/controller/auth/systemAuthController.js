const systemAuthService = require("../../service/auth/authService");
const { generateAccessToken } = require("../../helpers/jwt");
const tryCatchWrapper = require("../../helpers/tryCatchWrapper");
const _ = require("lodash");
const { formatSuccessResponse } = require("../../helpers/formatResponse");

const login = tryCatchWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await systemAuthService.login({ email, password });
  result.accessToken = generateAccessToken(result.data); //add additional infos
  return res.status(200).json(formatSuccessResponse(result, req));
});

const verifyOtp = tryCatchWrapper(async (req, res, next) => {
  const { email, otp } = req.body;
  const result = await systemAuthService.verifyOtp({ email, otp });
  result.accessToken = generateAccessToken(result.data);
  return res.status(200).json(formatSuccessResponse(result, req));
});

const resendOtp = tryCatchWrapper(async (req, res, next) => {
  const { email } = req.body;
  const result = await systemAuthService.resendOtp({ email });
  result.accessToken = generateAccessToken(result.data);
  return res.status(200).json(result);
});

const resetPassword = tryCatchWrapper(async (req, res, next) => {
  const { password } = req.body;
  const result = await systemAuthService.resetPassword(password, req.user.id);
  return res.status(200).json(formatSuccessResponse(result, req));
});
const forgetPassword = tryCatchWrapper(async (req, res, next) => {
  const result = await systemAuthService.forgetPassword(req.body);
  return res.status(200).json(formatSuccessResponse(result, req));
});

module.exports = {
  login,
  verifyOtp,
  resendOtp,
  resetPassword,
  forgetPassword,
};
