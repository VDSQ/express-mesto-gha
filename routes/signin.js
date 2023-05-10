const signInRoutes = require("express").Router();
const { login } = require("../controllers/users");
const { validateSignIn } = require("../middlewares/validator");

signInRoutes.post("/", validateSignIn, login);

module.exports = signInRoutes;
