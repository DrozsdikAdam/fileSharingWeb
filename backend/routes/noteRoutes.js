const express = require("express");
const {
  getNotes,
  addNotes,
  deleteNotes,
} = require("../controllers/noteController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", verifyToken, getNotes);
router.post("/", verifyToken, addNotes);
router.delete("/:id", verifyToken, deleteNotes);

module.exports = router;
