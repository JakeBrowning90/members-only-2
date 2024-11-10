require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcryptjs");

//Routers
const indexRouter = require("./routes/index");
// const userRouter = require("./routes/user");
// const postRouter = require("./routes/post");

const app = express();
const path = require("node:path");

app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);
// app.use("/user", userRouter);
// app.use("/post", postRouter);

app.get("*", function (req, res) {
  res.render("404", { title: "Error 404" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});