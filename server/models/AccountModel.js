const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    account_name: {
      type: String,
      required: true,
    },
    account_number: {
      type: String,
      required: true,
    },
    account_balance: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    }
  },
  { timestamps: true } // This will automatically add `createdAt` and `updatedAt`
);

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
