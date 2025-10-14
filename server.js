import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.get('/countries', async (req, res) => {
  const countries = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
  const data = await countries.json();
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});