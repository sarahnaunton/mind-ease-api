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

  emailValidation = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

  if (!emailValidation.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const hashedPassword = bcrypt.hashSync(password, 6);

  try {
    const existingUser = await knex("users").where({ email: email }).first();
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "This email is already assocaited with an account" });
    }

    const newUserId = await knex("users").insert({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    const newUser = await knex("users").where({ id: newUserId[0] }).first();
    res.status(201).json(newUser);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Could not create a new user, please try again" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please enter all the required fields" });
  }

  emailValidation = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

  if (!emailValidation.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const user = await knex("users").where({ email: email }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }

    const passwordCorrect = bcrypt.compareSync(password, user.password);

    if (!passwordCorrect) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const authToken = jwt.sign(
      { id: user.id, firstname: user.first_name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({ authToken });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Could not log in user, please try again" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.authToken.id;
    const user = await knex("users").where({ id: userId }).first();

    if (!user) {
      return res.status(404).json({ error: "User could not be found" });
    }
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Could not get user information, please try again" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
};
