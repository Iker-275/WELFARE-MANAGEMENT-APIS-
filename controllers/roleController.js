import { RoleService } from "../services/roleService.js";

const service = new RoleService();

export const createRole = async (
  req,
  res,
  next
) => {
  try {

    const role =
      await service.createRole(req.body);

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create role. " + error.message
    });
  }
};

export const getRoles = async (
  req,
  res,
  next
) => {
  try {

    const roles =
      await service.getRoles();

    return res.status(200).json({
      success: true,
      data: roles
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles. " + error.message
      });
  }
};

export const updateRole = async (
  req,
  res,
  next
) => {
  try {

    const role =
      await service.updateRole(
        req.params.id,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: role
    });

  } catch (error) {
    next(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update role. " + error.message
      });
  }
};

export const deleteRole = async (
  req,
  res,
  next
) => {
  try {

    await service.deleteRole(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully"
    });

  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete role. " + error.message
    });
  }
};