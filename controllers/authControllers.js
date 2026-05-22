import { AuthService } from "../services/authService.js";

export const AuthController = {
  async register(req, res, next) {
    try {
      const response = await AuthService.register(req.body);

      return res.status(201).json(response);
    } catch (error) {
      next(error);
      return res.status(500).json({
        success: false,
        message: "Registration failed. " + error.message
      });
    }
  },

  async verifyEmailOTP(req, res, next) {
    try {
      const response =
        await AuthService.verifyEmailOTP(
          req.body
        );

      return res.status(200).json(response);
    } catch (error) {
      next(error);
      return res.status(400).json({
        success: false,
        message: "OTP verification failed. " + error.message
      });
    }
  },

  async login(req, res, next) {
    try {
      const response = await AuthService.login(
        req.body,
        req.ip,
        req.headers["user-agent"]);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
      return res.status(400).json({
        success: false,
        message: "Login failed. " + error.message
      });
    }
  },

  async forgotPassword(
  req,
  res,
  next
) {

  try {

    const response =await AuthService.forgotPassword( req.body.email);

    return res
      .status(200)
      .json(response);

  } catch (error) {

    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to process forgot password request. " + error.message
    });

  }

},
async verifyForgotPasswordOTP(req,res,next) {

  try {

    const response = await AuthService.verifyForgotPasswordOTP(
          req.body.email,
          req.body.otp
        );

    return res.status(200).json(response);

  } catch (error) {

    next(error);
    return res.status(400).json({
      success: false,
      message: "OTP verification failed. " + error.message
    });

  }

},
async resetPassword(req,res,next) {

  try {
    const response =await AuthService.resetPassword( req.body );
    return res.status(200).json(response);
  } catch (error) {
    next(error);
    return res.status(400).json({
      success: false,
      message: "Password reset failed. " + error.message
    });
  }

}
};