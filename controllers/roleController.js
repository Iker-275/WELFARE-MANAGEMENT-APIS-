// role.controller.ts


import { RoleService } from "../services/roleService.js";

const service = new RoleService();

export const createRole = async (req, res) => {

  try {

    const role = await service.createRole(req.body);

    res.status(201).json({
      success: true,
      role
    });

  } catch (e) {

    res.status(400).json({
      success: false,
      error: e.message
    });

  }

};

export const getRoles = async (_req, res) => {
try {               
  const roles = await service.getRoles();

  res.json({
    success: true,
    roles
  });
} catch (e) {
  res.status(400).json({
    success: false,
    error: e.message
  });
}

};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const role = await service.updateRole(id, data);

    res.json({
      success: true,
      role
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      error: e.message
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;  
    await service.deleteRole(id);

    res.json({  
        success: true,
        message: "Role deleted successfully"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
        error: e.message
    });
  } 
}
