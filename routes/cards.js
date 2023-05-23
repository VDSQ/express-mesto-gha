const cardRoutes = require("express").Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");
const {
  validateCard,
  validateCardId,
} = require("../middlewares/validator");

cardRoutes.get("/", getCards);
cardRoutes.post("/", validateCard, createCard);
cardRoutes.delete("/:cardId", validateCardId, deleteCard);
cardRoutes.put("/likes/:cardId", validateCardId, likeCard);
cardRoutes.delete("/likes/:cardId", validateCardId, dislikeCard);

module.exports = cardRoutes;
