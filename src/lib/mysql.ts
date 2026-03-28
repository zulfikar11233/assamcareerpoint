// src/lib/mysql.ts
import mysql from 'mysql2/promise'

// ✅ Single persistent pool with keep-alive
// ⚠️ Never commit real DB credentials — use .env.local only (MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)
const pool = mysql.createPool({
  host:               process.env.MYSQL_HOST     || '127.0.0.1',
  user:               process.env.MYSQL_USER     || '',
  password:           process.env.MYSQL_PASSWORD || '',
  database:           process.env.MYSQL_DATABASE || '',
  waitForConnections: true,
  connectionLimit:    5,
  queueLimit:         0,
  enableKeepAlive:    true,
  keepAliveInitialDelay: 0,
  connectTimeout:     10000,
})
// Warm up connection on startup with retry
async function warmUp() {
  for (let i = 0; i < 3; i++) {
    try {
      const conn = await pool.getConnection()
      conn.release()
      console.log('✅ MySQL pool warmed up')
      return
    } catch {
      await new Promise(r => setTimeout(r, 1000))
    }
  }
  console.error('⚠️ MySQL warmup failed after 3 attempts')
}
warmUp()
// ── Read ─────────────────────────────────────────────────────────
export async function getCollection(collection: string): Promise<unknown[]> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const [rows] = await pool.execute(
        'SELECT data FROM acpi_data WHERE collection = ?',
        [collection]
      ) as mysql.RowDataPacket[][]
      if (!rows.length) return []
      const parsed = JSON.parse(rows[0].data)
      return Array.isArray(parsed) ? parsed : []
    } catch (err) {
      console.error(`DB read error for ${collection} (attempt ${attempt}):`, err)
      if (attempt < 3) await new Promise(r => setTimeout(r, 800))
    }
  }
  return []
}

// ── Write ─────────────────────────────────────────────────────────
export async function setCollection(collection: string, data: unknown): Promise<boolean> {
  try {
    await pool.execute(
      'INSERT INTO acpi_data (collection, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = ?, updated_at = NOW()',
      [collection, JSON.stringify(data), JSON.stringify(data)]
    )
    return true
  } catch (err) {
    console.error(`DB write error for ${collection}:`, err)
    return false
  }
}

export default pool
