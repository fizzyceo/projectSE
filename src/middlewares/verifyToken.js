const jwt = require("jsonwebtoken");
const ApiError = require("../error/api-error");
const nextError = require("../helpers/errorTypeFunction");

function verifyToken(req, res, next) {
  try {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) throw ApiError.unAuthorized("unauthorized");
    const [_, bearerToken] = bearerHeader.split(" ");
    jwt.verify(
      bearerToken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      function (err, decoded) {
        if (err) throw ApiError.unAuthorized("unauthorized");
        req.user = decoded;
      }
    );

    next();
  } catch (error) {
    nextError(error);
  }
}
async function ioVerifyToken(socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      function (err, decoded) {
        if (err) {
          socket.authorized = false;
          next();
        }
        socket.user = decoded;
        socket.authorized = true;
        next();
      }
    );
  } else {
    socket.authorized = false;
    next();
  }
}

module.exports = {
  verifyToken,
  ioVerifyToken,
};
