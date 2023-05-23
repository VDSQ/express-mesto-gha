const router = require("express").Router();
const signInRouter = require("./signin");
const signUpRouter = require("./signup");
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const auth = require("../middlewares/auth");
const { requestLogger, errorLogger } = require("../middlewares/logger");
const cors = require("../middlewares/cors");
const NotFoundError = require("../errors/NotFoundError");

router.use(requestLogger);
router.use(cors);
router.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт.");
  }, 0);
});
router.use("/signin", signInRouter);
router.use("/signup", signUpRouter);
router.use(auth);
router.use("/users", usersRouter);
router.use("/cards", cardsRouter);
router.use((req, res, next) => {
  next(new NotFoundError("Такая страница не существует."));
});
router.use(errorLogger);

module.exports = router;
