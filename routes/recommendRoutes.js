const express = require("express");
const router = express.Router();
const recommendControllers = require("../controllers/recommendControllers");
const authorise = require("../middleware/auth");

router
  .route("/")
  .get(authorise, recommendControllers.getRecommendation)

  router.route("/:id")
  .put(authorise, recommendControllers.editRecommendation);

module.exports = router;
