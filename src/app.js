const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const corsOptions = {
  origin: ["http://localhost:4200", "https://inforeader.netlify.app"],
  methods: "GET, PUT, POST, PATCH",
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/feed", require("./routes/feed"));
app.use("/api/website", require("./routes/webSite"));
app.use("/api/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));

app.get("*", (req, res) => {
  res.send("Hello world");
});

module.exports = app;
