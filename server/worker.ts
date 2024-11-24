import { Job } from "bee-queue";
import { LinkModel, SyncMetaModel, TransactionSyncModel } from "./db/schema";
import { syncTransactionQueue } from "./queue";
import { plaidClient } from "./plaid-client";
import { isAxiosError } from "axios";
import { connectDb } from "./db";


async function getNextCursor(id: string) {
  const meta = await SyncMetaModel.findOne({
    link_id: id,
  });

  return meta?.next_cursor;
}

async function setNextCursor(id: string, cursor: string) {
  await SyncMetaModel.updateOne(
    { link_id: id },
    { next_cursor: cursor, $setOnInsert: { initial_cursor: cursor } },
    { upsert: true },
  );
}

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function resetSyncProcess(id: string) {
  await SyncMetaModel.deleteOne({
    link_id: id,
  });

  await TransactionSyncModel.deleteMany({
    link_id: id,
  });
}

syncTransactionQueue.process(async (job: Job<{ id: string }>) => {
  try {
    await connectDb();
    console.log(`[${syncTransactionQueue.name}] Processing job ${job.id}`);
    const link = await LinkModel.findById(job.data.id);
    if (!link) {
      throw new Error('Link not found');
    }

    let nextCursor = await getNextCursor(link._id.toString());
    
    while(true) {
      await sleep(3000);
      const query: Record<string, string> = {};
      if (nextCursor) {
        query['cursor'] = nextCursor;
      }

      const response = await plaidClient.transactionsSync({
        ...query,
        access_token: link.token,
      })

      nextCursor = response.data.next_cursor;
      await setNextCursor(link._id.toString(), nextCursor);

      await TransactionSyncModel.create({
        link_id: link._id,
        response: response.data,
      })

      if (!response.data.has_more) {
        break;
      }
    }
  } catch (error) {
    if (isAxiosError(error)) {
      const errorCode = error.response?.data?.error_code;
      if (errorCode === 'TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION') {
        await resetSyncProcess(job.data.id);
        throw new Error('TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION');
      }

      return;
    }

    console.error('Error processing job:', error);
  }
});
