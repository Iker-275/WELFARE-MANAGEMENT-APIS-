// role.repository.ts

// import { prisma } from "../../prisma/client";
import {prisma }from "../index.js";

export class RoleRepository {

  async create(data) {
    return prisma.role.create({
      data
    });
  }

  async findAll() {
    return prisma.role.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findById(id) {
    return prisma.role.findUnique({
      where: { id }
    });
  }

  async findByName(name) {
    return prisma.role.findUnique({
      where: { name }
    });
  }

  async update(id, data) {
    return prisma.role.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return prisma.role.delete({
      where: { id }
    });
  }

}