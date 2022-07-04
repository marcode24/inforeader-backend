const { Schema, model } = require("mongoose");

const webSiteSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
    required: true,
  },
  linkFeed: {
    type: String,
    required: true,
  },
});

module.exports = model("webSite", webSiteSchema);
