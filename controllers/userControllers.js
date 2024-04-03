const knex = require("knex")(require("../knexfile"));
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please enter all the required fields" });
  }

  try {
    const user = await knex("users").where({ email: email }).first();

    if (!user) {
      return res.status(400).json({ error: "User could not be found" });
    }

    const passwordCorrect = bcrypt.compareSync(password, user.password);

    if (!passwordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { firstname: user.first_name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({token})
  } catch(error) {
    return res
      .status(500)
      .json({ message: `Could not log in user: ${error.message}` });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
