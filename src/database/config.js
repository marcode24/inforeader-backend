const mongoose = require('mongoose');
const { configEnv } = require('../config/config');

const dbConnection = async () => {
  try {
    const { mongoUrl } = configEnv;
    await mongoose.connect(mongoUrl);
    // eslint-disable-next-line no-console
    console.log('DB online');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error('Error - starting DB');
  }
};

module.exports = dbConnection;
