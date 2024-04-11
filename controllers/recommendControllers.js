const knex = require("knex")(require("../knexfile"));

const getRecommendation = async (req, res) => {
  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const recommendation = await knex("recommendations")
      .join("users", "recommendations.users_id", "users.id")
      .where({ "users.id": userId })
      .select(
        "recommendations.id",
        "recommendations.recommendation",
        "recommendations.updated_at"
      );

    res.status(200).json(recommendation);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Could not get recommendation, please try again" });
  }
};

const postRecommendation = async (req, res) => {
  const { recommendation } = req.body;

  if (!recommendation) {
    return res.status(400).json({ error: "Please enter the required field" });
  }

  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const newRecommendationId = await knex("recommendations")
      .where({ "users.id": userId })
      .insert({
        recommendation,
        users_id: userId,
      });
    const newRecommendation = await knex("recommendations")
      .where({ "recommendations.id": newRecommendationId[0] })
      .first();
    res.status(201).json(newRecommendation);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Could not post recommendation, please try again" });
  }
};

const editRecommendation = async (req, res) => {
  const { recommendation } = req.body;
  const recommendationId = req.params.id;

  if (!recommendation) {
    return res.status(400).json({ error: "Please enter the required field" });
  }

  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const recommendation = await knex("recommendations").where({
      id: recommendationId,
    });

    if (!recommendation.length) {
      return res
        .status(404)
        .json({ error: `No recommendation found with id: ${journalId}` });
    }

    await knex("recommendations")
      .where({ id: recommendationId })
      .update(req.body);

    const updatedRecommendation = await knex("recommendations")
      .where({ id: recommendationId })
      .first();
    res.status(200).json(updatedRecommendation);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Could not edit recommendation, please try again" });
  }
};

module.exports = {
  getRecommendation,
  postRecommendation,
  editRecommendation,
};
