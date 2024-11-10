const { body } = require("express-validator");
const db = require("../db/queries");

const validateUserForm = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Username must contain between 1 and 20 characters.")
    .custom(async (value) => {
      const existingUsername = await db.getUserByUsername(value);
      if (existingUsername) {
        throw new Error("Username already in use.");
      }
    }),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address format.")
    .isLength({ min: 1, max: 50 })
    .withMessage("Email must contain between 1 and 50 characters."),
  body("password")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage("Password must contain between 1 and 20 characters."),
  body("passwordConfirm")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Typed passwords do not match."),
];

module.exports = validateUserForm;
