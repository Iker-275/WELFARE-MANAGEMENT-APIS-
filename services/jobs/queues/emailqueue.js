import { Queue } from "bullmq";

import {
  bullRedisConnection
} from "../bullmq.js";

export const emailQueue =
  new Queue(

    "email-queue",

    {
      connection:
        bullRedisConnection,
    }

  );