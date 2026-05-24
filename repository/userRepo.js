// repository/userRepo.js

import { prisma } from "../index.js";

export class UserRepository {

  // ======================================================
  // CREATE USER
  // ======================================================

  async create(data) {

    return prisma.user.create({
      data,

      include: {
        role: true,
        region: true,
      },
    });

  }

  // ======================================================
  // FIND USER BY ID
  // ======================================================

  async findById(id) {

    return prisma.user.findUnique({

      where: { id },

      include: {
        role: true,
        region: true,
        nextOfKin: true,
        dependants: true,

        profilePhoto: true,
      },

    });

  }

  // ======================================================
  // FIND USER BY EMAIL
  // ======================================================

  async findByEmail(email) {

    return prisma.user.findUnique({

      where: { email },

      include: {
        role: true,
        region: true,
      },

    });

  }

  // ======================================================
  // UPDATE USER
  // ======================================================

  async update(id, data) {

    return prisma.user.update({

      where: { id },

      data,

      include: {
        role: true,
        region: true,
      },

    });

  }

  // ======================================================
  // ACTIVATE / DEACTIVATE
  // ======================================================

  async toggleActive(id, isActive) {

    return prisma.user.update({

      where: { id },

      data: {
        isActive,
      },

    });

  }

  // ======================================================
  // SEARCH USERS
  // ======================================================

  async findMany(filters) {

    const {
      search,
      roleId,
      regionId,
      membershipStatus,
      employmentStatus,
      isActive,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const skip =
      (page - 1) * limit;

    const where = {

      AND: [

        search
          ? {
              OR: [

                {
                  firstName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },

                {
                  lastName: {
                    contains: search,
                    mode: "insensitive",
                  },
                },

                {
                  otherNames: {
                    contains: search,
                    mode: "insensitive",
                  },
                },

                {
                  email: {
                    contains: search,
                    mode: "insensitive",
                  },
                },

                {
                  phone: {
                    contains: search,
                  },
                },

                {
                  employeeId: {
                    contains: search,
                  },
                },

                {
                  membershipNumber: {
                    contains: search,
                  },
                },

                {
                  nationalId: {
                    contains: search,
                  },
                },

              ],
            }
          : {},

        roleId
          ? { roleId }
          : {},

        regionId
          ? { regionId }
          : {},

        membershipStatus
          ? { membershipStatus }
          : {},

        employmentStatus
          ? { employmentStatus }
          : {},

        typeof isActive === "boolean"
          ? { isActive }
          : {},

      ],

    };

    const [users, total] =
      await Promise.all([

        prisma.user.findMany({

          where,

          include: {
            role: true,
            region: true,
            profilePhoto: true,
          },

          skip,

          take: limit,

          orderBy: {
            [sortBy]: sortOrder,
          },

        }),

        prisma.user.count({
          where,
        }),

      ]);

    return {
      users,
      total,
    };

  }

}