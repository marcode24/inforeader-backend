const { request, response } = require('express');
const { defaultImageWebsite } = require('../constants/images');
const { getFeedRss, updateFeedRssItems } = require('../helpers/getFeedRss');
const WebSite = require('../models/webSite');
const Feed = require('../models/feed');

const createWebSite = async (req = request, res = response) => {
  const url = req.body.url || null;
  if (!url) {
    return res.status(400).json({
      ok: false,
      msg: 'must provide a url',
    });
  }

  try {
    const existWebsite = await WebSite.findOne({ linkFeed: url });
    if (existWebsite) {
      return res.status(400).json({
        ok: false,
        msg: 'url has been registered',
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: 'feed not found, try again',
    });
  }

  try {
    const {
      title, description, link, ...feed
    } = await getFeedRss(url);
    const webSiteImage = (feed.image && feed.image.url) || defaultImageWebsite;
    const newWebSite = new WebSite({
      name: title,
      image: webSiteImage,
      description,
      link,
      linkFeed: url,
    });
    await newWebSite.save();
    return res.json({
      ok: true,
      msg: 'website created correctly',
    });
  } catch (error) {
    return res.status(404).json({
      ok: false,
      msg: 'something went wrong, try again',
    });
  }
};

const updateWebsites = async (req, res) => {
  const { status, rejectedLinks = null } = await updateFeedRssItems();
  if (!status) {
    return res.status(500).json({
      ok: false,
      msg: 'Something went wrong, try again',
    });
  }

  return res.status(200).json({
    ok: true,
    rejectedLinks,
    msg: 'all updated',
  });
};

const getWebsites = async (req = request, res = response) => {
  const {
    skip = 0, limit = 5, all = false, count = false,
  } = req.query;
  let websites;
  try {
    if (!JSON.parse(all)) {
      websites = await WebSite.find().skip(parseInt(skip, 10)).limit(parseInt(limit, 10));
    } else {
      websites = await WebSite.find();
    }

    if (JSON.parse(count)) {
      // Realizar la agregación para contar feeds por websites
      const feedCounts = await Feed.aggregate([
        {
          $lookup: {
            from: 'websites',
            localField: 'website',
            foreignField: '_id',
            as: 'websiteDetails',
          },
        },
        { $unwind: '$websiteDetails' },
        {
          $group: {
            _id: '$websiteDetails._id',
            websiteName: { $first: '$websiteDetails.name' },
            websiteLink: { $first: '$websiteDetails.link' },
            feedCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            websiteId: '$_id',
            websiteName: 1,
            websiteLink: 1,
            feedCount: 1,
          },
        },
      ]);

      // Mapear los resultados de la consulta de websites con los conteos de feeds
      const websitesWithCounts = websites.map((website) => {
        const feedCountInfo = feedCounts
          .find((feedCount) => feedCount.websiteId.equals(website._id));
        return {
          ...website.toObject(),
          feedCount: feedCountInfo ? feedCountInfo.feedCount : 0,
        };
      });

      res.status(200).json({
        ok: true,
        websites: websitesWithCounts,
      });
    } else {
      res.status(200).json({
        ok: true,
        websites,
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Something went wrong',
    });
  }
};

module.exports = {
  createWebSite,
  updateWebsites,
  getWebsites,
};
