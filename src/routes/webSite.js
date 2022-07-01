const { Router } = require("express");
const { createWebSite } = require("../controllers/webSite");

const router = Router();

router.post("/", createWebSite);

module.exports = router;
