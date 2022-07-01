const Parser = require("rss-parser");
const parser = new Parser();

const getFeedRss = async (link) => {
  return new Promise((resolve, reject) => {
    parser.parseURL(link, (err, feed) => {
      err ? reject(null) : resolve(feed);
    });
  });
};

module.exports = {
  getFeedRss,
};
