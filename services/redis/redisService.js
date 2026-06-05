

import redis from "./redisClient.js";

const DEFAULT_TIMEOUT = 500;

export class RedisService {


  static async withTimeout(
    promise,
    timeout = DEFAULT_TIMEOUT
  ) {

    return Promise.race([

      promise,

      new Promise((resolve) =>
        setTimeout(
          () => resolve(null),
          timeout
        )
      )

    ]);

  }



  static isReady() {

    return (
      redis &&
      redis.status === "ready"
    );

  }

  

  static async safeGet(
    key,
    timeout = DEFAULT_TIMEOUT
  ) {

    try {

      if (!this.isReady()) {
        return null;
      }

      const value =
        await this.withTimeout(
          redis.get(key),
          timeout
        );

      if (!value) {
        return null;
      }

      return JSON.parse(value);

    } catch (error) {

      console.error(
        `Redis GET failed for key ${key}:`,
        error.message
      );

      return null;

    }

  }



  static async safeSet(
    key,
    value,
    ttlInSeconds = 300,
    timeout = DEFAULT_TIMEOUT
  ) {

    try {

      if (!this.isReady()) {
        return false;
      }

      await this.withTimeout(

        redis.set(
          key,
          JSON.stringify(value),
          "EX",
          ttlInSeconds
        ),

        timeout

      );

      return true;

    } catch (error) {

      console.error(
        `Redis SET failed for key ${key}:`,
        error.message
      );

      return false;

    }

  }


  static async safeDelete(
    key,
    timeout = DEFAULT_TIMEOUT
  ) {

    try {

      if (!this.isReady()) {
        return false;
      }

      await this.withTimeout(
        redis.del(key),
        timeout
      );

      return true;

    } catch (error) {

      console.error(
        `Redis DELETE failed for key ${key}:`,
        error.message
      );

      return false;

    }

  }

  

  static async safeExists(
    key,
    timeout = DEFAULT_TIMEOUT
  ) {

    try {

      if (!this.isReady()) {
        return false;
      }

      const exists =
        await this.withTimeout(
          redis.exists(key),
          timeout
        );

      return Boolean(exists);

    } catch (error) {

      console.error(
        `Redis EXISTS failed for key ${key}:`,
        error.message
      );

      return false;

    }

  }

  

  static async safeExpire(
    key,
    ttlInSeconds,
    timeout = DEFAULT_TIMEOUT
  ) {

    try {

      if (!this.isReady()) {
        return false;
      }

      await this.withTimeout(

        redis.expire(
          key,
          ttlInSeconds
        ),

        timeout

      );

      return true;

    } catch (error) {

      console.error(
        `Redis EXPIRE failed for key ${key}:`,
        error.message
      );

      return false;

    }

  }

  // ======================================================
  // SAFE INCREMENT
  // Useful for:
  // OTP attempts
  // rate limiting
  // login attempts
  // ======================================================

  static async safeIncrement(
    key,
    timeout = DEFAULT_TIMEOUT
  ) {

    try {

      if (!this.isReady()) {
        return null;
      }

      return await this.withTimeout(
        redis.incr(key),
        timeout
      );

    } catch (error) {

      console.error(
        `Redis INCR failed for key ${key}:`,
        error.message
      );

      return null;

    }

  }

  // ======================================================
  // SAFE TTL
  // ======================================================

  static async safeTTL(
    key,
    timeout = DEFAULT_TIMEOUT
  ) {

    try {

      if (!this.isReady()) {
        return null;
      }

      return await this.withTimeout(
        redis.ttl(key),
        timeout
      );

    } catch (error) {

      console.error(
        `Redis TTL failed for key ${key}:`,
        error.message
      );

      return null;

    }

  }

  // ======================================================
  // SAFE FLUSH
  // ONLY FOR DEV/TESTING
  // ======================================================

  static async safeFlush() {

    try {

      if (!this.isReady()) {
        return false;
      }

      await redis.flushall();

      return true;

    } catch (error) {

      console.error(
        "Redis FLUSH failed:",
        error.message
      );

      return false;

    }

  }

  async safeDeletePattern(pattern) {

  try {

    const keys =
      await redis.keys(pattern);

    if (keys.length) {
      await redis.del(keys);
    }

    return true;

  } catch (error) {

    console.error(
      "Redis DELETE PATTERN error:",
      error
    );

    return false;

  }

}
}