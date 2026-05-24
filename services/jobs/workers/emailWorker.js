import { Worker } from "bullmq";

import {bullRedisConnection} from "../bullmq.js";

import {
  emailProcessor
} from "../processors/emailProcesspr.js";

export const emailWorker =
  new Worker(

    "email-queue",

    async job => {

      await emailProcessor(job);

    },

    {
      connection:
        bullRedisConnection,

      concurrency: 5,
    }

  );

emailWorker.on(
  "completed",
  job => {

    console.log(
      `Email job completed: ${job.id}`
    );

  }
);

emailWorker.on(
  "failed",
  (job, err) => {

    console.error(
      `Email job failed: ${job?.id}`,
      err
    );

  }
);