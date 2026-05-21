import redis from "./redisClient.js";

export const RedisService = {
    async safeGet(key) {
        try {
            const value = await redis.get(key);

            if (!value) return null;

            return JSON.parse(value);
        } catch (error) {
            console.error("Redis GET error:", error);

            return null;
        }
    },

    async safeSet( key,value,ttlInSeconds = 300 ) {
        try {
            await redis.set( key, JSON.stringify(value), "EX", ttlInSeconds );

            return true;
        } catch (error) {
            console.error("Redis SET error:", error);

            return false;
        }
    },

    async safeDelete(key) {
        try {
            await redis.del(key);

            return true;
        } catch (error) {
            console.error("Redis DELETE error:", error);

            return false;
        }
    },

    async safeExists(key) {
        try {
            return await redis.exists(key);
        } catch (error) {
            console.error("Redis EXISTS error:", error);

            return false;
        }
    },

    async safeExpire(key, ttlInSeconds) {
        try {
            return await redis.expire(
                key,
                ttlInSeconds
            );
        } catch (error) {
            console.error("Redis EXPIRE error:", error);

            return false;
        }
    },
};