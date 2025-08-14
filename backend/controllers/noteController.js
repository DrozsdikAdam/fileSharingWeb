const { db } = require("../config/db.js")

exports.getNotes = async (req, res) => {
  try {
    const notes = await db.prepare("SELECT * FROM notes").all()
    res.json(notes.results)
  } catch (error) {
    res.status(500).json({ error: "Hiba a jegyzetek lekérésekor" })
  }
};

exports.addNotes = async (req, res) => {
  const { content } = req.body;
  const timeStamp = Date.now();
  try {
    await db.prepare("INSERT INTO notes (content, active, createdAt) VALUES (?,?,?)").bind(content, 1, timeStamp).run();
    res.status(201).json({ content, active: 1, created_at: timeStamp })
  } catch (error) {
    res.status(500), json({ error: "Hiba a jegyzet létrehozásakor" })
  }
};

exports.deleteNotes = async (req, res) => {
  const { id } = req.params;

  try {
    await db.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();
    res.json({ message: "Jegyzet törölve" })
  } catch (error) {
    res.status(500).json({ error: "Hiba a jegyzetek törlésekor" })
  }

};

exports.toggleActive = async (req, res) => {
  const { id } = req.params
  try {
    const note = await db.prepare("SELECT * FROM notes WHERE id = ?").bind(id).first();
    if (!note) return res.status(404).json({ error: "Jegyzet nem található" });
    const newActive = note.active ? 0 : 1;
    await db.prepare("UPDATE notes SET active = ? WHERE id = ?").bind(newActive, id).run();

    res.json({ ...notes, active: newActive })

  } catch (error) {

  }
}
