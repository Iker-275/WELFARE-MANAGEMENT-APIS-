import { v4 as uuid } from "uuid";

import path from "path";
import { S3Service } from "./storage/s3Service.js";
import { FileRepository } from "../repository/fileRepo.js";
import { FileValidator } from "../utils/fileValidator.js";

import { imageQueue }
    from "../services/jobs/queues/imageQueue.js";

const repo = new FileRepository();


export class FileService {

    

    async generateProfilePhotoUpload(
        data,
        userId
    ) {

        // VALIDATE FILE

        FileValidator
            .validateProfilePhoto(data);

        const extension =
            path.extname(
                data.fileName
            ).toLowerCase();

        const fileName =
            `${uuid()}${extension}`;

        const key =
            `users/${userId}/profile/${fileName}`;

        const uploadUrl =
            await S3Service.generateUploadUrl({

                key,

                contentType:
                    data.mimeType,

            });

        return {

            uploadUrl,

            key,

            fileName,

        };

    }

    // ======================================================
    // SAVE FILE RECORD
    // ======================================================

    async saveUploadedProfilePhoto(data, userId) {

        // OPTIONAL:
        // REVALIDATE AGAIN

        FileValidator.validateProfilePhoto({
            fileName: data.originalName,
            mimeType: data.mimeType,
            size: data.size,
        });

        // CREATE FILE RECORD

        const file = await repo.create({
            originalName: data.originalName,
            fileName: data.fileName,
            mimeType: data.mimeType,
            extension: data.extension,
            size: data.size,
            storageProvider: "s3",
            storagePath: data.storagePath,
            publicUrl: data.publicUrl,
            category: "profile_photo",
            uploadedById: userId,
            metadata: {
                processingStatus: "pending",
            },
        });

        // QUEUE IMAGE PROCESSING

        await imageQueue.add("process-profile-photo", {
            fileId: file.id,
        },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
                removeOnComplete: true,
            }
        );
        return file;
    }
}
// export class FileService {

//     // ======================================================
//     // GENERATE PROFILE PHOTO URL
//     // ======================================================

//     async generateProfilePhotoUpload(data, userId) {
//         FileValidator.validateProfilePhoto(data);
//         const extension = path.extname(data.fileName);

//         const fileName = `${uuid()}${extension}`;

//         const key = `users/${userId}/profile/${fileName}`;

//         const uploadUrl = await S3Service.generateUploadUrl({
//             key,
//             contentType: data.mimeType,
//         });

//         return {
//             uploadUrl,
//             key,
//             fileName,
//         };

//     }

//     // ======================================================
//     // SAVE FILE RECORD
//     // ======================================================

//     async saveUploadedProfilePhoto(data, userId) {
//         await imageQueue.add(

//             "process-profile-photo",

//             {
//                 fileId: file.id,
//             },

//             {
//                 attempts: 3,

//                 backoff: {
//                     type: "exponential",
//                     delay: 5000,
//                 },

//                 removeOnComplete: true,
//             }

//         );

//         return repo.create({

//             originalName: data.originalName,
//             fileName: data.fileName,
//             mimeType: data.mimeType,
//             extension: data.extension,
//             size: data.size,
//             storageProvider: "s3",
//             storagePath: data.storagePath,
//             publicUrl: data.publicUrl,
//             category: "profile_photo",
//             uploadedById: userId,
//         });

//     }

// }