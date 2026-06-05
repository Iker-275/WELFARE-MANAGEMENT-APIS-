import { Queue } from "bullmq";

import { bullRedisConnection } from "../bullmq.js";

export const auditQueue =
    new Queue("audit-queue",
        {
            connection: bullRedisConnection,
        }
    );