import { Queue } from "bullmq";

import {
  bullRedisConnection
} from "../bullmq.js";

export const notificationQueue =
  new Queue( "notification-queue",
    {
      connection:
        bullRedisConnection,
    }
  );