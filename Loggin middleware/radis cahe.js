const redis = require("redis");
const client = redis.createClient({
  url: "redis://localhost:6379", // Replace with your Redis URL
});

client.on("error", (err) => console.log("Redis Client Error", err));

const setCache = async (key, value, expirySeconds = 3600) => {
  await client.setEx(key, expirySeconds, JSON.stringify(value));
};

const getCache = async (key) => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

module.exports = { setCache, getCache };
