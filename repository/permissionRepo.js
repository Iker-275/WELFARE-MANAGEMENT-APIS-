import { prisma } from "../index.js";

export class PermissionRepository {

  async create(data) {
    return prisma.permission.create({
      data
    });
  }

  async findAll() {
    return prisma.permission.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }

  async findById(id) {
    return prisma.permission.findUnique({
      where: { id }
    });
  }

  async findByName(name) {
    return prisma.permission.findUnique({
      where: {
        name: name.toLowerCase()
      }
    });
  }

  async assignToRole(roleId, permissionId) {
    return prisma.rolePermission.create({
      data: {
        roleId,
        permissionId
      }
    });
  }

  async removeFromRole(roleId, permissionId) {
    return prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      }
    });
  }

  async roleHasPermission(roleId, permissionId) {

    return prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      }
    });
  }

  async getRolePermissions(roleId) {

    return prisma.rolePermission.findMany({
      where: {
        roleId
      },

      include: {
        permission: true
      }
    });
  }

  async assignManyToRole(roleId, permissionIds) {

  return prisma.rolePermission.createMany({
    data: permissionIds.map(permissionId => ({
      roleId,
      permissionId
    })),

    skipDuplicates: true
  });

}

async removeManyFromRole(
  roleId,
  permissionIds
) {

  return prisma.rolePermission.deleteMany({
    where: {
      roleId,
      permissionId: {
        in: permissionIds
      }
    }
  });

}

async syncRolePermissions(
  roleId,
  permissionIds
) {

  return prisma.$transaction(async (tx) => {

    // DELETE OLD
    await tx.rolePermission.deleteMany({
      where: {
        roleId
      }
    });

    // ADD NEW
    if (permissionIds.length > 0) {

      await tx.rolePermission.createMany({
        data: permissionIds.map(
          permissionId => ({
            roleId,
            permissionId
          })
        ),

        skipDuplicates: true
      });

    }

    return true;

  });

}

}