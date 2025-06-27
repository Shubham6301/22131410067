const UrlDomain = require("../domains/urlDomain");
const urlRepository = require("../repositories/urlRepository");
const { generateShortCode } = require("../utils/utils");

exports.createShortUrl = async ({ url, validity = 30, shortcode }) => {
  const expiry = new Date(Date.now() + validity * 60000).toISOString();
  let code = shortcode || generateShortCode();

  const existingUrl = await urlRepository.findByShortcode(code);
  while (existingUrl) {
    code = generateShortCode();
  }

  const urlData = new UrlDomain(url, code, expiry, new Date());
  const savedUrl = await urlRepository.saveUrl(urlData);
  return {
    shortlink: `http://localhost:3000/${savedUrl.shortcode}/redirect`,
    expiry: savedUrl.expiry,
  };
};

exports.getShortUrlStats = async (shortcode) => {
  const url = await urlRepository.findByShortcode(shortcode);
  if (!url) throw new Error("Short URL not found");
  return {
    totalClicks: url.clicks.length,
    originalUrl: url.url,
    createdAt: url.createdAt,
    expiry: url.expiry,
    clicks: url.clicks,
  };
};

exports.redirectToOriginal = async (shortcode, req, res) => {
  const url = await urlRepository.findByShortcode(shortcode);
  if (!url || url.isExpired()) {
    res.status(410).json({ error: "Link expired or not found" });
    return;
  }

  await urlRepository.updateClicks(shortcode, {
    timestamp: new Date(),
    source: req.get("Referer") || "Direct",
    location: req.ip,
  });
  res.redirect(url.url);
};

exports.cleanupExpiredUrls = async () => {
  await urlRepository.deleteExpired();
};
