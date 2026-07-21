import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(request: NextRequest) {
  const { getToken } = await import('next-auth/jwt')
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let formData: FormData
  try { formData = await request.formData() } catch { return NextResponse.json({ error: 'Expected multipart/form-data.' }, { status: 400 }) }
  const value = formData.get('file')
  if (!(value instanceof File)) return NextResponse.json({ error: 'The file field is required.' }, { status: 400 })
  if (!ACCEPTED_TYPES.has(value.type)) return NextResponse.json({ error: 'Only JPG, PNG, WEBP, and GIF images are allowed.' }, { status: 415 })
  if (value.size === 0 || value.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'Images must be between 1 byte and 10 MB.' }, { status: 413 })

  try {
    const now = new Date()
    const year = String(now.getUTCFullYear())
    const month = String(now.getUTCMonth() + 1).padStart(2, '0')
    const relativeDirectory = path.posix.join('uploads', year, month)
    const outputDirectory = path.join(process.cwd(), 'public', relativeDirectory)
    const fileName = `${randomUUID()}.webp`
    await mkdir(outputDirectory, { recursive: true })
    const source = Buffer.from(await value.arrayBuffer())
    await sharp(source, { animated: value.type === 'image/gif' }).rotate().webp({ quality: 85 }).toFile(path.join(outputDirectory, fileName))
    return NextResponse.json({ url: `/${path.posix.join(relativeDirectory, fileName)}` }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'The uploaded file is not a valid image.' }, { status: 422 })
  }
}
