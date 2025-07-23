const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadFile,
  listFile,
  downloadFile,
  deleteFile,
} = require("../controllers/fileController");

const router = express.Router();
router.use(authMiddleware);

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, res, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), uploadFile);
router.get("/", listFile);
router.get("/:filename", downloadFile);
router.delete("/:filename", deleteFile);

module.exports = router;
