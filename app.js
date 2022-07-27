require("dotenv").config()
const express = require("express")
const app = express()
const router = require("./api")
const cors = require('cors')

// Setup your Middleware and API Router here
app.use(express.json());
app.use(cors())

app.use("/api", router)

module.exports = app;
