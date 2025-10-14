import express from 'express';
import { createClient } from 'redis';

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = createClient();

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

await redisClient.connect();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.get('/countries', async (req, res) => {
  const cacheKey = 'countries';
  const cachedData = await redisClient.get(cacheKey);

  if (cachedData) {
    console.log('Serving from cache');
    return res.json(JSON.parse(cachedData));
  }
  const countries = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
  const data = await countries.json();
  console.log(data.length);
  await redisClient.set(cacheKey, JSON.stringify(data), {
    EX: 30,
  });
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});