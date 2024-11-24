import { Transaction } from "plaid";
import { TransactionModel, TransactionSyncModel } from "./db/schema";

export const processTransactionsSync = async () => {
  console.log('Processing transactions sync');
  const transactionsSync = await TransactionSyncModel.findOne({
    is_processed: {
      $ne: true
    }
  })

  if (!transactionsSync) {
    return;
  }

  const addedTransactions = transactionsSync.response.added as Transaction[];
  for (const transaction of addedTransactions) {
    await TransactionModel.updateOne({
      transaction_id: transaction.transaction_id,
      account_id: transaction.account_id,
      link_id: transactionsSync.link_id,
    },{
      amount: transaction.amount,
      iso_currency_code: transaction.iso_currency_code,
      unofficial_currency_code: transaction.unofficial_currency_code,
      category: transaction.category ?? [],
      date: new Date(transaction.date),
      merchant_name: transaction.merchant_name,
      location: transaction.location ?? {},
      logo_url: transaction.logo_url,
      payment_channel: transaction.payment_channel,
      personal_finance_category: transaction.personal_finance_category,
      raw: transaction,
    }, {
      upsert: true,
      new: true,
    });
  }

  await TransactionSyncModel.updateOne({
    _id: transactionsSync._id,
  }, {
    is_processed: true,
  });
  console.log('Processed transactions sync');
};
