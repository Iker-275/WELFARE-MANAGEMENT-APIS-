
import express from "express";

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";
import bodyParser from "body-parser";
import appRoutes from "./routes/appRoutes.js";
import { seedRoles } from "./prisma/seeders/roleSeeder.js"; //not yet used
import { seedRegions } from "./prisma/seeders/regionSeeder.js"; //not yet used
import { PermissionSeeder } from "./prisma/seeders/permissionSeeder.js"; //not yet used


const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };


const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use("/api", appRoutes);

async function main() {

  await seedRoles();

  await seedRegions();

  await PermissionSeeder.seed();

}

//main()
  // .then(() => {
  //   console.log("Database seeding complete");
  // })
  // .catch((error) => {
  //   console.error(error);
  //   process.exit(1);
  // });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});