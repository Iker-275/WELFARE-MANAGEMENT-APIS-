import { importService }
    from "../services/importService.js";



exports.createImport = async (req, res) => {
  const job = await importService.createImport({
    fileId: req.body.fileId,
    type: req.body.type,
    createdById: req.user.id,
  });

  return res.status(201).json({
    success: true,
    data: job,
  });
};

exports.getImportStatus = async (req, res) => {
  const job = await importService.getStatus(
    req.params.id
  );

  return res.json(job);
};