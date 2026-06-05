import { prisma }
from "../index.js";

export class NextOfKinRepository {

  // ======================================================
  // FIND BY USER
  // ======================================================

  async findByUserId(userId) {

    return prisma.nextOfKin.findUnique({

      where: {
        userId,
      },

    });

  }

  // ======================================================
  // CREATE
  // ======================================================

  async create(data) {

    return prisma.nextOfKin.create({
      data,
    });

  }

  // ======================================================
  // UPDATE
  // ======================================================

  async update(id, data) {

    return prisma.nextOfKin.update({

      where: { id },

      data,

    });

  }

  async findUserForImport(row) {

  return prisma.user.findFirst({
    where: {
      OR: [
        row.employeeId
          ? { employeeId: row.employeeId }
          : undefined,

        row.email
          ? { email: row.email }
          : undefined,

        row.nationalId
          ? { nationalId: row.nationalId }
          : undefined,

        row.membershipNumber
          ? { membershipNumber: row.membershipNumber }
          : undefined,
      ].filter(Boolean),
    },
  });

}

async upsertNextOfKin(userId, data) {

  return prisma.nextOfKin.upsert({

    where: {
      userId,
    },

    create: {
      userId,
      ...data,
    },

    update: {
      ...data,
    },

  });

}
}