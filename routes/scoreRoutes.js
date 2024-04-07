const express = require("express");
const router = express.Router();
const scoresControllers = require("../controllers/scoreControllers");
const authorise = require("../middleware/auth");

router
  .route("/")
  .get(authorise, scoresControllers.getScores)
  .post(authorise, scoresControllers.postScores);

module.exports = router;
