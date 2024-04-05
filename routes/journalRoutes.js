const express = require("express");
const router = express.Router();
const journalControllers = require("../controllers/journalControllers");
const authorise = require("../middleware/auth");

router
  .route("/")
  .get(authorise, journalControllers.getJournals)
  .post(authorise, journalControllers.postJournal);

  router
  .route("/:id")
  .delete(authorise, journalControllers.deleteJournals);

module.exports = router;
