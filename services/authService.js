import dayjs from "dayjs";

import { AuthRepository } from "../repository/authRepo.js";

import {
  generateOTP,
  hashOTP,
  compareOTP,
  hashValue,
  compareHash,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/authUtils.js";

import {
  OTP_TYPES,
  OTP_EXPIRY_MINUTES,
  MAX_LOGIN_ATTEMPTS,
  ACCOUNT_LOCK_MINUTES,
} from "../config/config.js";

import { sendOTPEmail } from "./mailService.js";
import {
  emailQueue
} from "./jobs/queues/emailqueue.js";

export const AuthService = {
  async register(data) {
    const existingUser = await AuthRepository.findUserByEmail(
      data.email
    );

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const passwordHash = await hashValue(data.password);

  

    const user = await AuthRepository.createUser({
      email: data.email,
      passwordHash,

      signupCompleted: false,
      isEmailVerified: false,

      roleId: process.env.DEFAULT_ROLE_ID,
      regionId: process.env.DEFAULT_REGION_ID,
    });

   

    const otp = generateOTP();

    const codeHash = await hashOTP(otp);

    const expiresAt = dayjs()
      .add(OTP_EXPIRY_MINUTES, "minute")
      .toDate();

    await AuthRepository.createOTP({
      userId: user.id,
      codeHash,
      type: OTP_TYPES.EMAIL_VERIFICATION,
      expiresAt,
    });

    await sendOTPEmail(user.email, otp);

    return {
      success: true,
      message:
        "Registration successful. OTP sent to email.",
    };
  },

  async verifyEmailOTP(data) {
    const user = await AuthRepository.findUserByEmail(
      data.email
    );

    if (!user) {
      throw new Error("User not found");
    }
    
    const otpRecord = await AuthRepository.getLatestOTP(
      user.id,
      OTP_TYPES.EMAIL_VERIFICATION
    );
    
    if (!otpRecord) {
      throw new Error("OTP not found");
    }

    if (otpRecord.verifiedAt) {
      throw new Error("OTP already used");
    }

    if (dayjs().isAfter(dayjs(otpRecord.expiresAt))) {
      throw new Error("OTP expired");
    }

    const validOTP = await compareOTP(
      data.otp,
      otpRecord.codeHash
    );

    

    if (!validOTP) {
      throw new Error("Invalid OTP");
    }

    await AuthRepository.markOTPVerified(otpRecord.id);

    const verifiedUser =
      await AuthRepository.verifyUser(user.id);

    const accessToken =
      generateAccessToken(verifiedUser);

    const refreshToken = generateRefreshToken();

    await AuthRepository.createSession({
      userId: user.id,
      refreshToken,
      expiresAt: dayjs().add(7, "day").toDate(),
    });

   
    return {
      success: true,
      message: "Email verified successfully",

      accessToken,
      refreshToken,

      user: verifiedUser,
    };
  },

  async login(data, ipAddress, userAgent) {
    const user = await AuthRepository.findUserByEmail(
      data.email
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.lockedUntil && dayjs().isBefore(dayjs(user.lockedUntil))) {
      throw new Error(  "Account locked. Try again later." );
    }
    if (user.membershipStatus === "revoked") {
      throw new Error(  "Membership revoked" );
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated. Contact admin.");
    }



    const validPassword = await compareHash(
      data.password,
      user.passwordHash
    );

    if (!validPassword) {
      const attempts = user.failedLoginAttempts + 1;

      await AuthRepository.incrementFailedAttempts(
        user.id,
        attempts
      );

      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        const lockedUntil = dayjs()
          .add(ACCOUNT_LOCK_MINUTES, "minute")
          .toDate();

        await AuthRepository.lockAccount(
          user.id,
          lockedUntil
        );
      }

      throw new Error("Invalid credentials");
    }

    if (!user.isEmailVerified) {
      throw new Error("Email not verified");
    }

    await AuthRepository.resetFailedAttempts(user.id);

    await AuthRepository.updateLastLogin(user.id);

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken();

    await AuthRepository.createSession({
      userId: user.id,
      refreshToken,

      ipAddress,
      userAgent,

      expiresAt: dayjs().add(7, "day").toDate(),
    });

    return {
      success: true,
      message: "Login successful",

      accessToken,
      refreshToken,

      signupCompleted: user.signupCompleted,

      user,
    };
  },
  async forgotPassword(email) {

    const user = await AuthRepository.findUserByEmail(email);

    // SECURITY:
    // NEVER reveal if email exists
    if (!user) {

      return {
        success: true,
        message:
          "If the email exists, an OTP has been sent.",
      };

    }

    const otp = generateOTP();

    const codeHash = await hashOTP(otp);

    const expiresAt = dayjs()
      .add(
        OTP_EXPIRY_MINUTES,
        "minute"
      )
      .toDate();

    await AuthRepository.createOTP({
      userId: user.id,

      codeHash,

      type:
        OTP_TYPES.FORGOT_PASSWORD,

      expiresAt,
    });

    // await emailQueue.add("send-email",
    //   {
    //     type: "SEND_OTP",
    //     payload: {
    //       email: user.email,
    //       otp,
    //     },
    //   },
    //   {
    //     attempts: 3,
    //     backoff: {
    //       type: "exponential",
    //       delay: 3000,
    //     },
    //     removeOnComplete: true,
    //     removeOnFail: false,
    //   }
    // );
    await sendOTPEmail(
      user.email,
      otp
    );

    return {
      success: true,
      message:
        "If the email exists, an OTP has been sent.",
    };

  },

  async verifyForgotPasswordOTP(
    email,
    otp
  ) {

    const user =
      await AuthRepository.findUserByEmail(
        email
      );

    if (!user) {
      throw new Error(
        "Invalid request"
      );
    }

    const otpRecord = await AuthRepository.getLatestOTP(
      user.id,
      OTP_TYPES.FORGOT_PASSWORD
    );

    if (!otpRecord) {
      throw new Error(
        "OTP not found"
      );
    }

    if (otpRecord.verifiedAt) {
      throw new Error(
        "OTP already used"
      );
    }

    if (dayjs().isAfter(dayjs(otpRecord.expiresAt))
    ) {
      throw new Error(
        "OTP expired"
      );
    }

    const validOTP = await compareOTP(
      otp,
      otpRecord.codeHash
    );

    if (!validOTP) {
      throw new Error(
        "Invalid OTP"
      );
    }

    await AuthRepository.markOTPVerified(
      otpRecord.id
    );

    return {
      success: true,
      message: "OTP verified",
    };

  },
  async resetPassword(data) {

    const {
      email,
      otp,
      newPassword
    } = data;

    const user =
      await AuthRepository.findUserByEmail(
        email
      );

    if (!user) {
      throw new Error(
        "Invalid request"
      );
    }

    const otpRecord =
      await AuthRepository.getLatestOTP(
        user.id,
        OTP_TYPES.FORGOT_PASSWORD
      );

    if (!otpRecord) {
      throw new Error(
        "OTP not found"
      );
    }

    if (otpRecord.verifiedAt) {
      throw new Error(
        "OTP already used"
      );
    }

    if (
      dayjs().isAfter(
        dayjs(otpRecord.expiresAt)
      )
    ) {
      throw new Error(
        "OTP expired"
      );
    }

    const validOTP =
      await compareOTP(
        otp,
        otpRecord.codeHash
      );

    if (!validOTP) {
      throw new Error(
        "Invalid OTP"
      );
    }

    const passwordHash =
      await hashValue(
        newPassword
      );

    await AuthRepository.updatePassword(
      user.id,
      passwordHash
    );

    // MARK OTP USED
    await AuthRepository.markOTPVerified(
      otpRecord.id
    );

    // INVALIDATE SESSIONS
    await AuthRepository.deleteUserSessions(
      user.id
    );

    return {
      success: true,
      message:
        "Password reset successful",
    };

  }
};