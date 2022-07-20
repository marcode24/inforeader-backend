const { Router } = require("express");
const {
  createUser,
  modifyPreferences,
  setTheme,
  updateInfo,
} = require("../controllers/user");
const {
  validateCreateUser,
  validateResource,
  validateUserInfo,
} = require("../middlewares/validate-fields");
const { validateJWT } = require("../middlewares/validate-jwt");

const router = Router();

router.post("/", [validateCreateUser], createUser);

router.patch("/", [validateJWT, validateUserInfo], updateInfo);
router.patch("/theme", [validateJWT], setTheme);
router.patch(
  "/:option/:id",
  [validateJWT, validateResource],
  modifyPreferences
);

module.exports = router;
