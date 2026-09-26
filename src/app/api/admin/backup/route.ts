// src/app/api/admin/backup/route.ts
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/mysql'
import getDb from '@/lib/db'

export async function GET(req: NextRequest) {
  // Same admin check already used in src/app/api/data/[collection]/route.ts
  const { getToken } = await import('next-auth/jwt')
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. MySQL — every row from acpi_data (your actual site content)
    const [rows] = await pool.execute('SELECT collection, data, updated_at FROM acpi_data') as any[]
    const mysqlBackup = rows.map((r: any) => ({
      collection: r.collection,
      data: JSON.parse(r.data),
      updatedAt: r.updated_at,
    }))

    // 2. SQLite — admin login accounts (email + bcrypt hash, never plaintext)
    const db = getDb()
    const adminUsers = db.prepare('SELECT id, email, password, created_at FROM users').all()

    const backup = {
      exportedAt: new Date().toISOString(),
      mysql: mysqlBackup,
      adminUsers,
    }

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="acpi-backup-${new Date().toISOString().slice(0,10)}.json"`,
      },
    })
  } catch (err) {
    console.error('Backup failed:', err)
    return NextResponse.json({ error: 'Backup failed' }, { status: 500 })
  }
}
