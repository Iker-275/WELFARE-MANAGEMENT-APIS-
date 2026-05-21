import { prisma }
from "../../index.js";

const regions = [
  {
    name: "unassigned",
    description:
      "Default fallback region"
  }
  
];

export const seedRegions =
async () => {

  for (const region of regions) {

    const existing =
      await prisma.region.findUnique({
        where: {
          name: region.name
        }
      });

    if (!existing) {

      await prisma.region.create({
        data: region
      });

      console.log(
        `Seeded region: ${region.name}`
      );
    }
  }

};