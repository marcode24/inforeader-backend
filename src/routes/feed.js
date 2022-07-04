const { Router } = require("express");

const { getFeeds, getFeedById } = require("../controllers/feed");

const router = Router();

router.get("/", getFeeds);
router.get("/:id", getFeedById);

module.exports = router;
