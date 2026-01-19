
const Files = require('../models/files.model');

exports.uploadFile = async (req, res, next) => {
  try {
    const uploadedBy = req.body.uploaded_by || null;
    const result = await Files.create(req.file, uploadedBy);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
