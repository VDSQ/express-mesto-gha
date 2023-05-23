const Card = require("../models/card");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const {
  OK,
  CREATED,
} = require("../utils/statusCode");

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .sort({ createdAt: -1 })
    .then((cards) => res.status(OK).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError("Карточка с указанным _id не найдена."));
      }

      if (card.owner.toString() !== userId) {
        return next(new ForbiddenError("Вы не можете удалить карточку другого пользователя."));
      }

      return card
        .deleteOne()
        .then(() => res.status(OK).send({ message: "Карточка успешно удалена." }))
        .catch(next);
    })
    .catch(next);
};

function changeLikeCard(req, res, next, isLike) {
  const { cardId } = req.params;
  const userId = req.user._id;
  const query = isLike
    ? { $addToSet: { likes: userId } }
    : { $pull: { likes: userId } };

  Card.findByIdAndUpdate(cardId, query, { new: true })
    .then((card) => {
      if (!card) {
        return next(new NotFoundError("Карточка с указанным _id не найдена."));
      }

      return res.status(OK).send(card);
    })
    .catch(next);
}

module.exports.likeCard = (req, res, next) => {
  changeLikeCard(req, res, next, true);
};

module.exports.dislikeCard = (req, res, next) => {
  changeLikeCard(req, res, next, false);
};
