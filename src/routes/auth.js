const { Router } = require("express");
const { validateJWT } = require("../middlewares/validate-jwt");
const { validateLogin } = require("../middlewares/validate-fields");
const { login, renewToken } = require("../controllers/auth");

const router = Router();

router.post("/login", [validateLogin], login);
router.get("/renew", [validateJWT], renewToken);

module.exports = router;
