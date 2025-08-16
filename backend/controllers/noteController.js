require("dotenv").config();
const { runQuery, runExecute } = require("../database.js");

// GET /api/notes
exports.getNotes = async (req, res) => {
  try {
    const notes = await runQuery("SELECT * FROM notes ORDER BY created_at DESC");
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hiba a jegyzetek lekérdezésekor" });
  }
};

// POST /api/notes
exports.addNote = async (req, res) => {
  try {
    const { content } = req.body;
    const now = new Date();
    const createdAt = new Intl.DateTimeFormat("hu-HU", {
      timeZone: "Europe/Budapest",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(now);

    await runExecute(
      "INSERT INTO notes (content, created_at) VALUES (?, ?)",
      [content, createdAt]
    );

    res.json({ message: "Jegyzet hozzáadva" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hiba a jegyzet mentésekor" });
  }
};

// DELETE /api/notes/:id
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    await runExecute("DELETE FROM notes WHERE id = ?", [id]);

    res.json({ message: "Jegyzet törölve" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hiba a jegyzet törlésekor" });
  }
};

// PUT /api/notes/:id/toggle
exports.toggleActive = async (req, res) => {
  try {
    const { id } = req.params;

    // Aktuális állapot lekérdezése
    const notes = await runQuery("SELECT active FROM notes WHERE id = ?", [id]);
    if (notes.length === 0) {
      return res.status(404).json({ error: "Jegyzet nem található" });
    }

    const newActive = notes[0].active ? 0 : 1;

    await runExecute("UPDATE notes SET active = ? WHERE id = ?", [newActive, id]);

    res.json({ message: "Jegyzet státusza frissítve", active: newActive });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hiba a státusz frissítésekor" });
  }
};