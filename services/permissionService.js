import { PermissionRepository }
from "../repository/permissionRepo.js";
import { prisma } from "../index.js";
import { RoleRepository }
from "../repository/roleRepo.js";

import { RedisService }
from "./redis/redisService.js";

const repo = new PermissionRepository();

const roleRepo = new RoleRepository();

export class PermissionService {

  async createPermission(data) {

    const existing =
      await repo.findByName(data.name);

    if (existing) {
      throw new Error(
        "Permission already exists"
      );
    }

    return repo.create({
      ...data,
      name: data.name.toLowerCase()
    });
  }

  async getPermissions() {
    return repo.findAll();
  }

  async assignPermissionToRole(
    roleId,
    permissionId
  ) {

    const role =
      await roleRepo.findById(roleId);

    if (!role) {
      throw new Error(
        "Role not found"
      );
    }

    const permission =
      await repo.findById(permissionId);

    if (!permission) {
      throw new Error(
        "Permission not found"
      );
    }

    const existing =
      await repo.roleHasPermission(
        roleId,
        permissionId
      );

    if (existing) {
      throw new Error(
        "Permission already assigned"
      );
    }

    const result =
      await repo.assignToRole(
        roleId,
        permissionId
      );

    // CLEAR CACHE
    await RedisService.safeDelete(
      `role_permissions:${roleId}`
    );

    return result;
  }

  async removePermissionFromRole(
    roleId,
    permissionId
  ) {

    await repo.removeFromRole(
      roleId,
      permissionId
    );

    await RedisService.safeDelete(
      `role_permissions:${roleId}`
    );

    return true;
  }

//   async getRolePermissions(roleId) {

//     const cacheKey =
//       `role_permissions:${roleId}`;

//     const cached =
//       await RedisService.safeGet(
//         cacheKey
//       );

//     if (cached) {
//       return cached;
//     }

//     const permissions =
//       await repo.getRolePermissions(
//         roleId
//       );

//     await RedisService.safeSet(
//       cacheKey,
//       permissions,
//       600
//     );

//     return permissions;
//   }
async getRolePermissions(roleId) {

  const cacheKey =
    `role_permissions:${roleId}`;

  // TRY CACHE FIRST
  try {

    const cached =
      await RedisService.safeGet(
        cacheKey
      );

    if (cached) {
      return cached;
    }

  } catch (error) {

    console.error(
      "Redis cache read failed:",
      error.message
    );

  }

  // FALLBACK TO DATABASE
  const permissions =
    await repo.getRolePermissions(
      roleId
    );

  // TRY TO CACHE AGAIN
  try {

    await RedisService.safeSet(
      cacheKey,
      permissions,
      600
    );

  } catch (error) {

    console.error(
      "Redis cache write failed:",
      error.message
    );

  }

  return permissions;
}

  async assignPermissionsToRole(
  roleId,
  permissionIds
) {

  const role =
    await roleRepo.findById(roleId);

  if (!role) {
    throw new Error("Role not found");
  }

  const permissions =
    await prisma.permission.findMany({
      where: {
        id: {
          in: permissionIds
        }
      }
    });

  if (
    permissions.length !==
    permissionIds.length
  ) {
    throw new Error(
      "Some permissions are invalid"
    );
  }

  const result =
    await repo.assignManyToRole(
      roleId,
      permissionIds
    );

  // CLEAR CACHE
  await RedisService.safeDelete(
    `role_permissions:${roleId}`
  );

  return result;
}

async removePermissionsFromRole(
  roleId,
  permissionIds
) {

  const result =
    await repo.removeManyFromRole(
      roleId,
      permissionIds
    );

  await RedisService.safeDelete(
    `role_permissions:${roleId}`
  );

  return result;
}

async syncRolePermissions(
  roleId,
  permissionIds
) {

  const role =
    await roleRepo.findById(roleId);

  if (!role) {
    throw new Error("Role not found");
  }

  await repo.syncRolePermissions(
    roleId,
    permissionIds
  );

  await RedisService.safeDelete(
    `role_permissions:${roleId}`
  );

  return true;
}

}