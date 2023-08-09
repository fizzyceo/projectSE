const nextError = require('../helpers/errorTypeFunction');
const bcrypt = require('bcryptjs');
const { getUniqueId } = require('../helpers/getUniqueId');
const MailService = require('./sendMailService/sendMail')
const _ = require('lodash');
const ApiError = require('../error/api-error');
const { db } = require('../models');

// firstName, lastName, email, password, phoneOne, phoneTwo, roles, clientId, venuesIds, profileImage
const createSystemUsers = async (body) => {
    try {
        let user = await db.User.findOne({ email: body.email });
        if (user && user.isDeleted) {
            user.isVerified = false;
        }
        if (user && user.tempPassword)
            user.isVerified = false;
        
        if (user && user.isVerified) {
            throw ApiError.badRequest('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);
        const uniqueCode = await getUniqueId(db.User);
        let data = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: hashedPassword,
            phoneOne: body.phoneOne || "",
            phoneTwo: body.phoneTwo || "",
            isDeleted: false,
            isVerified: true,
            status: "Pending",
            tempPassword: true,
            about:body.about ||"",
            roles: body.roles,
            ...(body.clientId && {
                clientId: body.clientId
            }),
            ...(body.permissions && {
                permissions: body.permissions
            }),
            ...(body.profileImage && {
                profileImage: body.profileImage
            }),
            code: uniqueCode
        }
        if (user && !user.isVerified) {
            user = await db.User.findOneAndUpdate({ email: body.email }, { $set: { ...data } }, { new: true });
        }
        else {
            const newUser = new db.User({ ...data });
            user = await newUser.save();
        }

        //send mail with 5 digit otp
        if (user)
            MailService.sendMail(user.email, body.password, "create-systemUser");

        let userData = { ...user._doc, id: user._doc._id }
        return userData;
    } catch (error) {
        nextError(error);
    }
};


module.exports = {
    createSystemUsers
    
}