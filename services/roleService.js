import { RoleRepository } from "../repository/roleRepo.js";

import { RedisService } from "./redis/redisService.js";

import {
  ROLE_CACHE_KEY,
  ROLE_CACHE_TTL,
  SYSTEM_ROLES
} from "../config/rolesConstants.js";

const repo = new RoleRepository();

export class RoleService {

  async createRole(data) {

    const existing = await repo.findByName(data.name);

    if (existing) {
      throw new Error("Role already exists");
    }

    const role = await repo.create({
      ...data,
      name: data.name.toLowerCase()
    });

    await RedisService.safeDelete(ROLE_CACHE_KEY);

    return role;
  }

  async getRoles() {

    const cachedRoles =
      await RedisService.safeGet(ROLE_CACHE_KEY);

    if (cachedRoles) {
      return cachedRoles;
    }

    const roles = await repo.findAll();

    await RedisService.safeSet(
      ROLE_CACHE_KEY,
      roles,
      ROLE_CACHE_TTL
    );

    return roles;
  }

  async updateRole(id, data) {

    const role = await repo.findById(id);

    if (!role) {
      throw new Error("Role not found");
    }

    if (
      data.name &&
      data.name !== role.name
    ) {
      const existing = await repo.findByName(
        data.name
      );

      if (existing) {
        throw new Error("Role name already exists");
      }
    }

    if (
      SYSTEM_ROLES.includes(role.name)
    ) {
      throw new Error(
        "System roles cannot be modified"
      );
    }

    const updatedRole = await repo.update(id, {
      ...data,
      name: data.name?.toLowerCase()
    });

    await RedisService.safeDelete(ROLE_CACHE_KEY);

    return updatedRole;
  }

  async deleteRole(id) {

    const role = await repo.findById(id);

    if (!role) {
      throw new Error("Role not found");
    }

    if (role.isSystem
     // SYSTEM_ROLES.includes(role.name)
    ) {
      throw new Error(
        "System roles cannot be deleted"
      );
    }

    const hasUsers =
      await repo.roleHasUsers(id);

    if (hasUsers) {
      throw new Error(
        "Cannot delete role assigned to users"
      );
    }

    await repo.delete(id);

    await RedisService.safeDelete(ROLE_CACHE_KEY);

    return true;
  }

}