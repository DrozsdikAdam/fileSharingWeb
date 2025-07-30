let notes = [];

exports.getNotes = (req, res) => {
  const userNotes = notes.filter((note) => note.user === req.user.email);
  res.json(userNotes);
};

exports.toggleActive = (req, res) => {
  const { id } = req.params
  const note = notes.find((n) => String(n.id) === String(id));
  if (!note) {
    return res.status(404).json({ error: "Jegyzet nem található" });
  }

  note.active = !note.active;

  res.status(200).json(note);
}

exports.addNotes = (req, res) => {
  const { content } = req.body;
  const newNote = {
    id: Date.now().toString(),
    content,
    user: req.user.email,
    createdAt: new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' }),
    active: true,
  };

  notes.push(newNote);
  console.log(newNote)
  res.status(201).json(newNote);
};

exports.deleteNotes = (req, res) => {
  const { id } = req.params;
  const initialLength = notes.length;

  // A jegyzetet csak akkor töröljük, ha az ID és a felhasználó is egyezik.
  notes = notes.filter(
    (note) => !(note.id === id && note.user === req.user.email)
  );

  // Küldjünk választ a kliensnek.
  if (notes.length < initialLength) res.status(204).send();
  else res.status(404).json({ message: "A jegyzet nem található vagy nincs jogosultságod a törléshez." });
};
