let notes = [];

exports.getNotes = (req, res) => {
  const userNotes = notes.filter((note) => note.user === req.user.email);
  res.json(userNotes);
};

exports.addNotes = (req, res) => {
  const { content } = req.body;
  const newNote = {
    id: Date.now().toString(),
    content,
    user: req.user.email,
    createdAt: new Date().toISOString()
  };
  notes.push(newNote);
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
