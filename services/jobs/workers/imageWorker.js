import { Worker }
from "bullmq";

import sharp from "sharp";

import fs from "fs/promises";

import path from "path";

import {
  bullRedisConnection
} from "../bullmq.js";

import { prisma }
from "../../../index.js"

new Worker(

  "image-processing",

  async job => {

    if (
      job.name ===
      "process-profile-photo"
    ) {

      const { fileId } =
        job.data;

      // GET FILE

      const file =
        await prisma.fileUpload.findUnique({
          where: { id: fileId },
        });

      if (!file) {
        return;
      }

      // LOCAL TEMP PATH
      // OR DOWNLOAD FROM S3

      const inputPath =
        path.join(
          "uploads",
          file.fileName
        );

      const outputPath =
        path.join(
          "uploads",
          `optimized-${file.fileName}.webp`
        );

      // PROCESS IMAGE

      await sharp(inputPath)

        .resize(512, 512, {
          fit: "cover",
        })

        .webp({
          quality: 80,
        })

        .toFile(outputPath);

      console.log(
        "Image processed:",
        fileId
      );

    }

  },

  {
    connection: bullRedisConnection,
  }

);