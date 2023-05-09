const router = require("express").Router();
const usersRouter = require("./users");
const cardsRouter = require("./cards");

router.use((err, req, res, next) => {
  const { statusCode, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка." : message,
  });

  next();
});
router.use("/users", usersRouter);
router.use("/cards", cardsRouter);
router.use((req, res, next) => {
  res.status(404).send({ message: "Такая страница не существует." });

  next();
});

module.exports = router;
