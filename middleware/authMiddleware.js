import jwt from "jsonwebtoken";

import prisma from "../config/prisma.js";

export const authMiddleware = async (
  req,
  res,
  next
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};