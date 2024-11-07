const asyncHandler = require("express-async-handler");

exports.getIndex = asyncHandler(async (req, res) => {
  res.render("index");
});

exports.getSignup = asyncHandler(async (req, res) => {
  res.render("signup");
});

exports.postSignup = asyncHandler(async (req, res) => {
  res.render("index");
});

exports.getLogin = asyncHandler(async (req, res) => {
  res.render("login");
});

exports.postLogin = asyncHandler(async (req, res) => {
  res.render("index");
});

exports.getLogout = asyncHandler(async (req, res) => {
  res.render("index");
});

exports.getMembership = asyncHandler(async (req, res) => {
  res.render("membership");
});

exports.postMembership = asyncHandler(async (req, res) => {
  res.render("index");
});