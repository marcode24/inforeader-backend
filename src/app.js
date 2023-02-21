const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();

const corsOptions = {
  origin: ["http://localhost:4200", "https://inforeader.netlify.app"],
  methods: "GET, PUT, POST, PATCH",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const VERSION = "/api/v1";

app.use(`${VERSION}/feed`, require("./routes/feed"));
app.use(`${VERSION}/website`, require("./routes/webSite"));
app.use(`${VERSION}/user`, require("./routes/user"));
app.use(`${VERSION}/auth`, require("./routes/auth"));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
