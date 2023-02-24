const cron = require('node-cron');
const { updateFeedRssItems } = require('../helpers/getFeedRss');

const jobFeeds = cron.schedule(
  '0 */12 * * *',
  () => {
    // update feeds automatically every  twelve hours
    updateFeedRssItems();
  },
  {
    scheduled: false,
  },
);

module.exports = {
  jobFeeds,
};
