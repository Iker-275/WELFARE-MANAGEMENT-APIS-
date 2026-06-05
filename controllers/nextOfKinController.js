import { NextOfKinService }
    from "../services/nextOfKinService.js";

const service =
    new NextOfKinService();

export const NextOfKinController = {

    async mine(req, res, next) {
        try {
            const data = await service.getMine(req.user.id);
            return res.json({
                success: true,
                data,
            });

        } catch (error) {
            next(error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch next of kin",
            });
        }
    },



    async save(req, res, next) {
        try {
            const data = await service.saveNextOfKin(
                req.user.id,
                req.body,
                req.user.id
            );

            return res.json({
                success: true,
                message: "Next of kin saved successfully",
                data,
            });

        } catch (error) {
            next(error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to save next of kin",

            });
        }
    },
};