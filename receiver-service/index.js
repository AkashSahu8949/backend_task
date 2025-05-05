import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import Record from './models/Record.js';

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const REDIS_URL = process.env.REDIS_URL;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const redisClient = createClient({ url: REDIS_URL });
await redisClient.connect();

const schema = Joi.object({
  user: Joi.string().required(),
  class: Joi.string().required(),
  age: Joi.number().integer().required(),
  email: Joi.string().email().required(),
});

app.post('/receiver', async (req, res) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const record = new Record({
      id: uuidv4(),
      ...value,
      inserted_at: new Date()
    });

    await record.save();
    await redisClient.publish('record_created', JSON.stringify(record));
    res.status(201).json({ message: 'Record saved and event published', record });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log(`Receiver Service running on port ${PORT}`));
