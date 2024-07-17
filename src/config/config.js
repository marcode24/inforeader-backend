const joi = require('joi');

const envVarsSchema = joi
  .object()
  .keys({
    PORT: joi.number().positive().required(),
    MONGO_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    WORDS_PER_MINUTE: joi.number().positive().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const configEnv = {
  mongoUrl: envVars.MONGO_URL,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,
  wordsPerMinute: envVars.WORDS_PER_MINUTE,
};

module.exports = {
  configEnv,
};
