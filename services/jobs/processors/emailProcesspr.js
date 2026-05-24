import {
  sendOTPEmail,
//   sendResetPasswordEmail,
} from "../../mailService.js";

export const emailProcessor = async job => {

  const {type, payload,} = job.data;

  switch (type) {

    case "SEND_OTP":

      await sendOTPEmail( payload.email,  payload.otp);

      break;

    // case "FORGOT_PASSWORD":

    //   await sendResetPasswordEmail(
    //     payload.email,
    //     payload.otp
    //   );

    //   break;

    default:

      throw new Error(   `Unknown email job type: ${type}`    );
  }
};