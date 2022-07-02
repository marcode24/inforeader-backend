const { Schema, model } = require("mongoose");

const feedSchema = Schema({
  writer: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  pubDate: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
  },
  link: {
    type: String,
    required: true,
  },
});

module.exports = model("feed", feedSchema);
