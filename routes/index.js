const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

// GET Homepage
router.get("/", indexController.getIndex);

// GET About
router.get("/about", indexController.getAbout);

// GET Signup
router.get("/signup", indexController.getSignup);

// POST Signup
router.post("/signup", indexController.postSignup);

// GET Login
router.get("/login", indexController.getLogin);

// POST Login
router.post("/login", indexController.postLogin);

// GET Logout
router.get("/logout", indexController.getLogout);

// GET Membership
router.get("/membership", indexController.getMembership);

// POST Login
router.post("/membership", indexController.postMembership);

// POST New Post
router.post("/newpost", indexController.postNewpost);

//DELETE Post
router.get("/delete/:id", indexController.deletePost);

module.exports = router;
