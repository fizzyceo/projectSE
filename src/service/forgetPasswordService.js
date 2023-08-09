const MailService = require("../sendMailService/sendMail");
const bcrypt = require('bcryptjs');
const User = require("../../models/users");
const dotenv = require('dotenv');
const nextError = require('../../helpers/errorTypeFunction');
const ApiError = require("../../error/api-error.js");
dotenv.config();
const { db } = require('../models');

const forgetPassword = async (email) => {
    try {
        let user = await db.User.findOne({ email });
        if (!user) {
            throw ApiError.badRequest('User does not exist');
        }
        const otp = Math.floor(10000 + Math.random() * 9000)
        if (user) {
            user = await db.User.findOneAndUpdate({ email }, {
                $set: {
                    otp: {
                        code: otp,
                        expiresAt: Date.now() + 4 * 60 * 1000,
                    }
                },
            }, { new: true });
        }
        //send mail with 5 digit otp
        await MailService.sendMail(user.email, user.otp.code, "OTP");
        return {
            result: true,
            message: 'OTP sent successfully',
        };
    } catch (error) {
        nextError(error);
    }

}

const resetPassword = async (id, password,otp) => {
    try {
        //check if user exist in database
        const user = await db.User.findById(id);
        if (!user) {
            throw ApiError.badRequest('User does not exist');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        return { result: true, message: 'Password has been updated' };

    } catch (error) {
        nextError(error);
    }
}

module.exports = {
    forgetPassword,
    resetPassword
}