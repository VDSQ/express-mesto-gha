const signUpRoutes = require("express").Router();
const { createUser } = require("../controllers/users");
const { validateSignUp } = require("../middlewares/validator");

signUpRoutes.post("/", validateSignUp, createUser);

module.exports = signUpRoutes;
