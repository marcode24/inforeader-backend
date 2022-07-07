const { request, response } = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Website = require("../models/webSite");
const Feed = require("../models/feed");

const { modifiyPreference } = require("../helpers/modify-preferences");

const createUser = async (req = request, res = response) => {
  try {
    const { password, email } = req.body;
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        ok: false,
        msg: "email has already been registered",
      });
    }
    const newUser = new User({ email });
    const salt = bcrypt.genSaltSync();
    newUser.password = bcrypt.hashSync(password, salt);
    const userCreated = await newUser.save();
    res.status(201).json({
      ok: true,
      user: userCreated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Something went wrong",
    });
  }
};

const modifyPreferences = async (req = request, res = response) => {
  const id = req.id;
  try {
    const user = await User.findById(
      id,
      "_id subscriptions readFeeds savedFeeds"
    )
      .populate("subscriptions", "_id")
      .populate("readFeeds", "_id")
      .populate("savedFeeds", "_id");
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "user not found",
      });
    }
    const resourceID = req.params.id;
    const option = req.params.option;
    const resources = {
      subscription: Website.findById(resourceID, "_id name"),
      read: Feed.findById(resourceID, "_id title"),
      saved: Feed.findById(resourceID, "_id title"),
    };
    const resourceFound = await resources[option];
    if (!resourceFound) {
      return res.status(404).json({
        ok: false,
        msg: "resource not found",
      });
    }
    const preferenceModified = await modifiyPreference(
      option,
      user,
      resourceID
    );
    if (!preferenceModified) {
      return res.status(400).json({
        ok: false,
        msg: "preference was not modified correctly",
      });
    }
    res.json({
      ok: true,
      user,
      msg: "preferences updated correctly",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Something went wrong",
    });
  }
};

module.exports = {
  createUser,
  modifyPreferences,
};
