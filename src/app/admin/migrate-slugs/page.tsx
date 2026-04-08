// src/app/admin/migrate-slugs/page.tsx
// ✅ ONE-TIME MIGRATION — adds slugs to all existing records that have none
// Visit /admin/migrate-slugs once, then you can delete this file
'use client'
import { useState } from 'react'

// Same slugify function used everywhere in your app
function generateSlug(title: string, id: number): string {
  return title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + '-' + id
}

// All collections that have detail pages with slugs
const COLLECTIONS = ['jobs', 'exams', 'info', 'results', 'announcements', 'services', 'guides']

type Result = {
  collection: string
  total: number
  fixed: number
  skipped: number
  status: 'idle' | 'running' | 'done' | 'error'
  message: string
}

export default function MigrateSlugsPage() {
  const [results, setResults] = useState<Result[]>(
    COLLECTIONS.map(c => ({
      collection: c, total: 0, fixed: 0,
      skipped: 0, status: 'idle', message: ''
    }))
  )
  const [running, setRunning] = useState(false)
  const [done, setDone]       = useState(false)

  async function migrateOne(collection: string, idx: number) {
    // Step 1 — mark as running
    setResults(prev => prev.map((r, i) =>
      i === idx ? { ...r, status: 'running', message: 'Fetching records...' } : r
    ))

    try {
      // Step 2 — fetch existing data
      const res = await fetch(`/api/data/${collection}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
      const records: any[] = await res.json()

      if (!Array.isArray(records) || records.length === 0) {
        setResults(prev => prev.map((r, i) =>
          i === idx ? { ...r, status: 'done', total: 0, fixed: 0, skipped: 0, message: '✅ No records found — skipped' } : r
        ))
        return
      }

      // Step 3 — add slug to records that are missing one
      let fixed = 0
      let skipped = 0
      const updated = records.map((record: any) => {
        if (record.slug && record.slug.trim() !== '') {
          skipped++
          return record // already has slug, leave it alone
        }
        if (!record.title) {
          skipped++
          return record // no title to generate from
        }
        fixed++
        return {
          ...record,
          slug: generateSlug(String(record.title), Number(record.id) || Date.now())
        }
      })

      if (fixed === 0) {
        setResults(prev => prev.map((r, i) =>
          i === idx ? {
            ...r, status: 'done',
            total: records.length, fixed: 0, skipped,
            message: `✅ All ${records.length} records already had slugs`
          } : r
        ))
        return
      }

      // Step 4 — save updated records back
      setResults(prev => prev.map((r, i) =>
        i === idx ? { ...r, message: `Saving ${fixed} updated records...` } : r
      ))

      const saveRes = await fetch(`/api/data/${collection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (!saveRes.ok) throw new Error(`Save failed: ${saveRes.status}`)

      setResults(prev => prev.map((r, i) =>
        i === idx ? {
          ...r, status: 'done',
          total: records.length, fixed, skipped,
          message: `✅ ${fixed} slugs added, ${skipped} already had slugs`
        } : r
      ))

    } catch (err: any) {
      setResults(prev => prev.map((r, i) =>
        i === idx ? {
          ...r, status: 'error',
          message: '❌ Error: ' + (err.message || 'Unknown error')
        } : r
      ))
    }
  }

  async function migrateAll() {
    setRunning(true)
    for (let i = 0; i < COLLECTIONS.length; i++) {
      await migrateOne(COLLECTIONS[i], i)
    }
    setRunning(false)
    setDone(true)
  }

  const STATUS_COLOR: Record<string, string> = {
    idle:    '#8fa3b8',
    running: '#1dbfad',
    done:    '#22c55e',
    error:   '#ef4444',
  }

  const LABELS: Record<string, string> = {
    jobs: '💼 Jobs', exams: '📚 Exams', info: 'ℹ️ Information',
    results: '📊 Results', announcements: '📢 Announcements',
    services: '⚙️ Services', guides: '📖 Guides',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', padding: '40px 20px', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#0b1f33', margin: '0 0 8px' }}>
            🔧 One-Time Slug Migration
          </h1>
          <p style={{ color: '#5a6a7a', fontSize: '.88rem', margin: 0, lineHeight: 1.6 }}>
            This tool adds SEO-friendly slugs to all existing records that don't have one.
            Records that already have a slug will not be touched.
            <strong style={{ color: '#e63946' }}> Run this only once.</strong>
          </p>
        </div>

        {/* Warning box */}
        <div style={{ background: '#fff8e1', border: '1.5px solid #ffe082', borderRadius: 12, padding: '14px 18px', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, color: '#5d4037', marginBottom: 6 }}>⚠️ Before you click:</div>
          <div style={{ fontSize: '.83rem', color: '#6d4c41', lineHeight: 1.8 }}>
            • This will read and rewrite your MySQL data<br />
            • Nothing is deleted — only a <code>slug</code> field is added to records missing one<br />
            • After running, your URLs will change from <code>/jobs/123</code> to <code>/jobs/job-title-123</code><br />
            • Old numeric URLs still work (your page.tsx checks both slug and id)
          </div>
        </div>

        {/* Collection list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {results.map((r, i) => (
            <div key={r.collection} style={{
              background: '#fff', border: '1.5px solid #d4e0ec',
              borderRadius: 12, padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#0b1f33', marginBottom: 3 }}>
                  {LABELS[r.collection]}
                </div>
                <div style={{ fontSize: '.8rem', color: STATUS_COLOR[r.status], fontWeight: 700 }}>
                  {r.status === 'idle' ? 'Waiting...' : r.message}
                </div>
              </div>
              {r.status === 'done' && r.fixed > 0 && (
                <div style={{ textAlign: 'right', fontSize: '.78rem' }}>
                  <div style={{ color: '#22c55e', fontWeight: 800 }}>+{r.fixed} slugs</div>
                  <div style={{ color: '#8fa3b8' }}>{r.skipped} skipped</div>
                </div>
              )}
              {r.status === 'running' && (
                <div style={{ color: '#1dbfad', fontSize: '1.2rem' }}>⏳</div>
              )}
              {r.status === 'done' && (
                <div style={{ color: '#22c55e', fontSize: '1.2rem' }}>✅</div>
              )}
              {r.status === 'error' && (
                <button onClick={() => migrateOne(r.collection, i)}
                  style={{ padding: '6px 14px', borderRadius: 8, background: '#fde8ea', border: '1.5px solid #f7bcc0', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '.8rem' }}>
                  🔄 Retry
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Action button */}
        {!done ? (
          <button onClick={migrateAll} disabled={running} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none',
            background: running ? '#8fa3b8' : '#0b1f33', color: '#c9a227',
            fontFamily: 'Arial Black, sans-serif', fontWeight: 900,
            fontSize: '1rem', cursor: running ? 'not-allowed' : 'pointer'
          }}>
            {running ? '⏳ Migrating — please wait...' : '🚀 Start Migration — Fix All Slugs'}
          </button>
        ) : (
          <div style={{ background: '#e8f5e9', border: '1.5px solid #a5d6a7', borderRadius: 12, padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, color: '#1b5e20', marginBottom: 6 }}>
              Migration Complete!
            </div>
            <div style={{ fontSize: '.85rem', color: '#2e7d32', marginBottom: 14 }}>
              All records now have SEO-friendly slugs.
              Your URLs will now show as <code>/jobs/assam-police-recruitment-2026-123</code>
            </div>
            <a href="/admin/dashboard" style={{
              display: 'inline-block', padding: '10px 24px', borderRadius: 10,
              background: '#0b1f33', color: '#c9a227', textDecoration: 'none',
              fontWeight: 900, fontFamily: 'Arial Black, sans-serif', fontSize: '.85rem'
            }}>
              ← Back to Dashboard
            </a>
          </div>
        )}

      </div>
    </div>
  )
}