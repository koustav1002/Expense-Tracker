const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to User model
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'], // Possible values for status
      default: 'Pending',
    },
    source: {
      type: String,
      required: true,
      maxlength: 100, // Limiting the source string to 100 characters
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128, // Using Decimal128 for precision with numbers
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'], // Possible types of transactions
      default: 'income',
    },
  },
  { 
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
