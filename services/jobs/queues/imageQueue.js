import { Queue }
from "bullmq";

import {
  bullRedisConnection
} from "../bullmq.js";

export const imageQueue =
  new Queue(

    "image-processing",

    {
      connection: bullRedisConnection,
    }

  );