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

router.get("/", getNotes);
router.patch("/:id/active", toggleActive)
router.post("/", addNotes);
router.delete("/:id", deleteNotes);

module.exports = router;
