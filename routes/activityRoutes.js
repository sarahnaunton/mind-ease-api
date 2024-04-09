const express = require("express");
const router = express.Router();
const activityControllers = require("../controllers/activityControllers");
const authorise = require("../middleware/auth");

router
  .route("/")
  .get(authorise, activityControllers.getActivities)
  .post(authorise, activityControllers.postActivity);

router.route("/:id").get(authorise, activityControllers.getActivity);

module.exports = router;
