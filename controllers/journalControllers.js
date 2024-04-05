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
      res.status(404).json("No journal entries found");
      return;
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
    const newJournal = await knex("journals").where({"journals.id": newJournalId[0] }).first();
    res.status(201).json(newJournal);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Could not get journal entries: ${error.message}` });
  }
};

module.exports = {
  getJournals,
  postJournal,
};
