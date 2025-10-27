import 'dotenv/config'
import Database from 'better-sqlite3'
import fs from 'fs'
const DB_FILE = process.env.DB_FILE || './data/finance.db'
if (fs.existsSync(DB_FILE)) { fs.unlinkSync(DB_FILE); console.log('Banco removido:', DB_FILE) }
else { console.log('Banco ainda não existia:', DB_FILE) }