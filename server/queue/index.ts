import BeeQueue from "bee-queue";

export const syncTransactionQueue = new BeeQueue("sync-transaction-queue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!, 10),
  },
  removeOnSuccess: true,
});

syncTransactionQueue.on('ready', () => {
  console.log(`[${syncTransactionQueue.name}] ready`);
});

syncTransactionQueue.on('retrying', (job, err) => {
  console.log(
    `[${syncTransactionQueue.name}] retrying job ${job.id} with error ${err.message}`
  );
});

syncTransactionQueue.on('failed', (job, err) => {
  console.log(
    `[${syncTransactionQueue.name}] failed job ${job.id} with error ${err.message}`
  );
});

syncTransactionQueue.on('succeeded', (job, result) => {
  console.log(
    `[${syncTransactionQueue.name}] succeeded job ${job.id} with result ${result}`
  );
});
