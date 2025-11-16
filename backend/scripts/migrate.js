import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_FILE = path.resolve(__dirname, '../data/finance.db')

console.log(`Migrando banco de dados: ${DB_FILE}`)

const db = new Database(DB_FILE)

try {
  // Verificar colunas existentes na tabela tasks
  const tableInfo = db.pragma('table_info(tasks)')
  const hasRemind = tableInfo.some(col => col.name === 'remind_minutes_before')
  const hasCompleted = tableInfo.some(col => col.name === 'completed')

  if (hasRemind) {
    console.log('✓ Coluna remind_minutes_before já existe')
  } else {
    console.log('Adicionando coluna remind_minutes_before...')
    db.exec('ALTER TABLE tasks ADD COLUMN remind_minutes_before INTEGER DEFAULT 0')
    console.log('✓ Coluna remind_minutes_before adicionada com sucesso')
  }

  if (hasCompleted) {
    console.log('✓ Coluna completed já existe')
  } else {
    console.log('Adicionando coluna completed...')
    db.exec('ALTER TABLE tasks ADD COLUMN completed INTEGER DEFAULT 0')
    console.log('✓ Coluna completed adicionada com sucesso')
  }

  console.log('✓ Migração concluída')
} catch (err) {
  console.error('✗ Erro na migração:', err.message)
  process.exit(1)
} finally {
  db.close()
}
