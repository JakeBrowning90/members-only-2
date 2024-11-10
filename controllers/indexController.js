const { validationResult } = require("express-validator");
const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const validateUserForm = require("../middleware/validateUserForm");
const validatePostForm = require("../middleware/validatePostForm");

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

exports.getIndex = asyncHandler(async (req, res) => {
  const posts = await db.getAllPosts();
  res.render("index", { title: "Homepage", posts: posts });
});

exports.getAbout = asyncHandler(async (req, res) => {
  const posts = await db.getAllPosts();
  res.render("about", { title: "About" });
});

exports.getSignup = asyncHandler(async (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("signup", { title: "Sign Up" });
  }
});

exports.postSignup = [
  validateUserForm,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    // If errors, rerender form and display errors
    if (!errors.isEmpty()) {
      res.render("signup", {
        title: "Sign Up",
        errors: errors.array(),
        fields: req.body,
      });
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
    res.render("login", { title: "Log In" });
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
    res.render("membership", { title: "Membership" });
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
      title: "Membership",
      error: "Incorrect password.",
    });
  }
});

exports.postNewpost = [
  validatePostForm,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const posts = await db.getAllPosts();
      res.render("index", {
        title: "Homepage",
        errors: errors.array(),
        fields: req.body,
        posts: posts,
      });
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
