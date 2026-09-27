export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import getDb from '@/lib/db'

// TEMPORARY — diagnostic only, remove after we fix this
export async function GET(req: NextRequest) {
  const { getToken } = await import('next-auth/jwt')
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  let userCount = -1
  let emails: string[] = []
  try {
    const db = getDb()
    const rows = db.prepare('SELECT email FROM users').all() as { email: string }[]
    userCount = rows.length
    emails = rows.map(r => r.email)
  } catch (e) {
    return NextResponse.json({ dbError: String(e) })
  }

  return NextResponse.json({
    tokenExists: !!token,
    tokenRole: token?.role ?? null,
    tokenEmail: token?.email ?? null,
    userCountInSqlite: userCount,
    emailsInSqlite: emails,
  })
}

export async function POST(req: NextRequest) {
  const { getToken } = await import('next-auth/jwt')
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
  }

  const db = getDb()
  const user = db.prepare('SELECT * FROM users LIMIT 1').get() as { id:number; password:string } | undefined
  if (!user) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

  const match = await bcrypt.compare(currentPassword, user.password)
  if (!match) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })

  const newHash = await bcrypt.hash(newPassword, 10)
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(newHash, user.id)
  return NextResponse.json({ success: true })
}
