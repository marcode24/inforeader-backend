const { Router } = require("express");
const { getRss } = require("../controllers/rss");

const router = Router();

router.get("/", getRss);

module.exports = router;
