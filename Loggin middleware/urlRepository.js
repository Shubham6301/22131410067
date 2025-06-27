const ShortUrl = require("../models/ShortUrl");
const { getCache, setCache } = require("../cache/redisCache");

class UrlRepository {
  async saveUrl(urlData) {
    const cacheKey = `url:${urlData.shortcode}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const shortUrl = new ShortUrl(urlData);
    await shortUrl.save();
    await setCache(cacheKey, shortUrl);
    return shortUrl;
  }

  async findByShortcode(shortcode) {
    const cacheKey = `url:${shortcode}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const url = await ShortUrl.findOne({ shortcode });
    if (url) await setCache(cacheKey, url);
    return url;
  }

  async updateClicks(shortcode, clickData) {
    const url = await ShortUrl.findOneAndUpdate(
      { shortcode },
      { $push: { clicks: clickData } },
      { new: true }
    );
    await setCache(`url:${shortcode}`, url);
    return url;
  }

  async deleteExpired() {
    const result = await ShortUrl.deleteMany({ expiry: { $lt: new Date() } });
    return result;
  }
}

module.exports = new UrlRepository();
