// src/app/api/data/[collection]/route.ts
// Server-side data storage using JSON files
// This replaces localStorage — data is stored on the server, visible to ALL visitors

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Where data files are stored on the server
const DATA_DIR = path.join(process.cwd(), 'data')

// Make sure the data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Valid collection names — security check
const VALID_COLLECTIONS = [
  'jobs', 'exams', 'info', 'pdfforms',
  'affiliate', 'settings', 'results',
  'announcements', 'guides', 'services'
]

function getFilePath(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`)
}

// ── GET: Read data ────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { collection: string } }
) {
  const collection = params.collection

  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  ensureDataDir()
  const filePath = getFilePath(collection)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json([]) // Return empty array if no data yet
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  return NextResponse.json(data)
}

// ── POST: Save data ───────────────────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: { collection: string } }
) {
  const collection = params.collection

  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  // Check authentication — only admin can save
  const { getToken } = await import('next-auth/jwt')
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  ensureDataDir()
  const data = await req.json()
  const filePath = getFilePath(collection)

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  return NextResponse.json({ success: true })
}
