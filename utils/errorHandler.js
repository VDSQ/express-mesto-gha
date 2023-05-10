const http2 = require("http2");
const { ValidationError, CastError } = require("mongoose").Error;
const BaseError = require("../errors/BaseError");

const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const CONFLICT = http2.constants.HTTP_STATUS_CONFLICT;
const INTERNAL_SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
const DUPLICATE_KEY_CODE = 11000;

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof BaseError) {
    res.status(err.statusCode).send({ message: err.message });
  } else if (err instanceof ValidationError) {
    res.status(BAD_REQUEST).send({ message: "Переданы некорректные данные." });
  } else if (err instanceof CastError) {
    res
      .status(BAD_REQUEST)
      .send({ message: "Запрашиваемые данные не найдены." });
  } else if (err.code === DUPLICATE_KEY_CODE) {
    res
      .status(CONFLICT)
      .send({ message: "Указанный email уже зарегистрирован." });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: "Ошибка сервера." });
  }
}

module.exports = errorHandler;
