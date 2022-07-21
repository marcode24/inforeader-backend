const cron = require("node-cron");
const { updateFeedRssItems } = require("../helpers/getFeedRss");

const jobFeeds = cron.schedule(
  "*/15 * * * *",
  () => {
    // update feeds automatically every 15 minutes
    updateFeedRssItems();
  },
  {
    scheduled: false,
  }
);

module.exports = {
  jobFeeds,
};
