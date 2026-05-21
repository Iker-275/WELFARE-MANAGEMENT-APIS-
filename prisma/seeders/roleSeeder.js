import { prisma } from "../../index.js";

const roles = [
  {
    name: "member",
    description: "Default member role"
  },
  {
    name: "admin",
    description: "System administrator"
  },
  {
    name: "system",
    description: "System Developer"
  }
];

export const seedRoles = async () => {

  for (const role of roles) {

    const existing =
      await prisma.role.findUnique({
        where: {
          name: role.name
        }
      });

    if (!existing) {

      await prisma.role.create({
        data: role
      });

      console.log(
        `Seeded role: ${role.name}`
      );
    }
  }

};