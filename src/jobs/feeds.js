const { updateFeedRssItems } = require('../helpers/getFeedRss');

export default function handler(req, res) {
  updateFeedRssItems();
  res.status(200).json({ ok: true, msg: 'Job started successfully' });
}
