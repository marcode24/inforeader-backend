const { request, response } = require("express");
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

module.exports = {
  getFeeds,
};
