const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

const validateForm = [
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

const validatePost = [
  body("postTitle")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must contain between 1 and 100 characters."),
  body("postBody")
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage("Body must contain between 1 and 300 characters."),
];

exports.getIndex = asyncHandler(async (req, res) => {
  const posts = await db.getAllPosts();
  console.log(posts);
  res.render("index", { posts: posts });
});

exports.getSignup = asyncHandler(async (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("signup");
  }
});

exports.postSignup = [
  validateForm,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    // If errors, rerender form and display errors
    if (!errors.isEmpty()) {
      res.render("signup", { errors: errors.array(), fields: req.body });
    } else {
      // If valid, insert user and redirect to login
      try {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) {
            res.redirect("/sign-up");
          } else {
            await db.insertUser(
              req.body.username,
              req.body.email,
              hashedPassword
            );
            res.redirect("/login");
          }
        });
      } catch (err) {
        return next(err);
      }
    }
  }),
];

exports.getLogin = asyncHandler(async (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("login");
  }
});

exports.postLogin = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "login",
  }),
];

exports.getLogout = asyncHandler(async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

exports.getMembership = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.redirect("/");
  } else {
    res.render("membership");
  }
});

exports.postMembership = asyncHandler(async (req, res) => {
  if (
    req.body.verifyPassword &&
    req.body.verifyPassword == process.env.VERIFY_PW
  ) {
    await db.updateUserToMember(req.user.id);
    res.redirect("/membership");
  } else if (
    req.body.adminPassword &&
    req.body.adminPassword == process.env.ADMIN_PW
  ) {
    await db.updateUserToAdmin(req.user.id);
    res.redirect("/membership");
  } else {
    res.render("membership", {
      error: "Incorrect password.",
    });
  }
});

exports.postNewpost = [
  validatePost,
  asyncHandler(async (req, res) => {
    console.log(req.body);
    // console.log(req.user);
    // console.log(req.user.id);
    console.log(Date.now());
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("index", { errors: errors.array(), fields: req.body });
    } else {
      // TODO: Insert post to table
      await db.insertPost(req.body, req.user);
      res.redirect("/");
    }
  }),
];

exports.deletePost = asyncHandler(async (req, res) => {
  await db.deletePost(req.params.id);
  res.redirect("/");
});
