const mongoose = require("mongoose");
const pointSchema = require("./point");
const { getUniqueId } = require('../helpers/getUniqueId');
const moment = require('moment');
const ApiError = require("../error/api-error");

const alertSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },

        
        
        location: {
            type: pointSchema,
        },
        wilaya: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true
        },
    },
    { timestamps: true },
);
