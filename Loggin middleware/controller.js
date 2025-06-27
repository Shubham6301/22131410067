const {
  createShortUrl,
  getShortUrlStats,
  redirectToOriginal,
} = require("../services/urlService");
const { handleError } = require("../handlers/errorHandler");

exports.createShortUrl = async (req, res) => {
  try {
    const result = await createShortUrl(req.body);
    res.status(201).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getShortUrlStats = async (req, res) => {
  try {
    const stats = await getShortUrlStats(req.params.shortcode);
    res.json(stats);
  } catch (error) {
    handleError(res, error);
  }
};

exports.redirectToOriginal = async (req, res) => {
  try {
    await redirectToOriginal(req.params.shortcode, req, res);
  } catch (error) {
    handleError(res, error);
  }
};
