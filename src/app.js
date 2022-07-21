const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const corsOptions = {
  // add cliente url here
  origin: ["http://localhost:4200"],
  methods: "GET, PUT, POST, PATCH",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/feed", require("./routes/feed"));
app.use("/api/website", require("./routes/webSite"));
app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));

module.exports = app;
