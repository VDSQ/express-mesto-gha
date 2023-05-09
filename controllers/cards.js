const http2 = require("http2");
const mongoose = require("mongoose");
const Card = require("../models/card");

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;
const BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST;
const FORBIDDEN = http2.constants.HTTP_STATUS_FORBIDDEN;
const NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send(card))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании карточки.",
        });
      }

      return next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else if (card.owner.toString() !== userId) {
        res.status(FORBIDDEN).send({
          message: "Вы не можете удалить карточку другого пользователя.",
        });
      } else {
        card
          .deleteOne()
          .then(() => res.status(OK).send({ message: "Карточка успешно удалена." }))
          .catch(next);
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при удалении карточки.",
        });
      }

      return next(error);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при поставки лайка.",
        });
      }

      return next(error);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: "Карточка с указанным _id не найдена." });
      } else {
        res.status(OK).send(card);
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).send({
          message: "Переданы некорректные данные при снятии лайка.",
        });
      }

      return next(error);
    });
};
