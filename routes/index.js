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

module.exports = router;
