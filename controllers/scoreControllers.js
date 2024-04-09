const knex = require("knex")(require("../knexfile"));

const postScores = async (req, res) => {
  const { score, category } = req.body;

  if (!score || !category) {
    return res.status(400).json({
      error: "Please ensure both the score and category are provided",
    });
  }

  const parseScore = parseInt(score);

  if (!Number.isInteger(parseScore)) {
    return res.status(400).json({ error: "The score must be a number" });
  }

  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const newScoreId = await knex("scores")
      .where({ "users.id": userId })
      .insert({
        score,
        category,
        users_id: userId,
      });
    const newScore = await knex("scores")
      .where({ "scores.id": newScoreId[0] })
      .first();
    res.status(201).json(newScore);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Could not post score and category: ${error.message}` });
  }
};

const getScores = async (req, res) => {
  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const scores = await knex("scores")
      .join("users", "scores.users_id", "users.id")
      .where({ "users.id": userId })
      .select(
        "scores.id",
        "scores.score",
        "scores.category",
        "scores.created_at"
      );

    res.status(200).json(scores);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Could not get scores: ${error.message}` });
  }
};

module.exports = {
  postScores,
  getScores,
};
