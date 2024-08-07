const { request, response } = require('express');
const { isMongoId } = require('../helpers/mongo-id');
const Feed = require('../models/feed');
const User = require('../models/user');

const getFeeds = async (req = request, res = response) => {
  try {
    const { skip = 0, limit = 20 } = req.query;

    const feeds = await Feed.find(
      {},
      'title pubDate image writer likes readingTime views',
      {
        limit,
        skip,
        sort: { pubDate: -1 },
      },
    ).populate({ path: 'website', select: 'name' });
    res.status(200).json({
      ok: true,
      feeds,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Talk to Admin',
    });
  }
};

const getFeedById = async (req = request, res = response) => {
  const id = req.params.id || null;
  if (!id) {
    return res.status(400).json({
      ok: false,
      msg: 'Must provide an Id',
    });
  }
  if (!isMongoId(id)) {
    return res.status(400).json({
      ok: false,
      msg: 'Id is not valid',
    });
  }

  try {
    const feedDB = await Feed.findById(id).populate({ path: 'website' });
    if (!feedDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Feed not found, try again',
      });
    }

    if (typeof feedDB.views !== 'number') {
      feedDB.views = 0;
    }

    await Feed.findByIdAndUpdate(id, { views: feedDB.views + 1 });
    return res.status(200).json({
      ok: true,
      feed: feedDB,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

const getFeedsByWebsite = async (req = request, res = response) => {
  const id = req.params.id || null;
  const { skip = 0, limit = 10 } = req.query;
  if (!id) {
    return res.status(400).json({
      ok: false,
      msg: 'Must provide an Id',
    });
  }
  if (!isMongoId(id)) {
    return res.status(400).json({
      ok: false,
      msg: 'Id is not valid',
    });
  }

  try {
    const feeds = await Feed.find(
      { website: id },
      'title pubDate image writer views',
      {
        limit,
        skip,
        sort: { pubDate: -1 },
      },
    ).populate({ path: 'website', select: 'name' });
    return res.status(200).json({
      ok: true,
      feeds,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'something went wrong',
    });
  }
};

const getFeedsByUser = async (req = request, res = response) => {
  try {
    const { id: idUser, filter } = req;

    const option = filter === 'subscription' ? `${filter}s` : `${filter}Feeds`;
    const selectFieldsUser = `_id ${option}`;
    const fieldToFilter = filter === 'subscription' ? 'website' : '_id';
    const userDB = await User.findById(idUser, selectFieldsUser);

    const { skip = 0, limit = 10 } = req.query;
    const sortFeeds = { sort: { pubDate: -1 } };
    const optionsFinding = { limit, skip };
    let feeds = [];
    feeds = await Feed.find(
      {
        [fieldToFilter]: { $in: userDB[option] },
      },
      'title pubDate image writer likes views',
      filter === 'saved'
        ? { ...optionsFinding }
        : { ...optionsFinding, sortFeeds },
    ).populate({ path: 'website', select: 'name' });
    res.json({
      ok: true,
      feeds,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'something went wrong',
    });
  }
};

const searchFeeds = async (req = request, res = response) => {
  const { q: query, skip = 0, limit = 10 } = req.query;
  try {
    const regexQuery = new RegExp(query, 'i');
    const feedsFound = await Feed.find(
      { title: regexQuery },
      'title pubDate image writer likes views',
      {
        limit,
        skip,
        sort: { pubDate: -1 },
      },
    ).populate({ path: 'website', select: 'name' });
    res.status(200).json({
      ok: true,
      feeds: feedsFound,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'something went wrong',
    });
  }
};

module.exports = {
  getFeeds,
  getFeedById,
  getFeedsByWebsite,
  getFeedsByUser,
  searchFeeds,
};
