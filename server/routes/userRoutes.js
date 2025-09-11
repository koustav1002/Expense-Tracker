const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const { getUser, changePassword, updateUser } = require("../controller/userController.js");

const router = express.Router();

router.get("/", authMiddleware, getUser);
router.put("/change-password", authMiddleware, changePassword);
router.put("/:id", authMiddleware, updateUser);

module.exports = router;
