import { AuthService } from "../services/authService.js";

export const AuthController = {
  async register(req, res, next) {
    try {
      const response =
        await AuthService.register(req.body);

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
        req.headers["user-agent"]
      );

      return res.status(200).json(response);
    } catch (error) {
      next(error);
      return res.status(400).json({
        success: false,
        message: "Login failed. " + error.message
      });
    }
  },
};