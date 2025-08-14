require("dotenv").config();
const { db } = require("./config/db.js");

const isD1 = process.env.USE_D1 === "true";

// Helper, hogy mindkét módhoz egységes lekérdezés legyen
async function runQuery(sql, params = []) {
    if (isD1) {
        // Cloudflare D1 async
        const result = await db.prepare(sql).bind(...params).all();
        return result.results || [];
    } else {
        // SQLite sync. Az async függvény miatt Promise-ként tér vissza.
        return db.prepare(sql).all(...params);
    }
}

async function runExecute(sql, params = []) {
    if (isD1) {
        // Cloudflare D1 async
        return await db.prepare(sql).bind(...params).run();
    } else {
        // SQLite sync. Az async függvény miatt Promise-ként tér vissza.
        return db.prepare(sql).run(...params);
    }
}

module.exports = { runQuery, runExecute };