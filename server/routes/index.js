const express = require("express");
const authRoutes = require("./authRoutes.js");
const accountRoutes = require('./accountRoutes.js');
const userRoutes = require("./userRoutes.js");
const transactionRoutes = require('./transactionRoutes.js');

const router = express.Router();

router.use("/auth", authRoutes);
router.use('/account',accountRoutes);
router.use("/user", userRoutes);
router.use('/transactions',transactionRoutes);

module.exports = router;
