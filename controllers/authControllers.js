import { AuthService } from "../services/authService.js";

export const AuthController = {
  async register(req, res, next) {
    try {
      const response =
        await AuthService.register(req.body);

      return res.status(201).json(response);
    } catch (error) {
      next(error);
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
    }
  },
};