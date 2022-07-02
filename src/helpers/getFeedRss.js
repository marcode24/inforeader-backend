const Parser = require("rss-parser");
const parser = new Parser();
const { stripHtml } = require("string-strip-html");
const Feed = require("../models/feed");

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

module.exports = {
  getFeedRss,
  saveFeedRssItems,
};
