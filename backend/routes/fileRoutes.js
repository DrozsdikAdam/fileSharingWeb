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

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', verifyToken, upload.single('file'), uploadFile);
router.get('/', verifyToken, listFiles);
router.get('/download/:filename', verifyToken, getPresignedUrl);
router.delete('/:filename', verifyToken, deleteFile);

module.exports = router;
