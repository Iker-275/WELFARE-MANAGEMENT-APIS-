import {prisma }from "../index.js";


export const AuthRepository = {
async  findUserByEmail(email) {

    const  user= await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        region: true,
      },
    });

   
    if(user){
      return user;
    }
  },

  createUser(data) {
    return prisma.user.create({
      data,
    });
  },

  createOTP(data) {
    return prisma.oTP.create({
      data,
    });
  },

  getLatestOTP(userId, type) {
    return prisma.oTP.findFirst({
      where: {
        userId,
        type,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  markOTPVerified(id) {
    return prisma.oTP.update({
      where: { id },
      data: {
        verifiedAt: new Date(),
      },
    });
  },

  verifyUser(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
  },

  createSession(data) {
    return prisma.session.create({
      data,
    });
  },

  updateLastLogin(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
      },
    });
  },

  incrementFailedAttempts(userId, attempts) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: attempts,
      },
    });
  },

  lockAccount(userId, lockedUntil) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        lockedUntil,
      },
    });
  },

  resetFailedAttempts(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  },

  updatePassword(userId, passwordHash) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        passwordChangedAt: new Date(),
      },
    });
  },

  deleteUserSessions(userId) {
  return prisma.session.deleteMany({
    where: {
      userId,
    },
  });
},
};