const express = require("express");
const {
  getNotes,
  addNote,
  deleteNote,
  toggleActive
} = require("../controllers/noteController.js");


const verifyToken = require("../middleware/authMiddleware.js");

const router = express.Router();

router.use(verifyToken);

router.get("/", getNotes);
router.patch("/:id/active", toggleActive)
router.post("/", addNote);
router.delete("/:id", deleteNote);

module.exports = router;
