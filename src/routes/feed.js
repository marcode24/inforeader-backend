const { Router } = require("express");
const { validateJWT } = require("../middlewares/validate-jwt");

const {
  getFeeds,
  getFeedById,
  getFeedsByWebsite,
  getFeedsByUser,
} = require("../controllers/feed");
const { validateResourceFilter } = require("../middlewares/validate-fields");

const router = Router();

router.get("/", getFeeds);
router.get("/website/:id", getFeedsByWebsite);
router.get(
  "/byUser/:filter",
  [validateJWT, validateResourceFilter],
  getFeedsByUser
);
router.get("/:id", getFeedById);

module.exports = router;
