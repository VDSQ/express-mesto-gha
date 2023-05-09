const Card = require("../models/card");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        return res.status(400).send({
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
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена." });
      }
      if (card.owner.toString() !== userId) {
        res.status(403).send({
          message: "Вы не можете удалить карточку другого пользователя.",
        });
      }

      Card.findByIdAndRemove(cardId).then(() => res.status(200).send({ message: "Карточка успешно удалена." }));
    })
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        return res.status(400).send({
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
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена." });
      }

      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === "CastError" || error.name === "ValidationError") {
        return res.status(400).send({
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
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена." });
      }

      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при снятии лайка.",
        });
      }

      return next(error);
    });
};
