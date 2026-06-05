import { prisma }
from "../index.js";

export class FileRepository {

  async create(data) {

    return prisma.fileUpload.create({
      data,
    });

  }

  async findById(id) {

    return prisma.fileUpload.findUnique({
      where: { id },
    });

  }

  async softDelete(id) {

    return prisma.fileUpload.update({

      where: { id },

      data: {

        isDeleted: true,

        deletedAt:
          new Date(),

      },

    });

  }

}