const http2 = require("http2");
const mongoose = require("mongoose");
const User = require("../models/user");

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;
const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден." });
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при получении профиля.",
        });
      }

      return next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.create({
    name,
    about,
    avatar,
    email,
    password,
  })
    .then((user) => res.status(CREATED).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }

      return next(error);
    });
};

function updateUser(req, res, next) {
  const userId = req.user._id;
  const message = `Переданы некорректные данные при обновлении ${
    req.originalUrl.includes("avatar") ? "аватара" : "профиля"
  }.`;

  User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: "Пользователь по указанному _id не найден." });
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message });
      }

      return next(error);
    });
}

module.exports.updateProfile = (req, res, next) => {
  updateUser(req, res, next);
};

module.exports.updateAvatar = (req, res, next) => {
  updateUser(req, res, next);
};
