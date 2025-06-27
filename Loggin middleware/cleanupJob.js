const cron = require("node-cron");
const { cleanupExpiredUrls } = require("../services/urlService");

exports.startCleanupJob = () => {
  cron.schedule(
    "0 * * * *",
    () => {
      console.log("Running cleanup job at", new Date().toISOString());
      cleanupExpiredUrls();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
};
