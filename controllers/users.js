const User = require("../models/user");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден." });
      }

      console.log(1);

      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при получении профиля.",
        });
      }

      return next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      }

      return next(error);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден." });
      }

      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      }

      return next(error);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: "Пользователь по указанному _id не найден." });
      }

      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара.",
        });
      }

      return next(error);
    });
};
