const { Schema, model, SchemaTypes } = require("mongoose");

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
  image: {
    type: String,
    default: null,
  },
  website: {
    type: SchemaTypes.ObjectId,
    ref: "webSite",
    default: [],
  },
});

module.exports = model("feed", feedSchema);
