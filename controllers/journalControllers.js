const knex = require("knex")(require("../knexfile"));

const getJournals = async (req, res) => {
  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const journals = await knex("journals")
      .join("users", "journals.users_id", "users.id")
      .where({ "users.id": userId })
      .select(
        "journals.id",
        "journals.entry",
        "journals.gratitude",
        "journals.created_at"
      );

    if (!journals.length) {
      return res.status(404).json("No journal entries found");
    }

    res.status(200).json(journals);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Could not get journal entries: ${error.message}` });
  }
};

const postJournal = async (req, res) => {
  const { entry, gratitude } = req.body;

  if (!entry || !gratitude) {
    return res
      .status(400)
      .json({ error: "Please enter all the required fields" });
  }

  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const newJournalId = await knex("journals")
      .where({ "users.id": userId })
      .insert({
        entry,
        gratitude,
        users_id: userId,
      });
    const newJournal = await knex("journals")
      .where({ "journals.id": newJournalId[0] })
      .first();
    res.status(201).json(newJournal);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Could not get journal entries: ${error.message}` });
  }
};

const getJournal = async (req, res) => {
  const journalId = req.params.id;

  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const journal = await knex("journals").where({ id: journalId });

    if (!journal.length) {
      return res
        .status(404)
        .json(`No journal entry found with id: ${journalId}`);
    }
    res.status(200).json(journal[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Could not get journal entries: ${error.message}` });
  }
};

const deleteJournal = async (req, res) => {
  const journalId = req.params.id;

  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const journal = await knex("journals").where({ id: journalId });

    if (!journal.length) {
      return res
        .status(404)
        .json(`No journal entry found with id: ${journalId}`);
    }
    await knex("journals").where({ id: journalId }).del();
    res.status(204).end();
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Could not get journal entries: ${error.message}` });
  }
};

const editJournal = async (req, res) => {
  const { entry, gratitude } = req.body;
  const journalId = req.params.id;

  if (!entry && !gratitude) {
    return res
      .status(400)
      .json({ error: "Please enter edit at least one of the required fields" });
  }

  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const journal = await knex("journals").where({ id: journalId });

    if (!journal.length) {
      return res
        .status(404)
        .json(`No journal entry found with id: ${journalId}`);
    }

    await knex("journals").where({ id: journalId }).update(req.body);

    const updatedJournal = await knex("journals")
      .where({ id: journalId })
      .first();
    res.status(200).json(updatedJournal);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Could not get journal entries: ${error.message}` });
  }
};

module.exports = {
  getJournals,
  postJournal,
  getJournal,
  deleteJournal,
  editJournal,
};
