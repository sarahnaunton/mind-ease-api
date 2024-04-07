const usersData = require("../seed_data/usersData");
const journalsData = require("../seed_data/journalsData");
const scoresData = require("../seed_data/scoresData");

exports.seed = async function(knex) {
  await knex("users").del()
  await knex("users").insert(usersData);
  await knex("journals").del()
  await knex("journals").insert(journalsData);
  await knex("scores").del()
  await knex("scores").insert(scoresData);
};
