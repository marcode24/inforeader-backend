const mongoose = require("mongoose");
const { configEnv } = require("../config/config");

const dbConnection = async () => {
  try {
    const mongoConfig = configEnv.mongo;
    const { connection, user, password, host, port } = mongoConfig;
    const uri = `${connection}://${user}:${password}@${host}:${port}/?authSource=admin&readPreference=primary`;
    await mongoose.connect(uri);
    console.log("DB online");
  } catch (error) {
    console.log(error);
    throw new Error("Error - starting DB");
  }
};

module.exports = dbConnection;
