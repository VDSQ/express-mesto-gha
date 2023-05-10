const http2 = require("http2");
// eslint-disable-next-line import/no-unresolved
const { errors } = require("celebrate");
const router = require("express").Router();
const signInRouter = require("./signin");
const signUpRouter = require("./signup");
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const auth = require("../middlewares/auth");
const NotFoundError = require("../errors/not-found");

const INTERNAL_SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

router.use("/signin", signInRouter);
router.use("/signup", signUpRouter);
router.use("/users", auth, usersRouter);
router.use("/cards", auth, cardsRouter);
router.use(errors());
router.use((req, res, next) => {
  next(new NotFoundError("Такая страница не существует."));

  next();
});
router.use((err, req, res, next) => {
  const { statusCode, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === INTERNAL_SERVER_ERROR
        ? "На сервере произошла ошибка."
        : message,
  });

  next();
});

module.exports = router;
