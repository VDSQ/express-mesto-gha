/* eslint-disable import/no-unresolved */
const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../errors/UnauthorizedError");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError("Необходима авторизация."));
  } else {
    jwt.verify(token, "some-secret-key", (error, payload) => {
      if (error) {
        next(error);
      }

      req.user = payload;
      next();
    });
  }
};
