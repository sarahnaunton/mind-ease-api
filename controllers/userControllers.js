const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const {
    firstname: first_name,
    lastname: last_name,
    email,
    password,
  } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please enter all the required fields" });
  }

  const hashedPassword = bcrypt.hashSync(password, 6);

  try {
    const newUserId = await knex("users").insert({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    const newUser = await knex("users").where({ id: newUserId[0]}).first();
    res.status(201).json(newUser);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Could not create a new user: ${error.message}` });
  }
};

module.exports = {
  registerUser,
};
