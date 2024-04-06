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
  .get(authorise, journalControllers.getJournal)
  .delete(authorise, journalControllers.deleteJournal)
  .patch(authorise, journalControllers.editJournal);

module.exports = router;
