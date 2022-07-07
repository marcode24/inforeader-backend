const WebSite = require("../models/webSite");

const getAllWebsites = async () => {
  const websites = await WebSite.find();
  return websites;
};

const getWebsiteById = async (id) => {
  return await WebSite.findById(id);
};

module.exports = {
  getAllWebsites,
  getWebsiteById,
};
