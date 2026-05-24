import IORedis from "ioredis";

export const bullRedisConnection =
  new IORedis({

    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,

    password: process.env.REDIS_PASSWORD,

    maxRetriesPerRequest: null,

    enableReadyCheck: false,

    retryStrategy(times) {

      return Math.min(
        times * 50,
        2000
      );

    },

  });