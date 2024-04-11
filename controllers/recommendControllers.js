const knex = require("knex")(require("../knexfile"));

const getRecommendation = async(req, res) => {
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

module.exports = {
  getRecommendation,
};
