const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = [];

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  Users.push({ email, password: hashed });
  res.json({ message: "Sikeres regisztráció!" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = Users.find((u) => u.email === email);
  if (!user) return res.status(404).json({ error: "Nincs ilyen felhasználó!" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Hibás jelszó!" });

  const token = jwt.sign({ email }, "titkosítókulcs", { expiresIn: "1d" });
  res.json({ token });
};
