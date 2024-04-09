const express = require("express");
const router = express.Router();
const activityControllers = require("../controllers/activityControllers");
const authorise = require("../middleware/auth");

router
  .route("/")
  .get(authorise, activityControllers.getActivities)
  .post(authorise, activityControllers.postActivity);

router
  .route("/:id")
  .get(authorise, activityControllers.getActivity)
  .delete(authorise, activityControllers.deleteActivity)
  .put(authorise, activityControllers.editActivity);

module.exports = router;
