'use client'
export const dynamic = 'force-dynamic'
// src/app/admin/results/page.tsx
// ✅ Admin CMS for Results (Merit Lists, Answer Keys, Cut-off Marks, etc.)

import { useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import {
  ResultPost, ResultSection, ResultLink,
  getResultPosts, saveResultPosts,
  generateResultSlug, RESULT_CATEGORIES,
  newResultSectionId, newResultLinkId,
} from '@/lib/results-db'

// ─── Colors ───────────────────────────────────────────────────────────────────
const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

// ─── Shared styles ────────────────────────────────────────────────────────────
const si: React.CSSProperties = {
  width: '100%', padding: '9px 13px', borderRadius: 8,
  border: '1.5px solid #d4e0ec', fontSize: '.88rem',
  fontFamily: 'Nunito,sans-serif', outline: 'none', background: '#fafcff',
}
const lb: React.CSSProperties = {
  display: 'block', fontSize: '.78rem', fontWeight: 700,
  color: '#3a5068', marginBottom: 5, fontFamily: 'Nunito,sans-serif',
}
const bP: React.CSSProperties = {
  padding: '10px 22px', borderRadius: 9, background: G, color: N,
  fontWeight: 900, fontSize: '.86rem', border: 'none', cursor: 'pointer',
  fontFamily: 'Arial Black,sans-serif',
}
const bS: React.CSSProperties = {
  padding: '10px 18px', borderRadius: 9, background: '#f0f4f8', color: '#3a5068',
  fontWeight: 700, fontSize: '.86rem', border: '1.5px solid #d4e0ec', cursor: 'pointer',
  fontFamily: 'Nunito,sans-serif',
}
const bDanger: React.CSSProperties = {
  padding: '6px 14px', borderRadius: 7, background: '#fff0f0', color: '#c0392b',
  fontWeight: 700, fontSize: '.78rem', border: '1.5px solid #f5c6c6', cursor: 'pointer',
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState('')
  const toast = useCallback((m: string) => {
    setMsg(m); setTimeout(() => setMsg(''), 3000)
  }, [])
  return { msg, toast }
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <aside style={{
      width: 230, minHeight: '100vh', background: N,
      borderRight: `2px solid ${G}33`, display: 'flex', flexDirection: 'column',
      padding: '0 0 20px', position: 'sticky', top: 0, flexShrink: 0,
    }}>
      <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid #ffffff18` }}>
        <div style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '.88rem', lineHeight: 1.3 }}>
          <span style={{ color: G }}>ASSAM </span>
          <span style={{ color: W }}>CAREER</span>
          <span style={{ color: T }}> POINT</span>
        </div>
        <div style={{ color: '#8fa3b8', fontSize: '.68rem', marginTop: 2 }}>ADMIN PANEL v6</div>
      </div>
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {[
          ['/admin/dashboard', '🏠', 'Dashboard'],
          ['/admin/dashboard', '💼', 'Job Vacancies'],
          ['/admin/dashboard', '📚', 'Exams'],
          ['/admin/dashboard', 'ℹ️', 'Information'],
          ['/admin/dashboard', '📄', 'PDF Forms'],
          ['/admin/dashboard', '🤝', 'Affiliates'],
        ].map(([href, icon, label]) => (
          <Link key={label} href={href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
            borderRadius: 8, textDecoration: 'none', fontSize: '.86rem', fontWeight: 600,
            color: '#b0c4d8', fontFamily: 'Nunito,sans-serif', marginBottom: 2,
          }}>{icon} {label}</Link>
        ))}
        <div style={{ height: 1, background: '#ffffff18', margin: '10px 6px' }} />
        <Link href="/admin/results" style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
          borderRadius: 8, textDecoration: 'none', fontSize: '.86rem', fontWeight: 700,
          color: N, background: G, fontFamily: 'Nunito,sans-serif', marginBottom: 2,
        }}>📊 Results</Link>
        <Link href="/admin/others" style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
          borderRadius: 8, textDecoration: 'none', fontSize: '.86rem', fontWeight: 600,
          color: '#b0c4d8', fontFamily: 'Nunito,sans-serif', marginBottom: 2,
        }}>📂 Others CMS</Link>
        <div style={{ height: 1, background: '#ffffff18', margin: '10px 6px' }} />
        <div style={{ padding: '4px 6px', fontSize: '.68rem', color: '#6a8099', fontWeight: 700, letterSpacing: 1 }}>
          PUBLIC PAGES ↗
        </div>
        {[
          ['/', '🏠', 'Home'],
          ['/govt-jobs', '💼', 'Govt Jobs'],
          ['/exams', '📚', 'Exams'],
          ['/results', '📊', 'Results'],
        ].map(([href, icon, label]) => (
          <Link key={label} href={href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px',
            borderRadius: 8, textDecoration: 'none', fontSize: '.82rem',
            color: '#6a8099', fontFamily: 'Nunito,sans-serif',
          }}>{icon} {label}</Link>
        ))}
      </nav>
      <div style={{ padding: '10px 14px', borderTop: `1px solid #ffffff18`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: T, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: N, fontSize: '.9rem' }}>A</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: W, fontSize: '.8rem', fontWeight: 700 }}>Admin</div>
          <div style={{ color: '#6a8099', fontSize: '.68rem' }}>Super Admin</div>
        </div>
        <button onClick={() => signOut()} title="Sign out" style={{ background: 'none', border: 'none', color: '#6a8099', cursor: 'pointer', fontSize: '1rem' }}>⏏</button>
      </div>
    </aside>
  )
}

