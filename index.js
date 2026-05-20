
import express from "express";

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";
import bodyParser from "body-parser";
// import { prisma } from "./config/prisma.js";
import appRoutes from "./routes/appRoutes.js";
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };


const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use("/api", appRoutes);

app.post("/users", async(req, res) => {
  const { username, email, password ,firstName, lastName} = req.body;
  try{
    const newUser = await prisma.user.create({
      data: {
       
        email,
        passwordHash: password, // In a real application, make sure to hash the password before storing it
      },
    });
    res.status(201).json({success: true, 
        message: "User created successfully",
        user: newUser});
  }catch(error){
    console.log(error);
    if(error.message.includes("Unique constraint failed")){
      return res.status(400).json({ success:false, message: "Username or email already exists" });
    }
    res.status(500).json({ success:false, message: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});