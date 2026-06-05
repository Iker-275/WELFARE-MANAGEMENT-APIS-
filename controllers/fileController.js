import { FileService }
    from "../services/fileService.js";

const service = new FileService();

export const FileController = {

    // ======================================================
    // GENERATE PROFILE PHOTO UPLOAD URL
    // ======================================================

    async generateProfilePhotoUploadUrl(req, res, next) {

        try {
            const response = await service.generateProfilePhotoUpload(req.body, req.user.id);

            return res.status(200).json({
                success: true,
                message: "Upload URL generated successfully",
                data: response,
            });

        } catch (error) {

            next(error);

            return res.status(500).json({
                success: false,
                message: error.message || "Failed to generate upload URL",
            });
        }
    },

    // ======================================================
    // SAVE UPLOADED PROFILE PHOTO
    // ======================================================

    async saveProfilePhoto(req, res, next) {
        try {
            const file = await service.saveUploadedProfilePhoto(
                req.body,
                req.user.id
            );

            return res.status(201).json({
                success: true,
                message: "Profile photo saved successfully",
                data: file,

            });

        } catch (error) {

            next(error);
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to save profile photo",
            });

        }

    },

};