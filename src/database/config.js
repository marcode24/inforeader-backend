const mongoose = require("mongoose");
const { configEnv } = require("../config/config");

const dbConnection = async () => {
  try {
    const { mongoUrl } = configEnv;
    await mongoose.connect(mongoUrl);
    console.log("DB online");
  } catch (error) {
    console.log(error);
    throw new Error("Error - starting DB");
  }
};

module.exports = dbConnection;
