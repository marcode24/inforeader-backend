const { Schema, model, SchemaTypes } = require("mongoose");

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
  feeds: [
    {
      type: SchemaTypes.ObjectId,
      ref: "feed",
      default: [],
    },
  ],
});

module.exports = model("webSite", webSiteSchema);
