const express = require("express");
const router = express.Router();
const activityControllers = require("../controllers/activityControllers");
const authorise = require("../middleware/auth");

router
  .route("/")
  .get(authorise, activityControllers.getActivities)

module.exports = router;
