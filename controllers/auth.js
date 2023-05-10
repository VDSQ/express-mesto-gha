const http2 = require("http2");
const mongoose = require("mongoose");
// eslint-disable-next-line import/no-unresolved
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request");
const UnauthorizedError = require("../errors/unauthorized");

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError("Неправильныая почта."));
      } else {
        user.comparePassword(password, (matchError, isMatch) => {
          if (matchError || !isMatch) {
            next(new UnauthorizedError("Неправильный пароль."));
          } else {
            const token = jwt.sign({ _id: user._id }, "some-secret-key", {
              expiresIn: "7d",
            });

            res
              .cookie("jwt", token, {
                maxAge: 60 * 60 * 24 * 30,
                httpOnly: true,
                sameSite: false,
                secure: true,
              })
              .status(OK)
              .send({ message: "Вы успешно авторизовались!" });
          }
        });
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  User.create(req.body)
    .then(() => res.status(CREATED).send({ message: "Вы успешно зарегистрировались!" }))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError("Переданы некорректные данные при создании пользователя."));
      } else if (error.code === 11000) {
        next(new BadRequestError("Данный email уже существует."));
      } else {
        next(error);
      }
    });
};
