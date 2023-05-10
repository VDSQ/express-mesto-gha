const router = require("express").Router();
const signInRouter = require("./signin");
const signUpRouter = require("./signup");
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const auth = require("../middlewares/auth");
const NotFoundError = require("../errors/NotFoundError");

router.use("/signin", signInRouter);
router.use("/signup", signUpRouter);
router.use(auth);
router.use("/users", usersRouter);
router.use("/cards", cardsRouter);
router.use((req, res, next) => {
  next(new NotFoundError("Такая страница не существует."));
});

module.exports = router;
