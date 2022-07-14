const { Router } = require("express");
const {
  createUser,
  modifyPreferences,
  setTheme,
} = require("../controllers/user");
const {
  validateCreateUser,
  validateResource,
} = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

router.post("/", [validateCreateUser], createUser);

router.patch("/theme", [validateJWT], setTheme);
router.patch(
  "/:option/:id",
  [validateJWT, validateResource],
  modifyPreferences
);

module.exports = router;
