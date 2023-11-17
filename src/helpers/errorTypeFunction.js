
const ApiError = require("../error/api-error.js");

const nexError = (error) => {
    if (error instanceof ApiError) {
        throw ApiError.badRequest(error.message);;
    }
    throw ApiError.internal(error.message);
}

module.exports = nexError
