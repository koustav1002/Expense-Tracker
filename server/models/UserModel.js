const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: false,
    },
    accounts: {
      type: [String], // Array of strings
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    currency: {
      type: String,
      default: '₹',
      required: false,
    },
  },
  { timestamps: true } // This will automatically add `createdAt` and `updatedAt`
);

const User = mongoose.model("User", userSchema);

module.exports = User;
