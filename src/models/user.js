const { Schema, model, SchemaTypes } = require("mongoose");
const { defaultImageUser } = require("../constants/images");

const userSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  lastName: {
    type: String,
  },
  image: {
    type: String,
    default: defaultImageUser,
  },
  active: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  subscriptions: [
    {
      type: SchemaTypes.ObjectId,
      ref: "webSite",
      default: [],
    },
  ],
  readFeeds: [
    {
      type: SchemaTypes.ObjectId,
      ref: "feed",
      default: [],
    },
  ],
  savedFeeds: [
    {
      type: SchemaTypes.ObjectId,
      ref: "feed",
      default: [],
    },
  ],
});

module.exports = model("user", userSchema);
