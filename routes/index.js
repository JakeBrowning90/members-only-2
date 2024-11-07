const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");

// GET Homepage
router.get("/", indexController.getIndex);

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

module.exports = router;
