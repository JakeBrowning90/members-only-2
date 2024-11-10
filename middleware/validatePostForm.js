const { body } = require("express-validator");

const validatePost = [
  body("postTitle")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must contain between 1 and 50 characters."),
  body("postBody")
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage("Body must contain between 1 and 300 characters."),
];

module.exports = validatePost;
