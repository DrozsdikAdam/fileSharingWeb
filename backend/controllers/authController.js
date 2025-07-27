const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Ellenőrizzük, hogy a környezeti változók be vannak-e töltve
    if (!process.env.EMAIL || !process.env.HASHED_PASSWORD || !process.env.JWT_SECRET) {
      console.error("Hiányzó környezeti változók: EMAIL, HASHED_PASSWORD, vagy JWT_SECRET");
      return res.status(500).json({ error: "Szerver konfigurációs hiba." });
    }

    // 2. Helyes e-mail cím összehasonlítás
    if (email !== process.env.EMAIL) {
      return res.status(404).json({ error: "Nincs ilyen felhasználó!" });
    }

    const match = await bcrypt.compare(password, process.env.HASHED_PASSWORD);
    if (!match) {
      return res.status(401).json({ error: "Hibás jelszó!" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (error) {
    console.error("Bejelentkezési hiba:", error); // 3. Részletesebb hibaüzenet a konzolra
    res.status(500).json({ error: "Sikertelen bejelentkezés! A szerveren hiba történt." });
  }
};
