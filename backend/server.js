import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
app.use(cors()); app.use(express.json())

const DB_FILE = process.env.DB_FILE || './data/finance.db'
const dataDir = path.resolve(__dirname, path.dirname(DB_FILE))
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
const db = new Database(DB_FILE); db.pragma('journal_mode = WAL')

db.exec(`
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT CHECK(type IN ('income','expense')) NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  email TEXT NOT NULL,
  datetime TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
`)

function getSummary(){
  const totalsType = db.prepare(`
    SELECT type, ROUND(SUM(amount),2) as total FROM transactions GROUP BY type
  `).all()
  const byMonth = db.prepare(`
    SELECT substr(date,1,7) as ym, 
           ROUND(SUM(CASE WHEN type='income'  THEN amount ELSE 0 END), 2) as incomes,
           ROUND(SUM(CASE WHEN type='expense' THEN amount ELSE 0 END), 2) as expenses
    FROM transactions GROUP BY ym ORDER BY ym ASC
  `).all()
  const expenseByCategory = db.prepare(`
    SELECT category, ROUND(SUM(amount),2) as amount
    FROM transactions WHERE type='expense' GROUP BY category ORDER BY amount DESC
  `).all()
  return { totals: totalsType, byMonth, expenseByCategory }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
})

const timers = new Map()
function scheduleTask(row){
  const when = new Date(row.datetime).getTime(), now = Date.now(), delay = when - now
  if (delay <= 0) return
  if (timers.has(row.id)) clearTimeout(timers.get(row.id))
  const t = setTimeout(async ()=>{
    try{
      if (!process.env.SMTP_HOST) return
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: row.email,
        subject: `Lembrete: ${row.title}`,
        text: `Sua tarefa está marcada para agora: ${row.datetime}`,
      })
      timers.delete(row.id)
    }catch(err){ console.error('Erro ao enviar e-mail:', err?.message || err) }
  }, delay)
  timers.set(row.id, t)
}
db.prepare('SELECT * FROM tasks').all().forEach(scheduleTask)

app.get('/api/health', (_req, res)=> res.json({ ok:true }))

app.get('/api/transactions', (_req, res)=>{
  const rows = db.prepare('SELECT * FROM transactions ORDER BY date DESC, id DESC').all()
  res.json(rows)
})
app.post('/api/transactions', (req, res)=>{
  const { description, category, type, amount, date } = req.body || {}
  if (!description || !category || !type || amount == null || !date) return res.status(400).json({ error:'Campos obrigatórios: description, category, type, amount, date (YYYY-MM-DD)' })
  if (!['income','expense'].includes(type)) return res.status(400).json({ error:"type deve ser 'income' ou 'expense'" })
  const info = db.prepare('INSERT INTO transactions (description, category, type, amount, date) VALUES (?,?,?,?,?)')
               .run(description, category, type, Number(amount), date)
  const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(info.lastInsertRowid)
  res.status(201).json(row)
})
app.put('/api/transactions/:id', (req, res)=>{
  const id = Number(req.params.id), p = req.body || {}
  if (!p.description || !p.category || !p.type || typeof p.amount !== 'number' || !p.date) return res.status(400).json({ error:'Dados inválidos' })
  const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id)
  if (!row) return res.status(404).json({ error:'Not found' })
  db.prepare('UPDATE transactions SET description=?, category=?, type=?, amount=?, date=? WHERE id=?')
    .run(p.description, p.category, p.type, p.amount, p.date, id)
  res.json({ ok:true, id })
})
app.delete('/api/transactions/:id', (req, res)=>{
  const id = Number(req.params.id)
  const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id)
  if (!row) return res.status(404).json({ error:'Not found' })
  db.prepare('DELETE FROM transactions WHERE id = ?').run(id)
  res.json({ ok:true, id })
})
app.get('/api/summary', (_req, res)=> res.json(getSummary()))

app.get('/api/tasks', (_req, res)=>{ res.json(db.prepare('SELECT * FROM tasks ORDER BY datetime ASC').all()) })
app.post('/api/tasks', (req, res)=>{
  const { title, email, datetime } = req.body || {}
  if (!title || !email || !datetime) return res.status(400).json({ error:'Campos obrigatórios: title, email, datetime' })
  const info = db.prepare('INSERT INTO tasks (title, email, datetime) VALUES (?,?,?)').run(title, email, datetime)
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid)
  scheduleTask(row); res.json(row)
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> console.log(`API rodando em http://localhost:${PORT}`))
