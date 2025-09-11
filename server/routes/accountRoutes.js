const express = require("express");
const {addMoneyToAccount, createAccount, getAccounts} = require("../controller/accountController");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", authMiddleware, getAccounts);
router.post("/create", authMiddleware, createAccount);
router.put("/add-money/:id", authMiddleware, addMoneyToAccount);

module.exports = router;