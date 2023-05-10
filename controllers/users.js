const http2 = require("http2");
// eslint-disable-next-line import/no-unresolved
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError("Неправильная почта."));
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
                sameSite: true,
                secure: false,
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
    .then((user) => res.status(CREATED).send(user))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError("Пользователь не найден."));
      } else {
        res.status(OK).send(user);
      }
    })
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
    .catch(next);
};

function updateUser(req, res, next) {
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
    .catch(next);
}

module.exports.updateProfile = (req, res, next) => {
  updateUser(req, res, next);
};

module.exports.updateAvatar = (req, res, next) => {
  updateUser(req, res, next);
};
