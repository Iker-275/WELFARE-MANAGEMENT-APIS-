import { prisma } from "../index.js";



class ImportRepository {
  async create(data) {
    return prisma.importJob.create({
      data,
    });
  }

  async findById(id) {
    return prisma.importJob.findUnique({
      where: { id },
      include: {
        file: true,
        errors: true,
      },
    });
  }

  async update(id, data) {
    return prisma.importJob.update({
      where: { id },
      data,
    });
  }

  async createErrors(errors) {
    return prisma.importJobError.createMany({
      data: errors,
    });
  }
}

module.exports = new ImportRepository();