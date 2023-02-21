const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();

const corsOptions = {
  origin: ["http://localhost:4200/", "https://inforeader.netlify.app/"],
  methods: "GET, PUT, POST, PATCH, OPTIONS",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  if(req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    return res.status(200).json({});
  }
  next();
})

const VERSION = "/api/v1";

app.use(`${VERSION}/feed`, require("./routes/feed"));
app.use(`${VERSION}/website`, require("./routes/webSite"));
app.use(`${VERSION}/user`, require("./routes/user"));
app.use(`${VERSION}/auth`, require("./routes/auth"));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


module.exports = app;
