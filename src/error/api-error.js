class ApiError {
  constructor(code, message) {
    this.message = message;
    this.code = code;
  }

  static badRequest(msg = 'bad request') {
    return new ApiError(400, msg);
  }

  static notFound(msg = 'not found') {
    return new ApiError(404, msg);
  }

  static internal(msg = 'internal server error') {
    return new ApiError(500, msg);
  }

  static unAuthorized(msg = 'not authorized') {
    return new ApiError(401, msg);
  }

  static forbidden(msg = 'permission denied') {
    return new ApiError(403, msg);
  }
}

module.exports = ApiError;
