const express = require("express");
const multer = require("multer");
const path = require("path");
const verifyToken = require("../middleware/authMiddleware");
const {
  uploadFile,
  listFiles,
  getPresignedUrl,
  deleteFile,
} = require("../controllers/fileController");

const router = express.Router();
router.use(verifyToken);

// Váltás memoryStorage-re a hatékonyabb S3 feltöltés érdekében
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), uploadFile);
router.get('/', listFiles);
router.get('/download/:filename', getPresignedUrl);
router.delete('/:filename', deleteFile);

module.exports = router;
