// // services/userService.js

// import { UserRepository } from "../repository/userRepo.js";
// import { UserCache } from "../utils/userCache.js";
// import { ProfileCompletionService } from "./profileCompletionService.js";
// import { AuditService } from "./auditService.js";
// import { AuthRepository } from "../repository/authRepo.js";

// const repo = new UserRepository();
// const profileService = new ProfileCompletionService();

// export class UserService {

//   // ======================================================
//   // GET USER
//   // ======================================================

//   async getUserById(id) {

//     const cached = await UserCache.getUser(id);

//     if (cached) {
//       return cached;
//     }

//     const user = await repo.findById(id);

//     if (!user) {
//       throw new Error(
//         "User not found"
//       );
//     }

//     await UserCache.setUser(id, user);

//     return user;

//   }

//   // ======================================================
//   // UPDATE USER
//   // ======================================================

//   async updateUser(id, data, updatedById) {

//     const existing = await repo.findById(id);

//     if (!existing) {
//       throw new Error("User not found");
//     }

//     const updated = await repo.update(id, {

//       ...data,

//       updatedById,

//     });

//     await profileService.evaluate(id);

//     await UserCache.invalidateUser(id);

//     return updated;

//   }

//   // ======================================================
//   // ACTIVATE USER
//   // ======================================================

//   async activateUser2(id) {

//     const user = await repo.findById(id);

//     if (!user) {
//       throw new Error("User not found");
//     }

//     const updated = await repo.toggleActive(id, true);

//     await UserCache.invalidateUser(id);

//     return updated;

//   }

//   async deactivateUser(id, reason, adminId) {

//     const user = await repo.findById(id);

//     if (!user) {
//       throw new Error("User not found");
//     }

//     if (!user.isActive) {
//       throw new Error("User already deactivated");
//     }

//     // DEACTIVATE

//     const updated = await repo.deactivate(id, {
//       reason,
//       deactivatedById: adminId,
//     });

//     // REVOKE SESSIONS

//     await AuthRepository.revokeUserSessions(id);

//     // CLEAR CACHE

//     await UserCache.invalidateUser(id);

//     // AUDIT EVENT

//     await AuditService.log({
//       action: "USER_DEACTIVATED",
//       entityType: "User",
//       entityId: id,
//       performedById: adminId,

//       metadata: {
//         reason,
//       },

//     });

//     return updated;

//   }

//   // ======================================================
//   // DEACTIVATE USER
//   // ======================================================

//   async deactivateUser2(id) {

//     const user = await repo.findById(id);

//     if (!user) {
//       throw new Error("User not found");
//     }

//     const updated = await repo.toggleActive(
//       id,
//       false
//     );

//     await UserCache.invalidateUser(id);

//     return updated;

//   }

//   async activateUser(id, adminId) {

//     const user = await repo.findById(id);

//     if (!user) {
//       throw new Error("User not found");
//     }

//     const updated = await repo.activate(id);

//     await UserCache.invalidateUser(id);

//     await AuditService.log({
//       action: "USER_ACTIVATED",
//       entityType: "User",
//       entityId: id,
//       performedById: adminId,
//     });

//     return updated;

//   }


//   // ======================================================
//   // GET USERS
//   // ======================================================

//   // async getUsers(filters) {

//   //   return repo.findMany(filters);

//   // }

//   async getUsers(query) {

//   return repo.findUsers(query);

// }

// }



import { UserRepository }
  from "../repository/userRepo.js";

import { ProfileCompletionService }
  from "./profileCompletionService.js";

import { AuditService }
  from "./auditService.js";

import { AuthRepository }
  from "../repository/authRepo.js";

import { RedisService }
  from "./redis/redisService.js";

import {
  USER_CACHE_KEYS,
  USER_CACHE_TTL,
} from "../config/userConstants.js";
import { FileRepository } from "../repository/fileRepo.js";

const repo = new UserRepository();

