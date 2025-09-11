const { getMonthName } = require("../libs/index");
const Transaction = require("../models/TransactionModel");
const Account = require("../models/AccountModel");
const mongoose = require("mongoose");

const getTransactions = async (req, res) => {
  try {
    const today = new Date();

    const _sevenDaysAgo = new Date(today);

    _sevenDaysAgo.setDate(today.getDate() - 7);

    const sevenDaysAgo = _sevenDaysAgo.toISOString().split("T")[0];

    const { df, dt, s } = req.query;

    const { userId } = req.body.user;

    const startDate = new Date(df || sevenDaysAgo);
    const endDate = new Date(dt || new Date());
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);

    const searchRegex = new RegExp(s, "i"); // Case-insensitive regex

    const transactions = await Transaction.find({
      user_id: userId,
      createdAt: { $gte: startDate, $lt: endDate },
      $or: [
        { description: { $regex: searchRegex } },
        { status: { $regex: searchRegex } },
        { source: { $regex: searchRegex } },
      ],
    }).sort({ _id: -1 }); // Sort by _id descending

    res.status(200).json({
      status: "success",
      data: transactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

const getDashboardInformation = async (req, res) => {
  try {
    const { userId } = req.body.user;

    let totalIncome = 0;
    let totalExpense = 0;

    // 1. Group by type to calculate total income and expense
    const uid = new mongoose.Types.ObjectId(userId);

    const typeTotals = await Transaction.aggregate([
      { $match: { user_id: uid } },
      {
        $group: {
          _id: "$type",
          // Decimal128 values can be summed directly
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    typeTotals.forEach((item) => {
      if (item._id === "income") {
        totalIncome = parseFloat(item.totalAmount);
      } else {
        totalExpense = parseFloat(item.totalAmount);
      }
    });

    const availableBalance = totalIncome - totalExpense;

    // 2. Monthly summary grouped by type and month
    const year = new Date().getFullYear();
    const start_Date = new Date(year, 0, 1);
    const end_Date = new Date(year, 11, 31, 23, 59, 59);

    const monthlySummary = await Transaction.aggregate([
      {
        $match: {
          user_id: uid,
          createdAt: { $gte: start_Date, $lte: end_Date },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            type: "$type",
          },
          totalAmount: { $sum: { $toDecimal: "$amount" } },
        },
      },
    ]);

    const data = new Array(12).fill().map((_, index) => {
      const monthIndex = index + 1;
      const monthData = monthlySummary.filter(
        (item) => item._id.month === monthIndex
      );

      const income =
        monthData.find((item) => item._id.type === "income")?.totalAmount || 0;
      const expense =
        monthData.find((item) => item._id.type === "expense")?.totalAmount || 0;

      return {
        label: getMonthName(index),
        income: parseFloat(income),
        expense: parseFloat(expense),
      };
    });

    // 3. Fetch last 5 transactions
    const lastTransactions = await Transaction.find({ user_id: uid })
      .sort({ createdAt: -1 })
      .limit(5);

    // 4. Fetch last 4 accounts
    const lastAccount = await Account.find({ user_id: uid })
      .sort({ createdAt: -1 })
      .limit(4);

    // Final response
    res.status(200).json({
      status: "success",
      availableBalance,
      totalIncome,
      totalExpense,
      chartData: data,
      lastTransactions,
      lastAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

const addTransaction = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { userId } = req.body.user; // payload injected by your auth middleware
    const { account_id } = req.params; // URL param
    const { description, source, amount } = req.body;

    /* --------------------- Basic validation --------------------- */
    if (!(description && source && amount)) {
      return res.status(403).json({
        status: "failed",
        message: "Provide required fields (description, source, amount).",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(403).json({
        status: "failed",
        message: "Amount should be greater than 0.",
      });
    }

    // Convert amount to MongoDB Decimal128 once and reuse
    const amountDec = mongoose.Types.Decimal128.fromString(
      Number(amount).toString()
    );

    /* --------------------- Transaction begins ------------------- */
    await session.withTransaction(async () => {
      /* 1️⃣  Grab the account & lock it (findOne with session) */
      const account = await Account.findById(account_id).session(session);

      if (!account) throw new Error("Invalid account information.");

      // Convert Decimal128 to Number for the comparison
      const currentBalance = parseFloat(account.account_balance.toString());

      if (currentBalance < Number(amount))
        throw new Error("Transaction failed. Insufficient account balance.");

      /* 2️⃣  Update account balance atomically */
      // In a txn this update is isolated – no race conditions
      account.account_balance = mongoose.Types.Decimal128.fromString(
        (currentBalance - Number(amount)).toString()
      );
      await account.save({ session });

      /* 3️⃣  Insert the transaction record */
      await Transaction.create(
        [
          {
            user_id: userId,
            description,
            type: "expense",
            status: "Completed",
            amount: amountDec,
            source,
          },
        ],
        { session }
      );
    });

    /* --------------------- Success ------------------------------ */
    res.status(200).json({
      status: "success",
      message: "Transaction completed successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  } finally {
    session.endSession();
  }
};

const transferMoneyToAccount = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { userId } = req.body.user; // set by auth middleware
    const { from_account, to_account, amount } = req.body;

    /* --------------------- Basic validation --------------------- */
    if (!(from_account && to_account && amount)) {
      return res.status(403).json({
        status: "failed",
        message: "Provide required fields (from_account, to_account, amount).",
      });
    }

    if (from_account === to_account) {
      return res.status(403).json({
        status: "failed",
        message: "from_account and to_account must differ.",
      });
    }

    const amtNumber = Number(amount);
    if (amtNumber <= 0) {
      return res.status(403).json({
        status: "failed",
        message: "Amount should be greater than 0.",
      });
    }

    const amtDec = mongoose.Types.Decimal128.fromString(amtNumber.toString());

    /* --------------------- Transaction begins ------------------- */
    await session.withTransaction(async () => {
      /* 1️⃣  Fetch both accounts inside the txn */
      const [fromAcc, toAcc] = await Promise.all([
        Account.findById(from_account).session(session),
        Account.findById(to_account).session(session),
      ]);

      if (!fromAcc || !toAcc) throw new Error("Account information not found.");

      // Current balances as JS numbers
      const fromBal = parseFloat(fromAcc.account_balance.toString());

      if (amtNumber > fromBal)
        throw new Error("Transfer failed. Insufficient account balance.");

      /* 2️⃣  Update balances atomically */
      fromAcc.account_balance = mongoose.Types.Decimal128.fromString(
        (fromBal - amtNumber).toString()
      );
      const toBal = parseFloat(toAcc.account_balance.toString());
      toAcc.account_balance = mongoose.Types.Decimal128.fromString(
        (toBal + amtNumber).toString()
      );

      await Promise.all([fromAcc.save({ session }), toAcc.save({ session })]);

      /* 3️⃣  Insert TWO transaction records */
      const expenseDesc = `Transfer (${fromAcc.account_name} → ${toAcc.account_name})`;
      const incomeDesc = `Received (${fromAcc.account_name} → ${toAcc.account_name})`;

      await Transaction.insertMany(
        [
          {
            user_id: userId,
            description: expenseDesc,
            type: "expense",
            status: "Completed",
            amount: amtDec,
            source: fromAcc.account_name,
          },
          {
            user_id: userId,
            description: incomeDesc,
            type: "income",
            status: "Completed",
            amount: amtDec,
            source: toAcc.account_name,
          },
        ],
        { session }
      );
    });

    /* --------------------- Success ------------------------------ */
    res.status(201).json({
      status: "success",
      message: "Transfer completed successfully",
    });
  } catch (err) {
    console.error(err);
    /* Map expected errors to original status codes */
    const mappedStatus =
      err.message === "Account information not found."
        ? 404
        : err.message.startsWith("Transfer failed")
        ? 403
        : 500;

    res.status(mappedStatus).json({
      status: "failed",
      message: err.message || "Internal server error.",
    });
  } finally {
    session.endSession(); // always end the session
  }
};

module.exports = {
  getTransactions,
  getDashboardInformation,
  addTransaction,
  transferMoneyToAccount,
};
