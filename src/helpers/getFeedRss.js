const Parser = require("rss-parser");
const parser = new Parser();
const { stripHtml } = require("string-strip-html");

const Feed = require("../models/feed");

const { getAllWebsites, getWebsiteById } = require("./getWebsites");

const getFeedRss = async (link) => {
  return new Promise((resolve, reject) => {
    parser.parseURL(link, (err, feed) => {
      err ? reject(null) : resolve(feed);
    });
  });
};

const saveFeedRssItems = async (websites) => {
  try {
    const feedRssPromises = [];

    websites.forEach((item) => feedRssPromises.push(getFeedRss(item.linkFeed)));
    let allRss = await Promise.allSettled(feedRssPromises);
    const rejectedLinks = [];

    allRss.forEach((rss, index) => {
      // check if result has no error
      if (rss.status === "rejected") {
        const { name, link, linkFeed } = websites[index];
        rejectedLinks.push({
          name,
          link,
          linkFeed,
        });
      }
    });

    // filter rss resolved
    allRss = allRss
      .filter((rss) => rss.status === "fulfilled")
      .map((rss) => {
        const wbFound = websites.find(
          (website) =>
            website.name === rss.value.title || website.link === rss.value.link
        );
        rss.websiteDB = wbFound.id;
        return rss;
      });

    if (allRss.length > 0) {
      for (const itemRss of allRss) {
        const websiteDB = await getWebsiteById(itemRss.websiteDB);
        const itemsFeed = itemRss.value.items;
        for (const item of itemsFeed) {
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
            websiteDB.feeds.push(feedSaved.id);
          }
          await websiteDB.save();
        }
      }
    }
    return { status: true, rejectedLinks };
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong, parsing feeds");
  }
};

const updateFeedRssItems = async () => {
  try {
    const websites = await getAllWebsites();
    if (websites) {
      const result = await saveFeedRssItems(websites);
      return result;
    }
    return { status: true };
  } catch (error) {
    console.log(error);
    return { status: false };
  }
};

module.exports = {
  getFeedRss,
  updateFeedRssItems,
};
