const jwt = require('jsonwebtoken');
const { configEnv } = require('../config/config');

const { jwtSecret } = configEnv;

const generateJWT = (id) => new Promise((resolve, reject) => {
  const payload = { id };
  jwt.sign(payload, jwtSecret, { expiresIn: '12h' }, (err, token) => {
    err ? reject() : resolve(token);
  });
});

module.exports = {
  generateJWT,
};
