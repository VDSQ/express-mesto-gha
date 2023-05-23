require("dotenv").config();
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

const { NODE_ENV = "development", JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError("Необходима авторизация."));
  }

  return jwt.verify(
    token,
    NODE_ENV === "production" ? JWT_SECRET : "some-secret-key",
    (error, payload) => {
      if (error) {
        return next(new UnauthorizedError("Необходима авторизация."));
      }

      req.user = payload;
      return next();
    },
  );
};
