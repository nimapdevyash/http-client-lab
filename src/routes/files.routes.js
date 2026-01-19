
const express = require('express');
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/files.controller');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../Public/uploads/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), controller.uploadFile);

module.exports = router;
