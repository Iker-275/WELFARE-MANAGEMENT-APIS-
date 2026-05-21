import { RedisService }
from "../services/redis/redisService.js";

import { prisma }
from "../index.js";

export const authorize =
(...requiredPermissions) => {

  return async (
    req,
    res,
    next
  ) => {

    try {

      const user = req.user;

      if (!user?.roleId) {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }

      const cacheKey =
        `role_permissions:${user.roleId}`;

      let permissions =
        await RedisService.safeGet(
          cacheKey
        );

      if (!permissions) {

        const rolePermissions =
          await prisma.rolePermission.findMany({
            where: {
              roleId: user.roleId
            },

            include: {
              permission: true
            }
          });

        permissions =
          rolePermissions.map(
            rp => rp.permission.name
          );

        await RedisService.safeSet(
          cacheKey,
          permissions,
          600
        );
      }

      const hasPermission =
        requiredPermissions.every(
          permission =>
            permissions.includes(
              permission
            )
        );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message:
            "Insufficient permissions"
        });
      }

      next();

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          "Authorization failed"
      });

    }

  };

};