// import { prisma }from "../index.js";

// export const AuditService = {

//     async log(data) {

//         return prisma.auditEvent.create({

//             data: {
//                 action: data.action,
//                 entityType: data.entityType,
//                 entityId: data.entityId,
//                 performedById: data.performedById,
//                 metadata: data.metadata || {},

//             },

//         });

//     },

// };

// import { prisma } from "../index.js";

// export const AuditService = {

//   async log(data) {

//     try {

//       return prisma.auditEvent.create({

//         data: {

//           performedById:
//             data.performedById,

//           affectedUserId:
//             data.affectedUserId,

//           action:
//             data.action,

//           module:
//             data.module,

//           entityType:
//             data.entityType,

//           entityId:
//             data.entityId,

//           description:
//             data.description,

//           severity:
//             data.severity || "info",

//           status:
//             data.status || "success",

//           oldValues:
//             data.oldValues,

//           newValues:
//             data.newValues,

//           metadata:
//             data.metadata,

//           ipAddress:
//             data.ipAddress,

//           userAgent:
//             data.userAgent,

//           requestId:
//             data.requestId,

//           method:
//             data.method,

//           endpoint:
//             data.endpoint,

//         },

//       });

//     } catch (error) {

//       console.error(
//         "Audit log failed:",
//         error
//       );

//     }

//   },

// };

import { auditQueue }
    from "./jobs/queues/auditQueue.js";

export const AuditService = {

    async log(data) {

        try {

            await auditQueue.add("create-audit-log",
                data,
                {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 3000,
                    },
                    removeOnComplete: 100,
                    removeOnFail: 500,
                }

            );

        } catch (error) {

            console.error("Audit queue error:", error);

        }

    },

};