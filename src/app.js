const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();

const corsOptions = {
  origin: ["http://localhost:4200", "https://inforeader.netlify.app"],
  methods: "GET, PUT, POST, PATCH, OPTIONS",
  allowedHeaders: "Content-Type, Authorization, Origin, X-Requested-With, Accept",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Origin, X-Requested-With, Accept"
  );
  next();
});

const VERSION = "/api/v1";

app.use(`${VERSION}/feed`, require("./routes/feed"));
app.use(`${VERSION}/website`, require("./routes/webSite"));
app.use(`${VERSION}/user`, require("./routes/user"));
app.use(`${VERSION}/auth`, require("./routes/auth"));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;
