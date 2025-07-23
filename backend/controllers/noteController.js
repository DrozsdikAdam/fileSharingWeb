let notes = [];

exports.getNotes = (req, res) => {
  const userNotes = notes.filter((note) => note.user === req.user.email);
  res.json(userNotes);
};

exports.deleteNotes = (req, res) => {
  const { id } = req.params;
  notes = notes.filter(
    (note) => note.id !== id || note.user !== req.user.email
  );
};
