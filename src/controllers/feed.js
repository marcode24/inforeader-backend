const { request, response } = require("express");
const { isMongoId } = require("../helpers/mongo-id");
const Feed = require("../models/feed");

const getFeeds = async (req = request, res = response) => {
  try {
    const { skip = 0, limit = 20 } = req.query;
    const feeds = await Feed.find({}, "title pubDate image", {
      limit,
      skip,
      sort: { pubDate: -1 },
    }).populate({ path: "website", select: "name" });
    res.status(200).json({
      ok: true,
      feeds,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Talk to Admin",
    });
    console.log(error);
  }
};

const getFeedById = async (req = request, res = response) => {
  const id = req.params.id || null;
  if (!id) {
    return res.status(400).json({
      ok: false,
      msg: "Must provide an Id",
    });
  }
  if (!isMongoId(id)) {
    return res.status(400).json({
      ok: false,
      msg: "Id is not valid",
    });
  }

  try {
    const feedDB = await Feed.findById(id).populate({ path: "website" });
    if (!feedDB) {
      return res.status(404).json({
        ok: false,
        msg: "Feed not found, try again",
      });
    }
    res.status(200).json({
      ok: true,
      feed: feedDB,
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
  getFeeds,
  getFeedById,
};
