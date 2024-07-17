const { configEnv } = require('../config/config');

const calculateReadingTime = (text) => {
  const { wordsPerMinute } = configEnv;
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / parseInt(wordsPerMinute, 10));
  return minutes;
};

module.exports = calculateReadingTime;
