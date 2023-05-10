const userRoutes = require("express").Router();
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");
const {
  validateUserId,
  validateProfile,
  validateAvatar,
} = require("../middlewares/validator");

userRoutes.get("/", getUsers);
userRoutes.get("/me", getCurrentUser);
userRoutes.get("/:userId", validateUserId, getUserById);
userRoutes.patch("/me", validateProfile, updateProfile);
userRoutes.patch("/me/avatar", validateAvatar, updateAvatar);

module.exports = userRoutes;
