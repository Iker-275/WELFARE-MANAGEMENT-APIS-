// cache/userCache.js

import { RedisService }
from "../services/redis/redisService.js";

export const UserCache = {

  getUserKey(id) {
    return `user:${id}`;
  },

  async getUser(id) {

    return RedisService.safeGet(
      this.getUserKey(id)
    );

  },

  async setUser(id, data) {

    return RedisService.safeSet(
      this.getUserKey(id),
      data,
      600
    );

  },

  async invalidateUser(id) {

    return RedisService.safeDelete(
      this.getUserKey(id)
    );

  },

};