const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");
const { ObjectId } = require("mongoose").Types;

module.exports.validateSignIn = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi
      .string()
      .email()
      .required(),
    password: Joi
      .string()
      .required(),
  }),
});

module.exports.validateSignUp = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }

        return helpers.message("Невалидный пароль.");
      })
      .message({
        "any.required": "Поле {#label} должно быть заполнено.",
      }),
    password: Joi
      .string()
      .required()
      .messages({
        "string.min": "Минимальная длина поля {#label} - 2.",
        "string.max": "Максимальная длина поля {#label} - 30.",
        "any.required": "Поле {#label} должно быть заполнено.",
      }),
    name: Joi
      .string()
      .min(2)
      .max(30)
      .messages({
        "string.min": "Минимальная длина поля {#label} - 2.",
        "string.max": "Максимальная длина поля {#label} - 30.",
      }),
    about: Joi
      .string()
      .min(2)
      .max(30)
      .messages({
        "string.min": "Минимальная длина поля {#label} - 2.",
        "string.max": "Максимальная длина поля {#label} - 30.",
      }),
    avatar: Joi
      .string()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }

        return helpers.message("Невалидная ссылка.");
      }),
  }),
});

module.exports.validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi
      .string()
      .length(24)
      .hex()
      .required()
      .messages({
        "any.required": "Невалидный {#label}.",
      }),
  }),
});

module.exports.validateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi
      .string()
      .required()
      .min(2)
      .max(30)
      .messages({
        "string.min": "Минимальная длина поля {#label} - 2.",
        "string.max": "Максимальная длина поля {#label} - 30.",
        "any.required": "Поле {#label} должно быть заполнено.",
      }),
    about: Joi
      .string()
      .required()
      .min(2)
      .max(30)
      .messages({
        "string.min": "Минимальная длина поля {#label} - 2.",
        "string.max": "Максимальная длина поля {#label} - 30.",
        "any.required": "Поле {#label} должно быть заполнено.",
      }),
  }),
});

module.exports.validateAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }

        return helpers.message("Невалидная ссылка.");
      }),
  }),
});

module.exports.validateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi
      .string()
      .required()
      .min(2)
      .max(30)
      .messages({
        "string.min": "Минимальная длина поля {#label} - 2.",
        "string.max": "Максимальная длина поля {#label} - 30.",
        "any.required": "Поле {#label} должно быть заполнено.",
      }),
    link: Joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }

        return helpers.message("Невалидная ссылка");
      }),
  }),
});

module.exports.validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi
      .string()
      .required()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }

        return helpers.message("Невалидный {#label}.");
      }),
  }),
});
