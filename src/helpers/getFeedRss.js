const Parser = require("rss-parser");
const parser = new Parser();
const { stripHtml } = require("string-strip-html");

const Feed = require("../models/feed");

const { getAllWebsites } = require("./getWebsites");

const getFeedRss = async (link) => {
  return new Promise((resolve, reject) => {
    parser.parseURL(link, (err, feed) => {
      err ? reject(null) : resolve(feed);
    });
  });
};

const saveFeedRssItems = async (urlFeed) => {
  try {
    const rss = await getFeedRss(urlFeed);
    const feedIds = [];
    for await (const item of rss.items) {
      // validate if feed exist in DB
      const feedExist = await Feed.findOne(
        {
          writer: item.author || item.creator,
          title: item.title,
        },
        "title"
      );
      if (!feedExist) {
        // create new feed
        const newFed = new Feed({
          writer: item.author || item.creator || "",
          title: item.title || "",
          pubDate: item.isoDate,
          content: stripHtml(item.content, {
            ignoreTags: ["img", "p", "a", "strong", "h2", "ul", "li"],
            skipHtmlDecoding: false,
          }).result,
          link: item.link,
        });
        const feedSaved = await newFed.save();
        feedIds.push(feedSaved.id);
      }
    }
    return feedIds;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong, parsing feeds");
  }
};

const updateFeedRssItems = async () => {
  try {
    const websites = await getAllWebsites();
    if (websites) {
      for (const website of websites) {
        const feedIds = await saveFeedRssItems(website.linkFeed);
        website.feeds = [...website.feeds, ...feedIds];
        await website.save();
      }
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  getFeedRss,
  updateFeedRssItems,
};
