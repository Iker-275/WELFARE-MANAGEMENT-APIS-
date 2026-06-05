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

  async findUsers(filters) {

    const {
      page = 1,
      limit = 20,

      search,

      roleId,
      regionId,

      membershipStatus,
      employmentStatus,

      isActive,
      isNecMember,
      eligibleForElection,

      sortBy = "createdAt",
      sortOrder = "desc",

    } = filters;

    const skip =
      (page - 1) * limit;

    const where = {};

    // ======================================================
    // SEARCH
    // ======================================================

    if (search) {

      where.OR = [

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
          employeeId: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          phone: {
            contains: search,
            mode: "insensitive",
          },
        },

      ];

    }

    // ======================================================
    // FILTERS
    // ======================================================

    if (roleId) {
      where.roleId = roleId;
    }

    if (regionId) {
      where.regionId = regionId;
    }

    if (membershipStatus) {
      where.membershipStatus =
        membershipStatus;
    }

    if (employmentStatus) {
      where.employmentStatus =
        employmentStatus;
    }

    if (typeof isActive !== "undefined") {
      where.isActive =
        isActive === "true";
    }

    if (typeof isNecMember !== "undefined") {
      where.isNecMember =
        isNecMember === "true";
    }

    if (
      typeof eligibleForElection
      !== "undefined"
    ) {
      where.eligibleForElection =
        eligibleForElection === "true";
    }

    // ======================================================
    // QUERY
    // ======================================================

    const [users, total] =
      await Promise.all([

        prisma.user.findMany({

          where,

          // include: {

          //   role: true,

          //   region: true,

          //   profilePhoto: true,

          // },
          select: {

            id: true,

            firstName: true,
            lastName: true,
            otherNames: true,

            email: true,
            phone: true,

            employeeId: true,

            isActive: true,

            membershipStatus: true,

            employmentStatus: true,

            signupCompleted: true,

            createdAt: true,

            role: {
              select: {
                id: true,
                name: true,
              },
            },

            region: {
              select: {
                id: true,
                name: true,
              },
            },

            profilePhoto: {
              select: {
                id: true,
                publicUrl: true,
              },
            },

          },

          skip,

          take: Number(limit),

          orderBy: {
            [sortBy]: sortOrder,
          },

        }),

        prisma.user.count({
          where,
        }),

      ]);

    return {

      data: users,

      pagination: {

        total,

        page: Number(page),

        limit: Number(limit),

        totalPages:
          Math.ceil(total / limit),

      },

    };

  }

  // repository/userRepo.js

  async findForCompletionCheck(id) {

    return prisma.user.findUnique({

      where: { id },

      include: {
        nextOfKin: true,
      },

    });

  }
  async deactivate(id, data) {

    return prisma.user.update({

      where: { id },

      data: {

        isActive: false,

        deactivatedAt: new Date(),

        deactivationReason: data.reason,

        deactivatedById: data.deactivatedById,

      },

    });

  }
  async activate(id) {

    return prisma.user.update({

      where: { id },

      data: {

        isActive: true,

        deactivatedAt: null,

        deactivationReason: null,

        deactivatedById: null,

      },

    });

  }
}