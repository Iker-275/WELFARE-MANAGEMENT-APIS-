import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),

  password: process.env.REDIS_PASSWORD || undefined,

  maxRetriesPerRequest: null,

  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);

    console.log(
      `Redis reconnecting attempt ${times}`
    );

    return delay;
  },

  reconnectOnError(err) {
    console.log("Redis reconnect error:", err);

    return true;
  },
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

redis.on("close", () => {
  console.log("Redis connection closed");
});

export default redis;