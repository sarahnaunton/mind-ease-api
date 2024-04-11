const usersData = require("../seed_data/usersData");
const journalsData = require("../seed_data/journalsData");
const scoresData = require("../seed_data/scoresData");
const activitiesData = require("../seed_data/activitiesData")
const recommendationsData = require("../seed_data/recommendationsData");

exports.seed = async function(knex) {
  await knex("users").del()
  await knex("users").insert(usersData);
  await knex("journals").del()
  await knex("journals").insert(journalsData);
  await knex("scores").del()
  await knex("scores").insert(scoresData);
  await knex("activities").del()
  await knex("activities").insert(activitiesData);
  await knex("recommendations").del()
  await knex("recommendations").insert(recommendationsData);
};
