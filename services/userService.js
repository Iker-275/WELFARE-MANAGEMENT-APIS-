// services/userService.js

import { UserRepository }
from "../repository/userRepo.js";

import { UserCache }
from "../utils/userCache.js";

const repo =
  new UserRepository();

export class UserService {

  // ======================================================
  // GET USER
  // ======================================================

  async getUserById(id) {

    const cached =
      await UserCache.getUser(id);

    if (cached) {
      return cached;
    }

    const user =
      await repo.findById(id);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    await UserCache.setUser(
      id,
      user
    );

    return user;

  }

  // ======================================================
  // UPDATE USER
  // ======================================================

  async updateUser(
    id,
    data,
    updatedById
  ) {

    const existing =
      await repo.findById(id);

    if (!existing) {
      throw new Error(
        "User not found"
      );
    }

    const updated =
      await repo.update(id, {

        ...data,

        updatedById,

      });

    await UserCache.invalidateUser(
      id
    );

    return updated;

  }

  // ======================================================
  // ACTIVATE USER
  // ======================================================

  async activateUser(id) {

    const user =
      await repo.findById(id);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    const updated =
      await repo.toggleActive(
        id,
        true
      );

    await UserCache.invalidateUser(
      id
    );

    return updated;

  }

  // ======================================================
  // DEACTIVATE USER
  // ======================================================

  async deactivateUser(id) {

    const user =
      await repo.findById(id);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    const updated =
      await repo.toggleActive(
        id,
        false
      );

    await UserCache.invalidateUser(
      id
    );

    return updated;

  }

  // ======================================================
  // GET USERS
  // ======================================================

  async getUsers(filters) {

    return repo.findMany(filters);

  }

}