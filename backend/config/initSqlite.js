// SQLite adatbázis inicializáló script
require("dotenv").config();
const path = require("path");
const Database = require("better-sqlite3");

// SQLite fájl helye
const dbPath = path.join(__dirname, "../notes.db");
const db = new Database(dbPath);

// Táblák létrehozása, ha nem léteznek
db.prepare(`
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT NOT NULL
)
`).run();

console.log("✅ SQLite adatbázis inicializálva:", dbPath);