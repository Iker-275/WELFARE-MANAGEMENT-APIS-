import { prisma } from "../index.js";

export class RegionRepository {

  async create(data) {
    return prisma.region.create({
      data
    });
  }

  async findAll() {
    return prisma.region.findMany({
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

}