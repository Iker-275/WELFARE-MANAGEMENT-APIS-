import { NextOfKinRepository } from "../repository/nextOfKinRepo.js";

import { AuditService } from "./auditService.js";

const repo = new NextOfKinRepository();

export class NextOfKinService {
    async getMine(userId) {
        return repo.findByUserId(userId);
    }


    async saveNextOfKin(userId, data, performedById) {
        const existing = await repo.findByUserId(userId);
        let result;

        // UPDATE
        console.log("Existing NOK:", existing);

        if (existing) {
            result = await repo.update(existing.id, data);
            console.log("Data to update:", data);
            console.log("Updated NOK:", result);

            await AuditService.log({
                action: "NEXT_OF_KIN_UPDATED",
                entityType: "NextOfKin",
                entityId: existing.id,
                performedById,

            });

        }

        // CREATE

        else {
            console.log("Creating new NOK with data:", data);
            result = await repo.create({
                ...data,
                userId,
            });
            console.log("Data used for creation:", { ...data, userId });
console.log("Created NOK:", result);
            await AuditService.log({
                action: "NEXT_OF_KIN_CREATED",
                entityType: "NextOfKin",
                entityId: result.id,
                performedById,

            });

        }

        return result;

    }

}