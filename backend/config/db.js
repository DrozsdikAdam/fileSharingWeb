import { D1Database } from "@cloudflare/d1"
import dotenv from "dotenv"
dotenv.config()

export const db = new D1Database({
    accountId: process.env.CF_ACCOUNT_ID,
    apiToken: process.env.CF_API_TOKEN,
    database: process.env.D1_DB_NAME,
})