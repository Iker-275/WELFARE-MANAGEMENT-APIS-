import { prisma } from "../index.js";

export class RegionRepository {

  async create(data) {
    return prisma.region.create({
      data
    });
  }

  async findAll() {
    return prisma.region.findMany({
      include: {
    _count: {
      select: {
        users: true
      }
    }
  },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findByName(name) {
    return prisma.region.findUnique({
      where: {
        name: name.toLowerCase()
      }
    });
  }

  async findById(id) {
    return prisma.region.findUnique({
      where: { id }
    });
  }

  async regionHasUsers(id) {

    const count = await prisma.user.count({
      where: {
        regionId: id
      }
    });

    return count > 0;
  }

  async update(id, data) {
    return prisma.region.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return prisma.region.delete({
      where: { id }
    });
  }

  async findAll(filters = {}) {
  const where = {};

  if (filters.search) {
    where.OR = [
      {
        name: {
          contains: filters.search,
          mode: "insensitive"
        }
      },
      {
        code: {
          contains: filters.search,
          mode: "insensitive"
        }
      },
      {
        description: {
          contains: filters.search,
          mode: "insensitive"
        }
      }
    ];
  }

  return prisma.region.findMany({
    where,
    include: {
    _count: {
      select: {
        users: true
      }
    }
  },
    orderBy: {
      createdAt: "desc"
    }
  });
}


async getRegionUsers(
  regionId,
  filters = {}
) {

  const {
    page = 1,
    limit = 20,
    search,
    membershipStatus,
    employmentStatus,
    roleId,
    isActive
  } = filters;

  const skip =
    (page - 1) * limit;

  const where = {
    regionId
  };

  if (membershipStatus) {
    where.membershipStatus =
      membershipStatus;
  }

  if (employmentStatus) {
    where.employmentStatus =
      employmentStatus;
  }

  if (roleId) {
    where.roleId = roleId;
  }

  if (
    isActive !== undefined
  ) {
    where.isActive =
      isActive === "true";
  }

  if (search) {

    where.OR = [
      {
        firstName: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        lastName: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        employeeId: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        membershipNumber: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        phone: {
          contains: search,
          mode: "insensitive"
        }
      }
    ];

  }

  const [users, total] =
    await prisma.$transaction([

      prisma.user.findMany({
        where,

        skip,

        take: limit,

        select: {
          id: true,
          employeeId: true,
          membershipNumber: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          membershipStatus: true,
          employmentStatus: true,
          isActive: true,
          isNecMember: true,

          role: {
            select: {
              id: true,
              name: true
            }
          }
        },

        orderBy: {
          createdAt: "desc"
        }
      }),

      prisma.user.count({
        where
      })

    ]);

  return {
    data: users,

    pagination: {
      page,
      limit,
      total,

      totalPages:
        Math.ceil(total / limit),

      hasNextPage:
        page < Math.ceil(total / limit),

      hasPreviousPage:
        page > 1
    }
  };

}
}