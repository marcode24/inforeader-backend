const Parser = require('rss-parser');
const { stripHtml } = require('string-strip-html');
const { regexFirstImage } = require('../constants/regex');

const Feed = require('../models/feed');
const WebSite = require('../models/webSite');

const parser = new Parser();

const getFeedRss = async (link) => new Promise((resolve, reject) => {
  parser.parseURL(link, (err, feed) => (err ? reject() : resolve(feed)));
});

const saveFeedRssItems = async (websites) => {
  try {
    const feedRssPromises = websites.map((item) => getFeedRss(item.linkFeed));
    const feedsPromisesResolved = await Promise.allSettled(feedRssPromises);

    const rejectedLinks = feedsPromisesResolved.reduce((acc, rss, index) => {
      if (rss.status === 'rejected') {
        const { name, link, linkFeed } = websites[index];
        acc.push({ name, link, linkFeed });
      }
      return acc;
    }, []);

    const feedsResolved = feedsPromisesResolved
      .filter((rss) => rss.status === 'fulfilled')
      .map((rss) => {
        const wbFound = websites.find(
          (website) => website.name === rss.value.title
            || website.link === rss.value.link,
        );
        rss.websiteDB = wbFound?._id || null;
        return rss;
      });

    if (feedsResolved.length > 0) {
      await Promise.all(feedsResolved.map(async (itemRss) => {
        const itemsFeed = itemRss.value.items;
        await Promise.all(itemsFeed.map(async (item) => {
          const feedExist = await Feed.findOne({
            $or: [
              { title: item.title },
              { writer: item.author || item.creator },
              { pubDate: item.isoDate },
            ],
          }, 'title writer pubDate');

          if (!feedExist) {
            const itemContent = stripHtml(item.content, {
              ignoreTags: ['img', 'p', 'a', 'strong', 'h2', 'ul', 'li'],
              skipHtmlDecoding: false,
            }).result;

            const feedImages = Array
              .from(item.content.matchAll(regexFirstImage), (m) => m[1]);

            const newFeed = new Feed({
              writer: item.author || item.creator || '',
              title: item.title || '',
              pubDate: item.isoDate,
              content: itemContent,
              image: feedImages.length > 0 ? feedImages[0] : null,
              link: item.link,
              website: itemRss.websiteDB,
            });

            await newFeed.save();
          }
        }));
      }));
    }

    return { status: true, rejectedLinks };
  } catch (error) {
    throw new Error('something went wrong while parsing feeds');
  }
};

const updateFeedRssItems = async () => {
  try {
    const websites = await WebSite.find({}, '-image -description -__v');
    if (websites) {
      const result = await saveFeedRssItems(websites);
      return result;
    }
    return { status: true };
  } catch (error) {
    return { status: false };
  }
};

module.exports = {
  getFeedRss,
  updateFeedRssItems,
};