const profileService =
  new ProfileCompletionService();

const fileRepo = new FileRepository();

export class UserService {

  // ======================================================
  // GET USER
  // ======================================================

  async getUserById(id) {

    const cacheKey =
      USER_CACHE_KEYS.PROFILE(id);

    // CACHE

    const cached =
      await RedisService.safeGet(
        cacheKey
      );

    if (cached) {
      return cached;
    }

    // DATABASE

    const user =
      await repo.findById(id);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    // STORE CACHE

    await RedisService.safeSet(
      cacheKey,
      user,
      USER_CACHE_TTL.PROFILE
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

    // PROFILE COMPLETION

    await profileService.evaluate(id);

    // CLEAR CACHE

    await RedisService.safeDelete(
      USER_CACHE_KEYS.PROFILE(id)
    );
    //review later
    // await RedisService.safeDeletePattern(
    //   "users:list:*"
    // );
    // AUDIT

    await AuditService.log({

      action: "USER_UPDATED",

      module: "users",

      entityType: "User",

      entityId: id,

      performedById:
        updatedById,

      oldValues: existing,

      newValues: updated,

    });

    return updated;

  }

  // ======================================================
  // ACTIVATE USER
  // ======================================================

  async activateUser(
    id,
    adminId
  ) {

    const user =
      await repo.findById(id);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    const updated =
      await repo.activate(id);

    // CLEAR CACHE

    await RedisService.safeDelete(
      USER_CACHE_KEYS.PROFILE(id)
    );

    // AUDIT

    await AuditService.log({

      action:
        "USER_ACTIVATED",

      module: "users",

      entityType: "User",

      entityId: id,

      performedById:
        adminId,

    });

    return updated;

  }

  // ======================================================
  // DEACTIVATE USER
  // ======================================================

  async deactivateUser(
    id,
    reason,
    adminId
  ) {

    const user =
      await repo.findById(id);

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    if (!user.isActive) {
      throw new Error(
        "User already deactivated"
      );
    }

    // DEACTIVATE

    const updated =
      await repo.deactivate(id, {

        reason,

        deactivatedById:
          adminId,

      });

    // REVOKE SESSIONS

    await AuthRepository
      .revokeUserSessions(id);

    // CLEAR CACHE

    await RedisService.safeDelete(
      USER_CACHE_KEYS.PROFILE(id)
    );

    // AUDIT

    await AuditService.log({

      action:
        "USER_DEACTIVATED",

      module: "users",

      entityType: "User",

      entityId: id,

      performedById:
        adminId,

      metadata: {
        reason,
      },

    });

    return updated;

  }

  // ======================================================
  // GET USERS
  // ======================================================

  async getUsers(query) {

    const cacheKey = USER_CACHE_KEYS.LIST(query);

    // CACHE

    const cached = await RedisService.safeGet(cacheKey);

    if (cached) {
      return cached;
    }

    // DATABASE

    const users = await repo.findUsers(query);

    // CACHE STORE

    await RedisService.safeSet(
      cacheKey,
      users,
      USER_CACHE_TTL.LIST
    );

    return users;

  }

  async updateProfilePhoto(userId, fileId) {
    // await UserCache.invalidateUser(userId);

    const user = await repo.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }



    const file = await fileRepo.findById(fileId);



    if (!file) {
      throw new Error("File not found");
    }

    if (file.uploadedById !== userId) {
      throw new Error(  "Unauthorized file");

    }

    // OPTIONAL:
    // SOFT DELETE OLD PHOTO

    if (user.profilePhotoId) {

      await fileRepo.softDelete(
        user.profilePhotoId
      );

    }

    const updated = await repo.update(userId, {
      profilePhotoId: fileId,
    });

    // AUDIT

    await AuditService.log({
      action: "PROFILE_PHOTO_UPDATED",
      module: "users",
      entityType: "User",
      entityId: userId,
      performedById: userId,
    });

    return updated;

  }

}