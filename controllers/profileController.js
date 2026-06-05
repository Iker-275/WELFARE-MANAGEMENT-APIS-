// controllers/profileController.js

import { ProfileCompletionService }
    from "../services/profileCompletionService.js";

const service = new ProfileCompletionService();

export const getCompletionStatus =
    async (req, res, next) => {

        try {

            const completed = await service.evaluate(req.user.id);

            return res.json({

                success: true,

                signupCompleted: completed,

            });

        } catch (error) {

            next(error);

            return res.status(500).json({

                success: false,

                message: "Failed to check completion",

            });

        }

    };