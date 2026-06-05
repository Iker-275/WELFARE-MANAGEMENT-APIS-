import { importRepo }
from "../repository/importRepo.js";

import { importQueue }
from "./jobs/queues/importQueue.js";

const repo =
  new ImportRepository();



class ImportService {
  async createImport({
    fileId,
    type,
    createdById,
  }) {
    const job = await importRepo.create({
      fileId,
      type,
      createdById,
    });

    const queueJob = await importQueue.add(
      "process-import",
      {
        importJobId: job.id,
      },
      {
        attempts: 3,
        removeOnComplete: 100,
        removeOnFail: 50,
      }
    );

    await importRepo.update(job.id, {
      queueJobId: queueJob.id.toString(),
    });

    return job;
  }

  async getStatus(id) {
    return importRepo.findById(id);
  }
}

module.exports = new ImportService();