const express = require('express');
const app = express();

require("dotenv").config();
const port = process.env.PORT || 8080;

const { CORS_ORIGIN } = process.env
const cors = require("cors")
app.use(cors(CORS_ORIGIN))

app.use(express.json())

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes)

app.listen(port, () => {
console.log(`running at http://localhost:${port}`)
})