const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const loggingMiddleware = require('./loggingMiddleware'); 
const ShortUrl = require('./models/ShortUrl');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/urlshortener', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(loggingMiddleware);

const generateShortCode = () => Math.random().toString(36).substring(2, 8);

app.post('/shorturls', async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  const expiry = new Date(Date.now() + validity * 60000).toISOString();

  let code = shortcode || generateShortCode();
  while (await ShortUrl.findOne({ shortcode: code })) {
    code = generateShortCode();
  }

  const shortUrl = new ShortUrl({ url, shortcode: code, expiry, createdAt: new Date() });
  await shortUrl.save();

  res.status(201).json({
    shortlink: `http://localhost:${PORT}/${code}`,
    expiry
  });
});

app.get('/shorturls/:shortcode', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ shortcode: req.params.shortcode });
  if (!shortUrl) return res.status(404).json({ error: 'Short URL not found' });

  res.json({
    totalClicks: shortUrl.clicks.length,
    originalUrl: shortUrl.url,
    createdAt: shortUrl.createdAt,
    expiry: shortUrl.expiry,
    clicks: shortUrl.clicks
  });
});

app.get('/:shortcode', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ shortcode: req.params.shortcode });
  if (!shortUrl || new Date() > new Date(shortUrl.expiry)) {
    return res.status(410).json({ error: 'Link expired or not found' });
  }

  shortUrl.clicks.push({
    timestamp: new Date(),
    source: req.get('Referer') || 'Direct',
    location: req.ip
  });
  await shortUrl.save();

  res.redirect(shortUrl.url);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));