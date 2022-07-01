const joi = require("joi");

const envVarsSchema = joi
  .object()
  .keys({
    PORT: joi.number().positive().required(),
    MONGO_INITDB_ROOT_USERNAME: joi.string().required(),
    MONGO_INITDB_ROOT_PASSWORD: joi.string(),
    MONGO_DB: joi.string().required(),
    MONGO_PORT: joi.number().positive().required(),
    MONGO_HOST: joi.string().required(),
    MONGO_CONNECTION: joi.string().required().valid("mongodb"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const configEnv = {
  mongo: {
    dbName: envVars.MONGO_DB,
    user: envVars.MONGO_INITDB_ROOT_USERNAME,
    password: envVars.MONGO_INITDB_ROOT_PASSWORD,
    port: parseInt(envVars.MONGO_PORT, 10),
    host: envVars.MONGO_HOST,
    connection: envVars.MONGO_CONNECTION,
  },
  port: envVars.PORT,
};

module.exports = {
  configEnv,
};
