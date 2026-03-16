// src/app/api/data/[collection]/route.ts
// ✅ Uses MySQL database — data persists forever, works on ALL devices

import { NextRequest, NextResponse } from 'next/server'
import { getCollection, setCollection } from '@/lib/mysql'

const VALID_COLLECTIONS = [
  'jobs', 'exams', 'info', 'pdfforms',
  'affiliate', 'settings', 'results',
  'announcements', 'guides', 'services'
]

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ collection: string }> }
) {
  const { collection } = await context.params

  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  const data = await getCollection(collection)
  return NextResponse.json(data)
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ collection: string }> }
) {
  const { collection } = await context.params

  if (!VALID_COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: 'Invalid collection' }, { status: 400 })
  }

  // Check authentication
  const { getToken } = await import('next-auth/jwt')
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const success = await setCollection(collection, data)

  if (success) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ error: 'Database write failed' }, { status: 500 })
  }
}
