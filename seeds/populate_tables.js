const usersData = require("../seed_data/usersData");
const journalsData = require("../seed_data/JournalsData");

exports.seed = async function(knex) {
  await knex("users").del()
  await knex("users").insert(usersData);
  await knex("journals").del()
  await knex("journals").insert(journalsData);

};
