const { Router } = require("express");
const { createUser } = require("../controllers/user");
const { validateCreateUser } = require("../middlewares/validate-fields");

const router = Router();

router.post("/", [validateCreateUser], createUser);

module.exports = router;
