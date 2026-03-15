// src/app/api/data/[collection]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

const VALID_COLLECTIONS = [
  'jobs', 'exams', 'info', 'pdfforms',
  'affiliate', 'settings', 'results',
  'announcements', 'guides', 'services'
]

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function getFilePath(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`)
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ collection: string }> }
) {
  const { collection } = await context.params
  if (!VALID_COLLECTIONS.includes(collection))
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })

  ensureDataDir()
  const filePath = getFilePath(collection)
  if (!fs.existsSync(filePath)) return NextResponse.json([])
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return NextResponse.json(data)
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ collection: string }> }
) {
  const { collection } = await context.params
  if (!VALID_COLLECTIONS.includes(collection))
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })

  const { getToken } = await import('next-auth/jwt')
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  ensureDataDir()
  const data = await req.json()
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2))
  return NextResponse.json({ success: true })
}
