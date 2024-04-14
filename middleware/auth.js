const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorise = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      error: "An authentication token is required, please try logging in",
    });
  }

  const authToken = req.headers.authorization.split(" ")[1];

  jwt.verify(authToken, process.env.JWT_SECRET, (error, decodedToken) => {
    if (error) {
      return res
        .status(401)
        .json({ error: "The authentication token is invalid" });
    }
    req.authToken = decodedToken;
    next();
  });
};

module.exports = authorise;
