
//auth config
export const OTP_TYPES = {
  EMAIL_VERIFICATION: "email_verification",
  FORGOT_PASSWORD: "forgot_password",
};

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES_DAYS = 7;

export const MAX_LOGIN_ATTEMPTS = 5;
export const ACCOUNT_LOCK_MINUTES = 30;

export const INACTIVITY_TIMEOUT_MINUTES = 20;