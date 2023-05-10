const http2 = require("http2");
const mongoose = require("mongoose");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");

const OK = http2.constants.HTTP_STATUS_OK;

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
        next(new NotFoundError("Пользователь по указанному _id не найден."));
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new BadRequestError("Переданы некорректные данные при получении профиля."));
      } else {
        next(error);
      }
    });
};

function updateUser(req, res, next) {
  const message = `Переданы некорректные данные при обновлении ${
    req.originalUrl.includes("avatar") ? "аватара" : "профиля"
  }.`;

  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        next(new NotFoundError("Пользователь по указанному _id не найден."));
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(message));
      } else {
        next(error);
      }
    });
}

module.exports.updateProfile = (req, res, next) => {
  updateUser(req, res, next);
};

module.exports.updateAvatar = (req, res, next) => {
  updateUser(req, res, next);
};
