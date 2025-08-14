require("dotenv").config();
let db;

if (process.env.USE_D1 === "true") {
    const { D1Database } = require("@cloudflare/d1")
    db = new D1Database({
        accountId: process.env.CF_ACCOUNT_ID,
        apiToken: process.env.CF_API_TOKEN,
        database: process.env.D1_DB_NAME,
    })
} else {
    const Database = require("better-sqlite3");
    const path = require("path");

    // SQLite fájl helye
    const dbPath = path.join(__dirname, "../notes.db");
    db = new Database(dbPath);
}

module.exports = { db }