// ─── Section Builder ──────────────────────────────────────────────────────────
function SectionBuilder({ sections, onChange }: {
  sections: ResultSection[]
  onChange: (s: ResultSection[]) => void
}) {
  const update = (idx: number, patch: Partial<ResultSection>) =>
    onChange(sections.map((s, i) => i === idx ? { ...s, ...patch } : s))

  const addLink = (idx: number) => {
    if (sections[idx].links.length >= 10) return
    update(idx, { links: [...sections[idx].links, { id: newResultLinkId(), label: '', url: '' }] })
  }
  const updateLink = (si2: number, li: number, patch: Partial<ResultLink>) =>
    update(si2, { links: sections[si2].links.map((l, i) => i === li ? { ...l, ...patch } : l) })
  const removeLink = (si2: number, li: number) =>
    update(si2, { links: sections[si2].links.filter((_, i) => i !== li) })
  const removeSection = (idx: number) => onChange(sections.filter((_, i) => i !== idx))
  const moveUp = (idx: number) => {
    if (idx === 0) return
    const a = [...sections]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; onChange(a)
  }
  const moveDown = (idx: number) => {
    if (idx === sections.length - 1) return
    const a = [...sections]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; onChange(a)
  }

  return (
    <div>
      {sections.map((sec, idx) => (
        <div key={sec.id} style={{ border: '1.5px solid #d4e0ec', borderRadius: 10, marginBottom: 12, background: '#fafcff', overflow: 'hidden' }}>
          {/* Section header bar */}
          <div style={{ background: '#eef3f9', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #d4e0ec' }}>
            <span style={{ fontSize: '.78rem', fontWeight: 800, color: '#3a5068', fontFamily: 'Nunito,sans-serif' }}>
              Section {idx + 1}
            </span>
            <div style={{ flex: 1 }} />
            <button type="button" onClick={() => moveUp(idx)} style={{ ...bS, padding: '3px 8px', fontSize: '.75rem' }}>↑</button>
            <button type="button" onClick={() => moveDown(idx)} style={{ ...bS, padding: '3px 8px', fontSize: '.75rem' }}>↓</button>
            <button type="button" onClick={() => removeSection(idx)} style={{ ...bDanger, padding: '3px 10px' }}>✕ Remove</button>
          </div>

          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Title */}
            <div>
              <label style={lb}>Section Title *</label>
              <input value={sec.title} onChange={e => update(idx, { title: e.target.value })}
                style={si} placeholder="e.g. Merit List Details / How to Check / Cut-off Marks" />
            </div>
            {/* Content */}
            <div>
              <label style={lb}>Content / Details</label>
              <textarea value={sec.content} onChange={e => update(idx, { content: e.target.value })}
                style={{ ...si, minHeight: 80, resize: 'vertical' as const }}
                placeholder="Write the details for this section. Each line will appear as a paragraph." />
            </div>
            {/* PDF Link */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
              <div>
                <label style={lb}>📄 Google Drive PDF Link (optional)</label>
                <input value={sec.pdfLink || ''} onChange={e => update(idx, { pdfLink: e.target.value })}
                  style={si} placeholder="https://drive.google.com/file/d/..." />
              </div>
              <div>
                <label style={lb}>PDF Button Label</label>
                <input value={sec.pdfName || ''} onChange={e => update(idx, { pdfName: e.target.value })}
                  style={si} placeholder="e.g. Download Merit List" />
              </div>
            </div>
            {/* Links Table */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ ...lb, marginBottom: 0 }}>🔗 Important Links ({sec.links.length}/10)</label>
                {sec.links.length < 10 && (
                  <button type="button" onClick={() => addLink(idx)}
                    style={{ ...bS, padding: '4px 12px', fontSize: '.75rem' }}>+ Add Link</button>
                )}
              </div>
              {sec.links.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#eef3f9' }}>
                      <th style={{ padding: '6px 8px', fontSize: '.72rem', color: '#3a5068', fontWeight: 700, textAlign: 'left', borderBottom: '1px solid #d4e0ec' }}>Label <span style={{fontWeight:400,color:'#8fa3b8'}}>(e.g. Official Website)</span></th>
                      <th style={{ padding: '6px 8px', fontSize: '.72rem', color: '#3a5068', fontWeight: 700, textAlign: 'left', borderBottom: '1px solid #d4e0ec' }}>URL <span style={{fontWeight:400,color:'#8fa3b8'}}>(https://...)</span></th>
                      <th style={{ width: 40, borderBottom: '1px solid #d4e0ec' }} />
                    </tr>
                  </thead>
                  <tbody>
                    {sec.links.map((lnk, li) => (
                      <tr key={lnk.id}>
                        <td style={{ padding: '5px 6px' }}>
                          <input value={lnk.label}
                            onChange={e => updateLink(idx, li, { label: e.target.value })}
                            style={{ ...si, padding: '6px 9px' }}
                            placeholder="e.g. Final Merit List LP" />
                        </td>
                        <td style={{ padding: '5px 6px' }}>
                          <input value={lnk.url}
                            onChange={e => updateLink(idx, li, { url: e.target.value })}
                            style={{ ...si, padding: '6px 9px' }}
                            placeholder="https://dee.assam.gov.in/..." />
                        </td>
                        <td style={{ padding: '5px 6px', textAlign: 'center' }}>
                          <button type="button" onClick={() => removeLink(idx, li)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: '1rem' }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ))}

      {sections.length < 10 && (
        <button type="button"
          onClick={() => onChange([...sections, { id: newResultSectionId(), title: '', content: '', pdfLink: '', pdfName: '', links: [] }])}
          style={{ ...bS, width: '100%', textAlign: 'center' as const, borderStyle: 'dashed' }}>
          ➕ Add Section {sections.length + 1}
        </button>
      )}
    </div>
  )
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function PostModal({ initial, onSave, onClose }: {
  initial: ResultPost | null
  onSave: (p: ResultPost) => void
  onClose: () => void
}) {
  const blank = (): Omit<ResultPost, 'id' | 'createdAt'> => ({
    emoji: '📊', title: '', titleAs: '', slug: '',
    category: 'Merit List', org: '', totalPosts: '',
    description: '', descriptionAs: '', resultDate: '',
    sections: [], affiliateLink: '', affiliateLinkText: '',
    published: false, metaTitle: '', metaDescription: '',
  })

  const [form, setForm] = useState<Omit<ResultPost, 'id' | 'createdAt'>>(
    initial ? { ...initial } : blank()
  )
  const [tab, setTab] = useState<'basic' | 'sections' | 'seo'>('basic')
  const p = <K extends keyof typeof form>(k: K) => (v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const autoSlug = () => {
    if (!form.slug && form.title) p('slug')(generateResultSlug(form.title))
  }

  const handleSave = () => {
    if (!form.title.trim()) { alert('Title is required'); return }
    if (!form.slug.trim()) { alert('Slug is required'); return }
    const now = new Date().toISOString()
    const post: ResultPost = {
      ...form,
      id: initial?.id ?? Date.now(),
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    }
    onSave(post)
  }

  const tabBtn = (id: typeof tab, label: string) => (
    <button type="button" onClick={() => setTab(id)} style={{
      padding: '7px 16px', borderRadius: 7, fontWeight: 700, fontSize: '.82rem',
      border: 'none', cursor: 'pointer', fontFamily: 'Nunito,sans-serif',
      background: tab === id ? G : '#f0f4f8',
      color: tab === id ? N : '#3a5068',
    }}>{label}</button>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 1000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      overflowY: 'auto', padding: '20px 10px',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: W, borderRadius: 18, width: '100%', maxWidth: 700,
        boxShadow: '0 30px 80px rgba(0,0,0,.35)', margin: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '18px 24px 14px', borderBottom: '1.5px solid #eef3f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontFamily: 'Arial Black,sans-serif', fontSize: '1.05rem', color: N }}>
            {initial ? '✏️ Edit Result' : '➕ Add Result'}
          </h2>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, background: '#f0f4f8', border: '1.5px solid #d4e0ec', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Tab switcher */}
        <div style={{ padding: '12px 24px 0', display: 'flex', gap: 8 }}>
          {tabBtn('basic', '📝 Basic Info')}
          {tabBtn('sections', `📦 Sections (${form.sections.length})`)}
          {tabBtn('seo', '🔍 SEO')}
        </div>

        <div style={{ padding: '16px 24px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* ── BASIC TAB ── */}
          {tab === 'basic' && <>
            {/* Emoji + Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 10 }}>
              <div>
                <label style={lb}>Emoji</label>
                <input value={form.emoji} onChange={e => p('emoji')(e.target.value)}
                  style={{ ...si, textAlign: 'center' as const, fontSize: '1.4rem' }} maxLength={2} />
              </div>
              <div>
                <label style={lb}>Title * (English)</label>
                <input value={form.title} onChange={e => p('title')(e.target.value)}
                  onBlur={autoSlug} style={si}
                  placeholder="e.g. DEE Assam Merit List 2026 — LP & UP Teacher" />
              </div>
            </div>

            {/* Assamese title */}
            <div>
              <label style={lb}>শিৰোনাম — Assamese Title (optional)</label>
              <input value={form.titleAs || ''} onChange={e => p('titleAs')(e.target.value)}
                style={si} placeholder="অসমীয়া শিৰোনাম" />
            </div>

            {/* Slug */}
            <div>
              <label style={{ ...lb, color: G }}>
                SEO Slug * <span style={{ color: '#8fa3b8', fontWeight: 400, fontSize: '.7rem' }}>(auto-filled from title)</span>
              </label>
              <input value={form.slug} onChange={e => p('slug')(generateResultSlug(e.target.value))}
                style={si} placeholder="dee-assam-merit-list-2026" />
              <div style={{ fontSize: '.68rem', color: '#8fa3b8', marginTop: 3 }}>
                Public URL: assamcareerpoint-info.com/results/{form.slug || '...'}
              </div>
            </div>

            {/* Category + Org */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={lb}>Category *</label>
                <select value={form.category} onChange={e => p('category')(e.target.value)}
                  style={{ ...si, cursor: 'pointer' }}>
                  {RESULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lb}>Organization / Department *</label>
                <input value={form.org} onChange={e => p('org')(e.target.value)}
                  style={si} placeholder="e.g. DEE Assam, SLPRB, SSC" />
              </div>
            </div>

            {/* Total Posts + Result Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={lb}>Total Posts / Vacancies</label>
                <input value={form.totalPosts || ''} onChange={e => p('totalPosts')(e.target.value)}
                  style={si} placeholder="e.g. 4500" />
              </div>
              <div>
                <label style={lb}>Result Release Date</label>
                <input type="date" value={form.resultDate || ''} onChange={e => p('resultDate')(e.target.value)}
                  style={si} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={lb}>Short Description (shown on listing page)</label>
              <textarea value={form.description || ''} onChange={e => p('description')(e.target.value)}
                style={{ ...si, minHeight: 70, resize: 'vertical' as const }}
                placeholder="2–3 sentences summarising this result. Used for SEO and listing cards." />
            </div>

            {/* Assamese description */}
            <div>
              <label style={lb}>বিৱৰণ — Assamese Description (optional)</label>
              <textarea value={form.descriptionAs || ''} onChange={e => p('descriptionAs')(e.target.value)}
                style={{ ...si, minHeight: 60, resize: 'vertical' as const }}
                placeholder="অসমীয়া বিৱৰণ" />
            </div>

            {/* Affiliate */}
            <div style={{ background: '#fdf9ee', border: `1.5px solid ${G}44`, borderRadius: 10, padding: '12px 14px' }}>
              <label style={{ ...lb, color: G }}>🤝 Affiliate Link (optional)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                <input value={form.affiliateLink || ''} onChange={e => p('affiliateLink')(e.target.value)}
                  style={si} placeholder="https://testbook.com/?ref=..." />
                <input value={form.affiliateLinkText || ''} onChange={e => p('affiliateLinkText')(e.target.value)}
                  style={si} placeholder="e.g. Start Prep Now →" />
              </div>
            </div>

            {/* Publish toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="rpub" checked={form.published}
                onChange={e => p('published')(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }} />
              <label htmlFor="rpub" style={{ ...lb, marginBottom: 0, cursor: 'pointer', color: form.published ? '#27ae60' : '#5a6a7a' }}>
                {form.published ? '✅ Published — visible on public site' : '🚫 Draft — hidden from public'}
              </label>
            </div>
          </>}

          {/* ── SECTIONS TAB ── */}
          {tab === 'sections' && <>
            <div style={{ fontSize: '.78rem', color: '#5a6a7a', marginBottom: 4 }}>
              Add up to <strong>10 sections</strong>. Each section has: title, content text, optional PDF download, and up to 10 links.
            </div>
            <SectionBuilder sections={form.sections} onChange={p('sections')} />
          </>}

          {/* ── SEO TAB ── */}
          {tab === 'seo' && <>
            <div style={{ background: '#f0faf9', border: `1.5px solid ${T}44`, borderRadius: 10, padding: '12px 14px', fontSize: '.78rem', color: '#1a5a54' }}>
              💡 Leave blank to auto-generate from Title &amp; Description.
            </div>
            <div>
              <label style={{ ...lb, color: T }}>Meta Title (max 60 chars)</label>
              <input value={form.metaTitle || ''} onChange={e => p('metaTitle')(e.target.value)}
                style={si} maxLength={60}
                placeholder={`${form.title || 'Post title'} | Assam Career Point & Info`} />
              <div style={{ fontSize: '.68rem', color: '#8fa3b8', marginTop: 3 }}>{(form.metaTitle || '').length}/60</div>
            </div>
            <div>
              <label style={{ ...lb, color: T }}>Meta Description (max 160 chars)</label>
              <textarea value={form.metaDescription || ''} onChange={e => p('metaDescription')(e.target.value)}
                style={{ ...si, minHeight: 70, resize: 'vertical' as const }} maxLength={160}
                placeholder={form.description || 'Auto-generated from description...'} />
              <div style={{ fontSize: '.68rem', color: '#8fa3b8', marginTop: 3 }}>{(form.metaDescription || '').length}/160</div>
            </div>
          </>}

          {/* Save buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6, paddingTop: 12, borderTop: '1px solid #eef3f9' }}>
            <button type="button" onClick={onClose} style={bS}>Cancel</button>

            {/* 🖨️ PRINT BUTTON (Results) */}
            <button type="button" onClick={() => {
              const w = window.open('', '_blank')
              if (!w) return
              w.document.write(`
<html><head><title>Preview — ${form.title || 'Result Preview'}</title>
<style>
  body{font-family:Arial,sans-serif;padding:28px;color:#1a1a2e;max-width:800px;margin:0 auto;font-size:.9rem}
  h1{font-size:1.4rem;margin:0 0 4px}
  h2{font-size:1rem;margin:18px 0 8px;padding:6px 10px;background:#0b1f33;color:#c9a227;border-radius:6px}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;gap:12px}
  .label{color:#555;font-weight:600;flex-shrink:0}
  .val{font-weight:700;text-align:right}
  .badge{display:inline-block;padding:3px 12px;border-radius:99px;font-size:.75rem;font-weight:700;background:#0b1f33;color:#c9a227}
  @media print{button{display:none!important}}
</style></head><body>

<h1>${form.title || '—'}</h1>
<p style="color:#555;margin-bottom:16px">
  ${form.org || '—'} &nbsp;·&nbsp; <span class="badge">${form.category}</span>
  ${form.published ? '' : ' · Draft'}
</p>

<h2>📋 Basic Information</h2>
<div class="row"><span class="label">Organization</span><span class="val">${form.org || '—'}</span></div>
<div class="row"><span class="label">Total Posts / Vacancies</span><span class="val">${form.totalPosts || '—'}</span></div>
<div class="row"><span class="label">Result Date</span><span class="val">${form.resultDate || '—'}</span></div>

<h2>📝 Description</h2>
<div style="padding:8px 0;line-height:1.6">${(form.description || '—').replace(/\n/g,'<br/>')}</div>

${form.affiliateLink ? `
<h2>🤝 Recommended Resource</h2>
<div class="row"><span class="label">${form.affiliateLinkText || 'Affiliate Link'}</span><span class="val"><a href="${form.affiliateLink}" target="_blank">Click to Visit →</a></span></div>
` : ''}

${form.sections && form.sections.length > 0 ? `
<h2>📦 Detailed Sections (${form.sections.length})</h2>
${form.sections.map((sec, idx) => `
  <div style="margin-bottom:18px;border-left:3px solid #c9a227;padding-left:14px">
    <h3 style="margin:6px 0 8px;font-size:.95rem;color:#0b1f33">${sec.title || `Section ${idx+1}`}</h3>
    <div style="margin:6px 0;line-height:1.6">${(sec.content || '').replace(/\n/g,'<br/>')}</div>
    ${sec.pdfLink ? `<div class="row"><span class="label">📄 PDF</span><span class="val"><a href="${sec.pdfLink}" target="_blank">${sec.pdfName || 'Download'}</a></span></div>` : ''}
    ${sec.links && sec.links.length > 0 ? `
      <div><strong>🔗 Important Links:</strong></div>
      ${sec.links.map(lnk => `<div class="row"><span class="label">${lnk.label || 'Link'}</span><span class="val"><a href="${lnk.url}" target="_blank">Open →</a></span></div>`).join('')}
    ` : ''}
  </div>
`).join('')}
` : ''}

<br/>
<p style="color:#888;font-size:.75rem;border-top:1px solid #eee;padding-top:10px">
  Generated from Assam Career Point & Info Admin Panel · assamcareerpoint-info.com
</p>
<button onclick="window.print()" style="padding:10px 22px;background:#0b1f33;color:#c9a227;border:none;border-radius:8px;font-weight:700;font-size:.9rem;cursor:pointer;margin-top:8px">
  🖨️ Print / Save as PDF
</button>

</body></html>
              `)
              w.document.close()
            }} style={{...bS, background:'#e8f5e9', color:'#2e7d32', border:'1.5px solid #a5d6a7'}}>
              🖨️ Preview & Print
            </button>

            <button type="button" onClick={handleSave} style={bP}>
              {initial ? '💾 Update Result' : '➕ Add Result'}
            </button>
          </div>

        </div> {/* closes the padding div (flex column) */}
      </div> {/* closes the modal content div */}
    </div> {/* closes the overlay div */}
  ) // closes PostModal function
} // closes PostModal component

// ─── Category badge color ─────────────────────────────────────────────────────
function catColor(cat: string) {
  const map: Record<string, string> = {
    'Merit List': '#2980b9', 'Final Result': '#27ae60',
    'Answer Key': '#8e44ad', 'Cut-off Marks': '#e67e22',
    'Admit Card': '#c0392b', 'Interview List': T,
    'Document Verification': '#16a085', 'Waiting List': '#7f8c8d',
  }
  return map[cat] || '#3a5068'
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ResultsAdmin() {
  const [posts, setPosts] = useState<ResultPost[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editPost, setEditPost] = useState<ResultPost | null>(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const { msg: toastMsg, toast } = useToast()

  useEffect(() => {
    fetch('/api/data/results')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setPosts(data)
        else setPosts(getResultPosts())
      })
      .catch(() => setPosts(getResultPosts()))
  }, [])

  const save = (updated: ResultPost[]) => {
    setPosts(updated)
    saveResultPosts(updated)
    fetch('/api/data/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
  }

  const handleSave = (post: ResultPost) => {
    const updated = editPost
      ? posts.map(p => p.id === editPost.id ? post : p)
      : [...posts, post]
    save(updated)
    toast(editPost ? '✅ Result updated!' : '✅ Result added!')
    setShowModal(false); setEditPost(null)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Delete this result? Cannot be undone.')) return
    save(posts.filter(p => p.id !== id))
    toast('🗑️ Deleted')
  }

  const togglePublish = (id: number) => {
    save(posts.map(p => p.id === id ? { ...p, published: !p.published } : p))
    toast('✅ Updated')
  }

  const filtered = posts.filter(p => {
    const matchSearch = !search ||
      (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.org || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'All' || p.category === filterCat
    return matchSearch && matchCat
  })

  const published = posts.filter(p => p.published).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap');
        * { box-sizing: border-box }
        body { margin: 0; font-family: Nunito, sans-serif; background: #f0f4f8 }
      `}</style>

      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: N, color: G, padding: '10px 22px', borderRadius: 30,
          fontWeight: 700, fontSize: '.88rem', zIndex: 2000,
          boxShadow: '0 4px 20px rgba(0,0,0,.3)', fontFamily: 'Nunito,sans-serif',
        }}>{toastMsg}</div>
      )}

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '28px 32px', overflowX: 'auto' }}>
          {/* Page header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: N, margin: 0 }}>
              📊 Results
            </h1>
            <p style={{ color: '#5a6a7a', margin: '4px 0 0', fontSize: '.88rem' }}>
              Manage Merit Lists, Answer Keys, Cut-off Marks and Exam Results
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Results', value: posts.length, color: N, emoji: '📊' },
              { label: 'Published', value: published, color: '#27ae60', emoji: '✅' },
              { label: 'Drafts', value: posts.length - published, color: '#e67e22', emoji: '⏸' },
              { label: 'Merit Lists', value: posts.filter(p => p.category === 'Merit List').length, color: '#2980b9', emoji: '🏆' },
            ].map(s => (
              <div key={s.label} style={{ background: W, borderRadius: 12, padding: '14px 18px', border: '1.5px solid #e8eef4' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{s.emoji}</div>
                <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '.78rem', color: '#5a6a7a' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...si, maxWidth: 260 }} placeholder="Search results..." />
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
              style={{ ...si, maxWidth: 180, cursor: 'pointer' }}>
              <option value="All">All Categories</option>
              {RESULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ flex: 1 }} />
            <Link href="/results" target="_blank" style={{ ...bS, textDecoration: 'none', fontSize: '.82rem' }}>↗ View Public Page</Link>
            <button onClick={() => { setEditPost(null); setShowModal(true) }} style={bP}>
              ➕ Add Result
            </button>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8fa3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📊</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: N, marginBottom: 6 }}>No results yet</div>
              <div style={{ fontSize: '.86rem' }}>Click "Add Result" to add your first entry</div>
            </div>
          ) : (
            <div style={{ background: W, borderRadius: 14, border: '1.5px solid #e8eef4', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f8fb' }}>
                    {['Result', 'Org', 'Category', 'Sections', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: '.75rem', fontWeight: 800, color: '#3a5068', textAlign: 'left', borderBottom: '1.5px solid #e8eef4' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((post, idx) => (
                    <tr key={post.id} style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #f0f4f8' : 'none' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '1.3rem' }}>{post.emoji}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '.86rem', color: N, maxWidth: 220 }}>{post.title}</div>
                            <code style={{ fontSize: '.68rem', color: '#8fa3b8' }}>/{post.slug}</code>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '.82rem', color: '#5a6a7a' }}>{post.org}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, background: catColor(post.category) + '18', color: catColor(post.category), fontSize: '.72rem', fontWeight: 700 }}>
                          {post.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '.82rem', color: '#5a6a7a' }}>{post.sections.length}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => togglePublish(post.id)} style={{
                          padding: '4px 12px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                          background: post.published ? '#eafaf1' : '#fef9e7',
                          color: post.published ? '#27ae60' : '#e67e22',
                        }}>{post.published ? '✅ Published' : '⏸ Draft'}</button>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => { setEditPost(post); setShowModal(true) }} style={{ ...bS, padding: '5px 12px', fontSize: '.78rem' }}>✏️ Edit</button>
                          <button onClick={() => handleDelete(post.id)} style={{ ...bDanger, padding: '5px 10px' }}>🗑</button>
                          {post.published && (
                            <Link href={`/results/${post.slug}`} target="_blank"
                              style={{ ...bS, padding: '5px 10px', fontSize: '.78rem', textDecoration: 'none' }}>↗</Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <PostModal
          initial={editPost}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditPost(null) }}
        />
      )}
    </>
  )
}