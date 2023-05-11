const { ValidationError, CastError } = require("mongoose").Error;
const {
  BAD_REQUEST,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  DUPLICATE_KEY_CODE,
} = require("./statusCode");
const BaseError = require("../errors/BaseError");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof ValidationError) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Переданы некорректные данные." });
  }

  if (err instanceof CastError) {
    return res.status(BAD_REQUEST).send({ message: "Передан невалидный id." });
  }

  if (err.code === DUPLICATE_KEY_CODE) {
    return res
      .status(CONFLICT)
      .send({ message: "Указанный email уже зарегистрирован." });
  }

  return res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка сервера." });
}

module.exports = errorHandler;
