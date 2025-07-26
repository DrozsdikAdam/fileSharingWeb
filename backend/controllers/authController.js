const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email === process.env.EMAIL) return res.status(404).json({ error: "Nincs ilyen felhasználó!" });

    const match = await bcrypt.compare(password, process.env.HASHED_PASSWORD);
    if (!match) return res.status(401).json({ error: "Hibás jelszó!" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Sikertelen bejelentkezés!" })
  }
};
