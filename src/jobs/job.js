const cron = require("node-cron");
const { updateFeedRssItems } = require("../helpers/getFeedRss");

const jobFeeds = cron.schedule(
  "*/30 * * * *",
  () => {
    // update feeds automatically every 30 minutes
    updateFeedRssItems();
  },
  {
    scheduled: false,
  }
);

module.exports = {
  jobFeeds,
};
