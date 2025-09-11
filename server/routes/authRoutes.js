const express = require("express");
const { signupUser } = require("../controller/authController");
const { signinUser } = require("../controller/authController");

const router = express.Router();

router.post("/sign-up", signupUser);
router.post("/sign-in", signinUser);

module.exports = router;
