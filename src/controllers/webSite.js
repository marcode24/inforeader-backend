const { request, response } = require("express");
const { defaultImageWebsite } = require("../constants/images");
const { getFeedRss, updateFeedRssItems } = require("../helpers/getFeedRss");
const WebSite = require("../models/webSite");

const createWebSite = async (req = request, res = response) => {
  const url = req.body.url || null;
  if (!url) {
    return res.status(400).json({
      ok: false,
      msg: "must provide a url",
    });
  }

  try {
    const existWebsite = await WebSite.findOne({ linkFeed: url });
    if (existWebsite) {
      return res.status(400).json({
        ok: false,
        msg: "url has been registered",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "feed not found, try again",
    });
  }

  try {
    const { title, description, link, ...feed } = await getFeedRss(url);
    const webSiteImage = (feed.image && feed.image.url) || defaultImageWebsite;
    const newWebSite = new WebSite({
      name: title,
      image: webSiteImage,
      description,
      link,
      linkFeed: url,
    });
    await newWebSite.save();
    res.json({
      ok: true,
      msg: "website created correctly",
    });
  } catch (error) {
    return res.status(404).json({
      ok: false,
      msg: "something went wrong, try again",
    });
  }
};

const updateWebsites = async (req, res) => {
  const { status, rejectedLinks = null } = await updateFeedRssItems();
  if (!status) {
    return res.status(500).json({
      ok: false,
      msg: "Something went wrong, try again",
    });
  }

  res.status(200).json({
    ok: true,
    rejectedLinks,
    msg: "all updated",
  });
};

const getWebsites = async (req = request, res = response) => {
  const { skip = 0, limit = 5, all = false } = req.query;
  let websites;
  try {
    if (!JSON.parse(all)) {
      websites = await WebSite.find().skip(skip).limit(limit);
    } else {
      websites = await WebSite.find();
    }
    res.status(200).json({
      ok: true,
      websites,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Something went wrong",
    });
  }
};

module.exports = {
  createWebSite,
  updateWebsites,
  getWebsites,
};
