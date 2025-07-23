const express = require("express");
const {
  getNotes,
  addNote,
  deleteNote,
} = require("../controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotes);
router.post("/", addNotes);
router.delete("/:id", deleteNotes);

module.exports = router;
