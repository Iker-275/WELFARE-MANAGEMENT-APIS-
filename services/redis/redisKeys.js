import { REDIS_PREFIXES } from "../../config/redisConstants.js";

export const RedisKeys = {
  user: (id) =>
    `${REDIS_PREFIXES.USER}:${id}`,

  session: (id) =>
    `${REDIS_PREFIXES.SESSION}:${id}`,

  otp: (email) =>
    `${REDIS_PREFIXES.OTP}:${email}`,

  rolePermissions: (roleId) =>
    `${REDIS_PREFIXES.PERMISSION}:${roleId}`,

  regionUsers: (regionId) =>
    `${REDIS_PREFIXES.REGION}:${regionId}`,

  roleUsers: (roleId) =>
    `${REDIS_PREFIXES.ROLE}:${roleId}`,
};