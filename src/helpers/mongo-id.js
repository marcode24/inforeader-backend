const mongoose = require('mongoose');

const isMongoId = (value) => mongoose.Types.ObjectId.isValid(value);

module.exports = {
  isMongoId,
};
