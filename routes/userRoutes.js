const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const authorise = require("../middleware/auth");

router.route("/").get(authorise, userControllers.getUser);
router.route("/register").post(userControllers.registerUser);
router.route("/login").post(userControllers.loginUser);

module.exports = router;
