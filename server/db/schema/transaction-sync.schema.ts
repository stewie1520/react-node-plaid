import mongoose from "mongoose";

const transactionSyncSchema = new mongoose.Schema({
  link_id: {
    type: 'ObjectId',
    required: true,
    ref: 'Link',
  },
  response: {
    type: Object,
    required: true,
  },
  is_processed: {
    type: Boolean,
    required: false,
    default: false,
  }
}, {
  timestamps: true,
});

/**
 * @description Store the response from the Plaid API when syncing transactions
 */
export const TransactionSyncModel = mongoose.model("TransactionSync", transactionSyncSchema);
