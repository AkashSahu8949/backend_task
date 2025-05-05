import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import Record from './models/Record.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
const REDIS_URL = process.env.REDIS_URL;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const redisClient = createClient({ url: REDIS_URL });
await redisClient.connect();

await redisClient.subscribe('record_created', async (message) => {
  try {
    const data = JSON.parse(message);
    const record = new Record({ ...data, modified_at: new Date() });
    await record.save();
    console.log('Record saved in listener-db:', record);
  } catch (err) {
    console.error('Error processing message:', err);
  }
});

app.listen(PORT, () => console.log(`Listener Service running on port ${PORT}`));
