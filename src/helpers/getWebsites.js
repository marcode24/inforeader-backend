const WebSite = require("../models/webSite");

const getAllWebsites = async () => {
  const websites = await WebSite.find();
  return websites;
};

module.exports = {
  getAllWebsites,
};
