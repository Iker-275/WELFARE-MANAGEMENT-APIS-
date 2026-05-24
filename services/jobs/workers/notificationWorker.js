import { Worker }from "bullmq";

import { bullRedisConnection} from "../bullmq.js";

import {notificationProcessor} from "../processors/notificationProcessor.js";

export const notificationWorker =
  new Worker("notification-queue",
    async job => {
      await notificationProcessor(job);
    },
    {
      connection:
        bullRedisConnection,
      concurrency: 10,
    }
  );