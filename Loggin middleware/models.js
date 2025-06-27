const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  source: String,
  location: String,
});

const shortUrlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  expiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: [clickSchema],
});

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
