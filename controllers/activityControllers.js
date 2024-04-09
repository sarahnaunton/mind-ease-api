const knex = require("knex")(require("../knexfile"));

const getActivities = async(req, res) => {
    try {
        const userId = req.authToken.id;
        const user = await knex("users").where({ id: userId }).first();
    
        if (!user) {
          return res.status(404).json({ error: "User could not be found" });
        }
    
        const activities = await knex("activities")
          .join("users", "activities.users_id", "users.id")
          .where({ "users.id": userId })
          .select(
            "activities.id",
            "activities.activity",
            "activities.created_at"
          );
    
        res.status(200).json(activities);
      } catch (error) {
        return res
          .status(500)
          .json({ error: `Could not get activities: ${error.message}` });
      }
}

const postActivity = async(req, res) => {
    const { activity } = req.body;

  if (!activity) {
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

    const newActivityId = await knex("activities")
      .where({ "users.id": userId })
      .insert({
        activity,
        users_id: userId,
      });
    const newActivity = await knex("activities")
      .where({ "activities.id": newActivityId[0] })
      .first();
    res.status(201).json(newActivity);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Could not post activity: ${error.message}` });
  }
}


module.exports = {
    getActivities,
    postActivity
  };
  