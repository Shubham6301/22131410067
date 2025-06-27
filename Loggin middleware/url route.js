const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  getShortUrlStats,
  redirectToOriginal,
} = require("../controllers/urlController");

router.post("/", createShortUrl);
router.get("/:shortcode", getShortUrlStats);
router.get("/:shortcode/redirect", redirectToOriginal);

module.exports = router;
