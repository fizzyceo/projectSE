
const { Joi } = require('express-validation')

const loginDto = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}

const verifyOtpDto = {
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().min(5).required(),
  }),
}

const resetPasswordDto = {
  body: Joi.object({
    password: Joi.string().min(8).required(),
  }),
}
const resendOtpDto = {
  body: Joi.object({
    pa: Joi.string().email().required(),
  }),
}

const forgetPasswordDto = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
}
module.exports = {
  loginDto,
  verifyOtpDto,
  resendOtpDto,
  resetPasswordDto,
  forgetPasswordDto
}
