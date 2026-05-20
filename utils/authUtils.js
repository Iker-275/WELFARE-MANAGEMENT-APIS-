import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const hashValue = async (value) => {
  return bcrypt.hash(value, 12);
};

export const compareHash = async (value, hash) => {
  return bcrypt.compare(value, hash);
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = async (otp) => {
  return bcrypt.hash(otp, 10);
};

export const compareOTP = async (otp, hash) => {
  return bcrypt.compare(otp, hash);
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      roleId: user.roleId,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};