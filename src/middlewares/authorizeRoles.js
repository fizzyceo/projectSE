const ApiError = require("../error/api-error");
const nextError = require("../helpers/errorTypeFunction");
const { db } = require("../models");

const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const systemUser = await db.SystemUser.findById(req.user.id, {
        roles: 1,
        _id: 0
      });
      const user = await db.User.findById(req.user.id, {
        roles: 1,
        _id: 0
      });
      let isExist = user || systemUser
      if (!isExist) {
        throw ApiError.forbidden('Permission denied')
      } 
      const isAuthorized = roles.some(role => user?.roles.includes(role) || systemUser?.roles.includes(role));
      if (isAuthorized)
        return next();
      else
        throw ApiError.forbidden('Permission denied')
    } catch (error) {
      next(ApiError.forbidden(error.message))
    }
  }
}
module.exports = authorizeRoles;
