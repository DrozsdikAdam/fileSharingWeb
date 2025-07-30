const express = require("express");
const {
  getNotes,
  addNotes,
  deleteNotes,
  toggleActive
} = require("../controllers/noteController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.use(verifyToken);

router.get("/", verifyToken, getNotes);
router.patch("/:id/active", verifyToken, toggleActive)
router.post("/", verifyToken, addNotes);
router.delete("/:id", verifyToken, deleteNotes);

module.exports = router;
