const { request, response } = require("express");
const { isMongoId } = require("../helpers/mongo-id");
const {
  validateEmail,
  validatePassword,
  validateText,
} = require("../utils/regex-validations");

const validOptions = ["subscription", "read", "saved"];

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

const validateResource = (req = request, res = response, next) => {
  const option = req.params.option || null;
  if (!validOptions.includes(option)) {
    return res.status(400).json({
      ok: false,
      msg: "Must provide a valid option",
    });
  }
  const resourceID = req.params.id;
  if (!resourceID || !isMongoId(resourceID)) {
    return res.status(400).json({
      ok: false,
      msg: "Must provide a valid resource id",
    });
  }
  next();
};

const validateResourceFilter = (req = request, res = response, next) => {
  const filter = req.params.filter || null;
  if (!validOptions.includes(filter)) {
    return res.status(400).json({
      ok: false,
      msg: "Must provide a valid filter",
    });
  }
  req.filter = filter;
  next();
};

const validateUserInfo = (req = request, res = response, next) => {
  const name = req.body.name || null;
  const lastName = req.body.lastName || null;
  if (!name || (lastName && !name)) {
    return res.status(400).json({
      ok: false,
      msg: "Must provide a name",
    });
  }
  if (!validateText(name) || (lastName && !validateText(lastName))) {
    return res.status(400).json({
      ok: false,
      msg: "Fields have incorrect format",
    });
  }
  next();
};

module.exports = {
  validateCreateUser,
  validateLogin,
  validateResource,
  validateResourceFilter,
  validateUserInfo,
};
