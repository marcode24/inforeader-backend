const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/feed", require("./routes/feed"));
app.use("/api/website", require("./routes/webSite"));

module.exports = app;
