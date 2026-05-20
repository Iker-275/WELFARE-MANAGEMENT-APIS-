// region.repository.ts

// import { prisma } from "../../prisma/client";
import {prisma }from "../index.js";


export class RegionRepository {

  async create(data) {
    return prisma.region.create({
      data
    });
  }

  async findAll() {
    return prisma.region.findMany();
  }

  async findByName(name) {
    return prisma.region.findUnique({
      where: { name }
    });
  }
  async findById(id) {
    return prisma.region.findUnique({
      where: { id }
    });
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