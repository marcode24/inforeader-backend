const { Router } = require("express");
const { createWebSite, updateWebsites } = require("../controllers/webSite");

const router = Router();

router.post("/", createWebSite);
router.post("/update", updateWebsites);

module.exports = router;
