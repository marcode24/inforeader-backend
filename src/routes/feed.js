const { Router } = require("express");

const { getFeeds } = require("../controllers/feed");

const router = Router();

router.get("/", getFeeds);

module.exports = router;
