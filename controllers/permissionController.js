import { PermissionService }
from "../services/permissionService.js";

const service = new PermissionService();

export const createPermission =
async (req, res, next) => {

  try {

    const permission =
      await service.createPermission(
        req.body
      );

    return res.status(201).json({
      success: true,
      data: permission
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create permission. " + error.message
    });
  }

};

export const getPermissions =
async (req, res, next) => {

  try {

    const permissions =
      await service.getPermissions();

    return res.status(200).json({
      success: true,
      data: permissions
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch permissions. " + error.message
    });
  }

};

export const assignPermissionToRole =
async (req, res, next) => {

  try {

    const result =
      await service.assignPermissionToRole(
        req.params.roleId,
        req.body.permissionId
      );

    return res.status(200).json({
      success: true,
      message:
        "Permission assigned successfully",
      data: result
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign permission. " + error.message
    });
  }

};

export const removePermissionFromRole =
async (req, res, next) => {

  try {

    await service.removePermissionFromRole(
      req.params.roleId,
      req.params.permissionId
    );

    return res.status(200).json({
      success: true,
      message:
        "Permission removed successfully"
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove permission. " + error.message  

  })

}};

export const getRolePermissions =
async (req, res, next) => {

  try {

    const permissions =
      await service.getRolePermissions(
        req.params.roleId
      );

    return res.status(200).json({
      success: true,
      data: permissions
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch role permissions. " + error.message
    });
  }

}
