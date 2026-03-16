// src/lib/mysql.ts
// MySQL database connection for ACPI portal

import mysql from 'mysql2/promise'

// Connection pool — reuses connections efficiently
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user:     process.env.MYSQL_USER     || 'u570952740_acpiuser',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'u570952740_acpidata',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
})

// ── Read a collection ─────────────────────────────────────────────
export async function getCollection(collection: string): Promise<unknown[]> {
  try {
    const [rows] = await pool.execute(
      'SELECT data FROM acpi_data WHERE collection = ?',
      [collection]
    ) as mysql.RowDataPacket[][]
    if (rows.length === 0) return []
    return JSON.parse(rows[0].data) || []
  } catch (err) {
    console.error(`DB read error for ${collection}:`, err)
    return []
  }
}

// ── Save a collection ─────────────────────────────────────────────
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
