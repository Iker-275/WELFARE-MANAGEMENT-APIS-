import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl }
from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({

  region:process.env.AWS_REGION,

  credentials: {

    accessKeyId:
      process.env.AWS_ACCESS_KEY_ID,

    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY,

  },

});

export class S3Service {

  // ======================================================
  // SIGNED UPLOAD URL
  // ======================================================

  static async generateUploadUrl({

    key,
    contentType,

  }) {

    const command =
      new PutObjectCommand({

        Bucket:
          process.env.AWS_BUCKET_NAME,

        Key: key,

        ContentType:
          contentType,

      });

    const signedUrl =
      await getSignedUrl(
        s3,
        command,
        {
          expiresIn: 300,
        }
      );

    return signedUrl;

  }

  // ======================================================
  // DELETE FILE
  // ======================================================

  static async deleteFile(key) {

    await s3.send(
      new DeleteObjectCommand({

        Bucket:
          process.env.AWS_BUCKET_NAME,

        Key: key,

      })
    );

  }

}