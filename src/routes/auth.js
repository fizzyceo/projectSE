const express = require("express");
const systemAuthController = require("../controller/auth/systemAuthController");
const router = express.Router();

router.post("/system/login", systemAuthController.login);
router.post("/system/verify-otp", systemAuthController.verifyOtp);
router.post("/system/resend-otp", systemAuthController.resendOtp);
router.put("/system/reset-password", systemAuthController.resetPassword);
router.post("/system/forget-password", systemAuthController.forgetPassword);

module.exports = router;
