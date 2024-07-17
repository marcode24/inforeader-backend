const { Schema, model, SchemaTypes } = require('mongoose');
const { defaultImageWebsite } = require('../constants/images');

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
    default: defaultImageWebsite,
  },
  likes: {
    type: Number,
    default: 0,
  },
  website: {
    type: SchemaTypes.ObjectId,
    ref: 'webSite',
    default: {},
  },
  readingTime: {
    type: Number,
    default: 0,
  },
});

module.exports = model('feed', feedSchema);
