// role.service.ts

import { RoleRepository } from "../repository/roleRepo.js";

const repo = new RoleRepository();

export class RoleService {

  async createRole(data) {

    const existing = await repo.findByName(data.name);

    if (existing) {
      throw new Error("Role already exists");
    }

    return repo.create(data);
  }

  async getRoles() {
    return repo.findAll();
  }

  async updateRole(id, data) {

    const role = await repo.findById(id);

    if (!role) {
      throw new Error("Role not found");
    }

    return repo.update(id, data);
  }

  async deleteRole(id) {

    const role = await repo.findById(id);

    if (!role) {
      throw new Error("Role not found");
    }

    if (role.name === "member" || role.name === "system") {
      throw new Error("Default roles cannot be deleted");
    }

    return repo.delete(id);
  }

}