const fs = require("fs");
const path = require("path");

exports.uploadFile = (req, res) => {
  res
    .status(201)
    .json({ message: "Fájl feltöltve", filename: req.file.filename });
};

exports.listFile = (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Nem sikerült listázni a fájlokat" });
    res.json(files);
  });
};

exports.downloadFile = (req, res) => {
  const filepath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filepath);
};

exports.deleteFile = (req, res) => {
  const filepath = path.join(__dirname, "../uploads", req.params.filename);
  fs.unlink(filepath, (err) => {
    if (err)
      return res.status(500).json({ error: "Nem sikerült törölni a fájlt" });
    res.json({ message: "Sikeresen törölve" });
  });
};
