const mongoose = require("mongoose");
const config = require("../config");
const dotenv = require("dotenv");
dotenv.config();
const userSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String, required: true },
        phoneOne: {
            type: String,
            required: true,
        },
        phoneTwo: {
            type: String,
            required: true,
        },
        otp: {
            type: Object,
            default: {
                code: null,
                isVerified: false,
                expiresAt: null,
            }
        },
        roles: {
            type: [
                {
                    type: String,
                    enum: ['user','superAdmin']
                }
            ], default: ["user"]
        },
        profileImage: {
            type: {
                small: String,
                normal: String
            }
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        udf1: {
            type: String,
            default: null
        },
        about: {
            type: String,
            default: null
        },
        tempPassword: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: 'Active',
            enum: ['Active', 'Suspended', 'Pending']
        },
        permissions: {
            type: [
                {
                    type: String,
                }
            ],
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true },
);

userSchema.statics.get = async function (body) {
    const page = (body.page || 1) - 1;
    const limit = body.limit || 10;
    const skip = page * limit;
    const sort = [[body.sortField || "createdAt", body.sortDirection || "desc"]];
    let options = {
        code: 1,
        email: 1,
        firstName: 1,
        lastName: 1,
        phoneOne: 1,
        phoneTwo: 1,
        roles: 1,
        status: 1,
        permissions: 1,
        about:1,
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1,
    }
    const users = await this.find({
        ...(body.email &&
            { email: body.email }),
        ...(body.roles &&
            { roles: { $all: body.roles, $size: 1 } }),
        isDeleted: { $ne: true },
        ...(body.search && {
            $or: [
                { code: { $regex: body.search, $options: 'i' } },
                { email: { $regex: body.search, $options: 'i' } },
                { firstName: { $regex: body.search, $options: 'i' } },
                { lastName: { $regex: body.search, $options: 'i' } },
            ]
        }),
        ...(body.status && { status: body.status }),
        ...(body.dateFrom &&
            body.dateTo && {
            createdAt: { $gte: body.dateFrom, $lte: body.dateTo }
        }),
        ...(body.phoneOne &&
            { phoneOne: body.phoneOne }),
        ...(body.phoneTwo &&
            { phoneTwo: body.phoneTwo }),
    }, options).sort(sort)
        .skip(skip)
        .limit(limit).lean();
    return users;
};

module.exports = mongoose.model("User", userSchema);



const createAdmin = async () => {

    //on production 

    if (false) {
        // create Super admin
        const superAdmin = await mongoose.model("User", userSchema).findOne({ roles: { $all: ["superAdmin"], $size: 1 } });
        const bcrypt = require('bcryptjs');
        if (!superAdmin) {

            const salt = await bcrypt.genSalt(10);
            let password = "123456789"
            const hashedPassword = await bcrypt.hash(password, salt);
            const superAdmin = await mongoose.model("User", userSchema).create({
                code: "1111111",
                email: "admin@admin.com",
                firstName: "admin",
                lastName: "admin",
                phoneOne: "111111111",
                phoneTwo: "111111111",
                password: hashedPassword,
                roles: [
                    "superAdmin"
                ],
                isVerified: false,
                tempPassword: true,
                status: "Active",
                isDeleted: false,
                createdAt: "2023-03-12T23:55:01.589Z",
                permissions: ['create', 'update', 'delete'],
                about:"admin",
                isVerified: true
            })
        }

    }


}

createAdmin()