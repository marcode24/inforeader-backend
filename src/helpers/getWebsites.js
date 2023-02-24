const WebSite = require('../models/webSite');

const getAllWebsites = async () => {
  const websites = await WebSite.find();
  return websites;
};

const getWebsiteById = async (id) => {
  const website = await WebSite.findById(id);
  return website;
};

module.exports = {
  getAllWebsites,
  getWebsiteById,
};
