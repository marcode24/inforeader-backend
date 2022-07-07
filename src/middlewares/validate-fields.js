const { request, response } = require("express");
const {
  validateEmail,
  validatePassword,
} = require("../utils/regex-validations");

const validateCreateUser = (req = request, res = response, next) => {
  const { email = null, password = null } = req.body;
  if (!validateEmail(email) || !validatePassword(password)) {
    return res.status(400).json({
      ok: false,
      msg: "password or email has incorrect format",
    });
  }
  next();
};

const validateLogin = (req = request, res = response, next) => {
  const { email = null, password = null } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      msg: "Must provide email and password",
    });
  }
  next();
};

module.exports = {
  validateCreateUser,
  validateLogin,
};
