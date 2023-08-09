const express = require("express");
const { validate } = require("express-validation");
const Dtos= require("../schema");
const systemAuthController = require("../controller/auth/systemAuthController");
const {verifyToken} = require('../middlewares/verifyToken')
const router = express.Router();

router.post("/system/login", validate(Dtos.loginDto), systemAuthController.login);
router.post("/system/verify-otp", validate(Dtos.verifyOtpDto), systemAuthController.verifyOtp);
router.post("/system/resend-otp", validate(Dtos.resendOtpDto), systemAuthController.resendOtp);
router.put("/system/reset-password", validate(Dtos.resetPasswordDto), verifyToken, systemAuthController.resetPassword);
router.post("/system/forget-password", validate(Dtos.forgetPasswordDto), systemAuthController.forgetPassword);



module.exports = router;
