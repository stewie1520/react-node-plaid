import { isAxiosError } from 'axios';
import cors from 'cors';
import express from 'express';
import { CountryCode, Products } from 'plaid';
import { connectDb } from './db';
import { LinkModel, TransactionModel } from './db/schema';
import { plaidClient } from './plaid-client';
import { syncTransactionQueue } from './queue';
import { processTransactionsSync } from './process-transactions-sync';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(express.json());

connectDb();

app.post('/api/create_link_token', async (_, res) => {
  try {
    const alreadyLink = await LinkModel.countDocuments().then(count => count > 0);
    if (alreadyLink) {
      res.status(400).json({ error: 'Link already exists' });
      return;
    }

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-' + Math.random().toString(36).substring(2, 15) },
      client_name: 'Plaid Connect App',
      products: [Products.Transactions, Products.Auth],
      country_codes: [CountryCode.Us],
      language: 'en',
      webhook: 'https://webhook.example.com',
    });
    
    res.json({ link_token: response.data.link_token });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error('Error creating link token:', error);
      res.status(500).json({ 
        error: error.response?.data?.error_message || error.message 
      });
      return;
    }

    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const bodySchema = z.object({
  publicToken: z.string(),
});

app.post('/api/exchange_public_token', async (req, res) => {
  try {
    const { success, data: body } = await bodySchema.safeParseAsync(req.body);
    if (!success) {
      res.status(400).json({ error: 'Invalid body parameters' });
      return;
    }

    const response = await plaidClient.itemPublicTokenExchange({
      public_token: body.publicToken,
    });
    
    const token = response.data.access_token;
    const link = await LinkModel.create({ token });

    await syncTransactionQueue
      .createJob({ id: link._id })
      .backoff('exponential', 1000)
      .retries(10)
      .save()
    
    res.json({ success: true });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error exchanging public token:', error);
      res.status(500).json({ 
        error: error.response?.data?.error_message || error.message 
      });
      return;
    }

    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/api/check_linked', async (_, res) => {
  try {
    const linkedRow = await LinkModel.countDocuments();

    if (!linkedRow) {
      res.json({ linked: false });
      return;
    }
    
    res.json({ linked: true });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Error checking linked status:', error);
      res.status(500).json({ 
        error: error.response?.data?.error_message || error.message 
      });
      return;
    }

    console.error('Error checking linked status:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.delete('/api/clear_link', async (_, res) => {
  try {
    await LinkModel.deleteMany({});
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

const querySchema = z.object({
  page: z.preprocess(
    Number,
    z.number()
  ),
  per_page: z.preprocess(
    Number,
    z.number()
  ),
})
app.get('/api/transactions', async (req, res) => {
  try {
    const { success, data: query  } = await querySchema.safeParseAsync(req.query);
    if (!success) {
      res.status(400).json({ error: 'Invalid query parameters' });
      return;
    }

    const { page, per_page } = query;
    const offset = (page - 1) * per_page;

    const link = await LinkModel.findOne();
    if (!link) {
      res.json({ items: [], page, per_page, has_more: false, });
      return;
    }

    const [transactions, count] = await Promise.all([
      TransactionModel
        .find({
          link_id: link._id,
        })
        .select("-raw")
        .limit(per_page).skip(offset).sort({ date: -1 }),
      TransactionModel.countDocuments({ link_id: link._id }),
    ]);

    return res.json({ items: transactions, page, per_page, has_more: count > offset + transactions.length });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

setInterval(async () => {
  await processTransactionsSync();
}, 1000 * 60 * 1);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});