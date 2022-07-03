const { request, response } = require("express");
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
    const webSiteImage = (feed.image && feed.image.url) || "";
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
      msg: "feed not found, try again",
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

module.exports = {
  createWebSite,
  updateWebsites,
};
