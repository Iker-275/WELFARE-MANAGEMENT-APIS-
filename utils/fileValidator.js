import path from "path";

import { FILE_CONFIG } from "../config/fileConstants.js";

export class FileValidator {

    // ======================================================
    // VALIDATE PROFILE PHOTO
    // ======================================================

    static validateProfilePhoto(data) {

        const config = FILE_CONFIG.profilePhoto;

        // MIME TYPE

        if (!config.allowedMimeTypes.includes(data.mimeType)) {
            throw new Error("Invalid file type");
        }

        // EXTENSION
        const extension = path.extname(data.fileName).toLowerCase();
        if (!config.allowedExtensions.includes(extension)) {
            throw new Error("Invalid file extension");
        }

        // FILE SIZE
        if (data.size > config.maxSize) {
            throw new Error("File too large");
        }
        return true;
    }
}