const { Router } = require("express");

const {
  getFeeds,
  getFeedById,
  getFeedsByWebsite,
} = require("../controllers/feed");

const router = Router();

router.get("/", getFeeds);
router.get("/website/:id", getFeedsByWebsite);
router.get("/:id", getFeedById);

module.exports = router;
