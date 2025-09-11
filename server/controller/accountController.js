const Account = require("../models/AccountModel");
const User = require("../models/UserModel");
const Transaction = require("../models/TransactionModel");
const mongoose = require("mongoose");

const getAccounts = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const accounts = await Account.find({
      user_id: userId,
    });

    res.status(200).json({
      status: "success",
      data: accounts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

const createAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;

    const { name, amount, account_number } = req.body;

    const accountExists = await Account.findOne({
      user_id: userId,
      account_name: name,
    });

    if (accountExists) {
      return res.status(400).json({
        status: "failed",
        msg: "Account already created.",
      });
    }

    const newAccount = new Account({
      user_id: userId,
      account_name: name,
      account_number,
      account_balance: amount,
    });

    const savedAccount = await newAccount.save();

    // Update the user's accounts array with the new account's name
    const user = await User.findById(userId);
    user.accounts = Array.isArray(user.accounts)
      ? [...user.accounts, name]
      : [name];
    await user.save();

    // Add initial deposit transaction
    const description = `${savedAccount.account_name} (Initial Deposit)`;

    const newTransaction = new Transaction({
      user_id: userId,
      description,
      type: "income",
      status: "Completed",
      amount,
      source: savedAccount.account_name,
    });

    await newTransaction.save();

    res.status(201).json({
      status: "success",
      message: `${savedAccount.account_name} Account created successfully`,
      data: savedAccount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

const addMoneyToAccount = async (req, res) => {
  try {
    const { userId } = req.body.user;
    const { id } = req.params; // Account ID
    const { amount } = req.body;

    const newAmount = Number(amount);

    // Find the account by ID
    const account = await Account.findById(id);

    if (!account) {
      return res.status(404).json({
        status: "failed",
        message: "Account not found.",
      });
    }

    // Update account balance
    account.account_balance = mongoose.Types.Decimal128.fromString((parseFloat(account.account_balance.toString()) + Number(newAmount)).toString());
    // account.updatedAt = new Date(); // Manually updating the `updatedAt` field
    const updatedAccount = await account.save();

    // Create a transaction for the deposit
    const description = `${updatedAccount.account_name} (Deposit)`;

    const newTransaction = new Transaction({
      user_id: userId,
      description,
      type: "income",
      status: "Completed",
      amount: newAmount,
      source: updatedAccount.account_name,
    });

    await newTransaction.save();

    res.status(200).json({
      status: "success",
      message: "Operation completed successfully",
      data: updatedAccount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

module.exports = { getAccounts, createAccount, addMoneyToAccount };
