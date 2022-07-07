const { response } = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateJWT } = require("../utils/jwt");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist || userExist.google) {
      return res.status(400).json({
        ok: false,
        msg: "User y/o password incorrectos",
      });
    }
    const validPassword = bcrypt.compareSync(password, userExist.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "User y/o password incorrectos",
      });
    }
    const token = await generateJWT(userExist.id);
    return res.status(200).json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Talk to Admin",
    });
  }
};

const renewToken = async (req, res = response) => {
  const id = req.id;
  const token = await generateJWT(id);
  const user = await User.findById(id, "-password");
  res.json({
    ok: true,
    token,
    user,
  });
};

module.exports = {
  login,
  renewToken,
};
