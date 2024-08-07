const { request, response } = require('express');
const bcrypt = require('bcrypt');

const Website = require('../models/webSite');
const User = require('../models/user');
const Feed = require('../models/feed');

const { modifiyPreference } = require('../helpers/modify-preferences');
const { generateJWT } = require('../utils/jwt');

const createUser = async (req = request, res = response) => {
  try {
    const { password, email } = req.body;
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({
        ok: false,
        msg: 'email has already been registered',
      });
    }
    const newUser = new User({ email });
    const salt = bcrypt.genSaltSync();
    newUser.password = bcrypt.hashSync(password, salt);
    const userSaved = await newUser.save();
    const [token, userData] = await Promise.all([
      generateJWT(userSaved.id),
      User.findById(userSaved.id, '-password'),
    ]);
    return res.status(201).json({
      ok: true,
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

const modifyPreferences = async (req = request, res = response) => {
  const { id } = req;
  try {
    const fieldsToPopulate = '_id subscriptions readFeeds savedFeeds likedFeeds';
    const user = await User.findById(id, fieldsToPopulate)
      .populate('subscriptions', '_id')
      .populate('readFeeds', '_id')
      .populate('savedFeeds', '_id')
      .populate('likedFeeds', '_id');

    if (!user) {
      return res.status(404).json({ ok: false, msg: 'user not found' });
    }

    const resourceID = req.params.id;
    const { option } = req.params;
    const resources = {
      subscription: Website.findById(resourceID, '_id name'),
      read: Feed.findById(resourceID, '_id title'),
      saved: Feed.findById(resourceID, '_id title'),
      liked: Feed.findById(resourceID, '_id title likes'),
    };

    const resourceFound = await resources[option];
    if (!resourceFound) {
      return res.status(404).json({ ok: false, msg: 'resource not found' });
    }

    const preferenceModified = await modifiyPreference(
      { option, user, resource: resourceFound },
    );

    if (!preferenceModified) {
      return res.status(400).json({
        ok: false,
        msg: 'preference was not modified correctly',
      });
    }

    return res.status(201).json({ ok: true, msg: 'preferences updated correctly', user });
  } catch (error) {
    return res.status(500).json({ ok: false, msg: 'Something went wrong' });
  }
};

const setTheme = async (req = request, res = response) => {
  try {
    const idUser = req.id;
    const darkMode = req.body.darkMode || false;
    const userDB = await User.findById(idUser);
    if (!userDB) {
      return res.json({
        ok: false,
        msg: 'user not found, try again',
      });
    }

    userDB.darkMode = darkMode;
    await userDB.save();
    return res.status(200).json({
      ok: true,
      msg: 'theme updated correctly',
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

const updateInfo = async (req = request, res = response) => {
  try {
    const userDB = await User.findById(req.id);
    userDB.name = req.body.name || null;
    userDB.lastName = req.body.lastName || null;
    await userDB.save();
    return res.json({
      ok: true,
      msg: 'user info updated correctly',
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

module.exports = {
  createUser,
  modifyPreferences,
  setTheme,
  updateInfo,
};
