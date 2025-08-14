const { D1Database } = require("@cloudflare/d1")
require("dotenv").config();

const db = new D1Database({
    accountId: process.env.CF_ACCOUNT_ID,
    apiToken: process.env.CF_API_TOKEN,
    database: process.env.D1_DB_NAME,
})
module.exports = { db }