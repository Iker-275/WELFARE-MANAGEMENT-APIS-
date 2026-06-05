// controllers/userController.js

import { UserService }
  from "../services/userService.js";

const service =
  new UserService();

export const UserController = {

  // ======================================================
  // GET USERS
  // ======================================================

  async getUsers2(req, res, next) {

    try {

      const result =
        await service.getUsers({

          search:
            req.query.search,

          roleId:
            req.query.roleId,

          regionId:
            req.query.regionId,

          membershipStatus:
            req.query.membershipStatus,

          employmentStatus:
            req.query.employmentStatus,

          isActive:
            req.query.isActive === undefined
              ? undefined
              : req.query.isActive === "true",

          page:
            Number(req.query.page) || 1,

          limit:
            Number(req.query.limit) || 20,

          sortBy:
            req.query.sortBy,

          sortOrder:
            req.query.sortOrder,

        });

      return res.json({

        success: true,

        data: result.users,

        pagination: {

          page:
            Number(req.query.page) || 1,

          limit:
            Number(req.query.limit) || 20,

          total:
            result.total,

          pages:
            Math.ceil(
              result.total /
              (Number(req.query.limit) || 20)
            ),

        },

      });

    } catch (error) {

      next(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch users",

      });

    }

  },

  async getUsers(req, res, next) {

  try {

    const users =
      await service.getUsers(        req.query  );

    return res.status(200).json({

      success: true,

      ...users,

    });

  } catch (error) {

    next(error);

    return res.status(500).json({
      success: false,
      message:  "Failed to fetch users",
   });

  }

},

  // ======================================================
  // GET USER
  // ======================================================

  async getUser(req, res, next) {

    try {

      const user = await service.getUserById(
        req.params.id
      );

      return res.json({

        success: true,

        data: user,

      });

    } catch (error) {

      next(error);

      return res.status(404).json({
        success: false,
        message: error.message,
      });

    }

  },

  // ======================================================
  // UPDATE USER
  // ======================================================

  async updateUser(req, res, next) {

    try {

      const user = await service.updateUser(
        req.params.id,
        req.body,
        req.user.id
      );

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });

    } catch (error) {

      next(error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }

  },

  // ======================================================
  // ACTIVATE
  // ======================================================

  async activate(req, res, next) {

    try {

      await service.activateUser(req.params.id);

      return res.status(200).json({
        success: true,
        message: "User activated successfully",
      });

    } catch (error) {

      next(error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }

  },

  // ======================================================
  // DEACTIVATE
  // ======================================================

  async deactivate2(req, res, next) {

    try {

      await service.deactivateUser(
        req.params.id
      );

      return res.json({

        success: true,

        message:
          "User deactivated successfully",

      });

    } catch (error) {

      next(error);

      return res.status(400).json({

        success: false,

        message:
          error.message,

      });

    }

  },

  async deactivate(req, res, next) {

    try {

      await service.deactivateUser(req.params.id, req.body.reason, req.user.id);

      return res.status(200).json({
        success: true,
        message: "User deactivated successfully",
      });

    } catch (error) {

      next(error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }

  },

  // ======================================================
// UPDATE PROFILE PHOTO
// ======================================================

async updateProfilePhoto(req,res,next) {
  try {
    const { fileId } = req.body;

    const updated = await service.updateProfilePhoto(req.user.id,fileId );

    return res.status(200).json({
      success: true,
      message:   "Profile photo updated successfully",
      data: updated,
    });

  } catch (error) {

    next(error);
    return res.status(500).json({
      success: false,
      message:error.message ||   "Failed to update profile photo",
    });
  }

}
};