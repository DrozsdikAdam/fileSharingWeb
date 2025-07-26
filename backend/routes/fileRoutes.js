const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadFile,
  listFiles,
  getPresignedUrl,
  deleteFile,
} = require("../controllers/fileController");

const router = express.Router();
router.use(authMiddleware);

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), uploadFile);
router.get("/", listFiles);
router.get("/:filename", getPresignedUrl);
router.delete("/:filename", deleteFile);

module.exports = router;
