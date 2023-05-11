const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

const { JWT_SECRET = "some-secret-key" } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError("Необходима авторизация."));
  }

  return jwt.verify(
    token,
    JWT_SECRET,
    (error, payload) => {
      if (error) {
        return next(new UnauthorizedError("Необходима авторизация."));
      }

      req.user = payload;
      return next();
    },
  );
};
