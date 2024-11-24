import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  link_id: {
    type: 'ObjectId',
    required: true,
    ref: 'Link',
  },
  account_id: {
    type: String,
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  iso_currency_code: {
    type: String,
    required: false,
  },
  unofficial_currency_code: {
    type: String,
    required: false,
  },
  category: {
    type: [String],
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  merchant_name: {
    type: String,
    required: false,
  },
  location: {
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
  },
  logo_url: {
    type: String,
    required: false,
  },
  payment_channel: {
    type: String,
    required: true,
  },
  // optional field
  personal_finance_category: {
    primary: {
      type: String,
      required: true,
    },
    detailed: {
      type: String,
      required: true,
    },
  },
  raw: {
    type: Object,
    required: true,
  }
}, {
  timestamps: true,
});

// add getter
transactionSchema.virtual('currency').get(function() {
  return (this.iso_currency_code ?? this.unofficial_currency_code) as string;
});

export const TransactionModel = mongoose.model("Transaction", transactionSchema);
