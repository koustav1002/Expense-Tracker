const express = require("express");
const {
  addTransaction,
  getDashboardInformation,
  getTransactions,
  transferMoneyToAccount,
} = require("../controller/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getTransactions);
router.get("/dashboard", authMiddleware, getDashboardInformation);
router.post("/add-transaction/:account_id", authMiddleware, addTransaction);
router.put("/transfer-money", authMiddleware, transferMoneyToAccount);

module.exports = router;
