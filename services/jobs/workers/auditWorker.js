

import { bullRedisConnection } from "../bullmq.js";


import { prisma }
    from "../../../index.js";

new Worker(

    "audit-queue",

    async (job) => {

        const data = job.data;

        await prisma.auditEvent.create({

            data: {

                performedById: data.performedById,
                affectedUserId: data.affectedUserId,
                action: data.action,
                module: data.module,
                entityType: data.entityType,
                entityId: data.entityId,
                description: data.description,
                severity: data.severity || "info",
                status: data.status || "success",
                oldValues: data.oldValues,
                newValues: data.newValues,
                metadata: data.metadata,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
                requestId: data.requestId,
                method: data.method,
                endpoint: data.endpoint,
            },

        });

    },

    {
        connection: bullRedisConnection,
        concurrency: 20,
    }

);