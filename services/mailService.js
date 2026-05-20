import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTPEmail = async (
  email,
  otp
) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,

    to: email,

    subject: "Your Verification OTP",

    html: `
      <h2>Email Verification</h2>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>Expires in 10 minutes.</p>
    `,
  });
};