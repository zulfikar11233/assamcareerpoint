'use client'
export const dynamic = 'force-dynamic'
// src/app/admin/others/page.tsx
// ✅ Admin CMS for: Announcements · Documents & Guides · Public Services
// ✅ Full CRUD with sections builder, links table, PDF links, Assamese support
// ✅ SEO slug auto-generator, publish toggle, affiliate link

import { useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import {
  OthersPost, OthersSection, OthersLink,
  getOthersPosts, saveOthersPosts, generateSlug,
  getTypeLabel, getTypePath, newSectionId, newLinkId,
} from '@/lib/others-db'

// ─── Palette ──────────────────────────────────────────────────────────────────
const G = '#c9a227', T = '#1dbfad', N = '#0b1f33', W = '#ffffff'

// ─── Shared style tokens ──────────────────────────────────────────────────────
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

// ─── Type tabs config ─────────────────────────────────────────────────────────
const TABS: { type: OthersPost['type']; label: string; emoji: string; color: string }[] = [
  { type: 'announcement', label: 'Announcements',      emoji: '📢', color: '#e74c3c' },
  { type: 'guide',        label: 'Documents & Guides', emoji: '📋', color: T },
  { type: 'service',      label: 'Public Services',    emoji: '🏛', color: '#8e44ad' },
]

// ─── Default blank post ───────────────────────────────────────────────────────
const blankPost = (type: OthersPost['type']): Omit<OthersPost, 'id' | 'createdAt'> => ({
  type, emoji: TABS.find(t => t.type === type)?.emoji || '📌',
  title: '', titleAs: '', slug: '', category: '',
  description: '', descriptionAs: '',
  sections: [], affiliateLink: '', affiliateLinkText: '',
  published: false, metaTitle: '', metaDescription: '',
})

// ─── Blank section ────────────────────────────────────────────────────────────
const blankSection = (): OthersSection => ({
  id: newSectionId(), title: '', content: '', pdfLink: '', pdfName: '', links: [],
})

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
  const navItem = (href: string, icon: string, label: string, active = false) => (
    <Link key={label} href={href} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 16px',
      borderRadius: 8, textDecoration: 'none', fontSize: '.86rem', fontWeight: 600,
      color: active ? N : '#b0c4d8', background: active ? G : 'transparent',
      fontFamily: 'Nunito,sans-serif', marginBottom: 2, transition: 'all .15s',
    }}>{icon} {label.replace('pub_', '')}</Link>
  )
  return (
    <aside style={{
      width: 230, minHeight: '100vh', background: N,
      borderRight: `2px solid ${G}33`, display: 'flex', flexDirection: 'column',
      padding: '0 0 20px', position: 'sticky', top: 0, flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid #ffffff18` }}>
        <div style={{ fontFamily: 'Arial Black,sans-serif', fontSize: '.88rem', lineHeight: 1.3 }}>
          <span style={{ color: G }}>ASSAM </span>
          <span style={{ color: W }}>CAREER</span>
          <span style={{ color: T }}> POINT</span>
        </div>
        <div style={{ color: '#8fa3b8', fontSize: '.68rem', marginTop: 2 }}>ADMIN PANEL v6</div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {navItem('/admin/dashboard', '🏠', 'Dashboard')}
        {navItem('/admin/dashboard', '💼', 'Job Vacancies')}
        {navItem('/admin/dashboard', '📚', 'Exams')}
        {navItem('/admin/dashboard', 'ℹ️', 'Information')}
        {navItem('/admin/dashboard', '📄', 'PDF Forms')}
        {navItem('/admin/dashboard', '🤝', 'Affiliates')}
        <div style={{ height: 1, background: '#ffffff18', margin: '10px 6px' }} />
        {navItem('/admin/others', '📢', 'Announcements', true)}
        {navItem('/admin/others', '📋', 'Docs & Guides', true)}
        {navItem('/admin/others', '🏛', 'Public Services', true)}
        <div style={{ height: 1, background: '#ffffff18', margin: '10px 6px' }} />
        {navItem('/admin/dashboard', '⚙️', 'Settings')}

        <div style={{ padding: '8px 6px 4px', fontSize: '.68rem', color: '#6a8099', fontWeight: 700, letterSpacing: 1, marginTop: 8 }}>
          PUBLIC PAGES ↗
        </div>
        {navItem('/', '🏠', 'pub_Home')}
        {navItem('/govt-jobs', '💼', 'pub_Govt Jobs')}
        {navItem('/exams', '📚', 'pub_Exams')}
        {navItem('/announcements', '📢', 'pub_Announcements')}
        {navItem('/guides', '📋', 'pub_Guides')}
        {navItem('/services', '🏛', 'pub_Services')}
      </nav>

      {/* User */}
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
function SectionBuilder({
  sections, onChange,
}: {
  sections: OthersSection[]
  onChange: (s: OthersSection[]) => void
}) {
  const update = (idx: number, patch: Partial<OthersSection>) => {
    const next = sections.map((s, i) => i === idx ? { ...s, ...patch } : s)
    onChange(next)
  }
  const addLink = (idx: number) => {
    if (sections[idx].links.length >= 10) return
    update(idx, { links: [...sections[idx].links, { id: newLinkId(), label: '', url: '' }] })
  }
  const updateLink = (sIdx: number, lIdx: number, patch: Partial<OthersLink>) => {
    const links = sections[sIdx].links.map((l, i) => i === lIdx ? { ...l, ...patch } : l)
    update(sIdx, { links })
  }
  const removeLink = (sIdx: number, lIdx: number) => {
    update(sIdx, { links: sections[sIdx].links.filter((_, i) => i !== lIdx) })
  }
  const removeSection = (idx: number) => onChange(sections.filter((_, i) => i !== idx))
  const moveUp   = (idx: number) => { if (idx === 0) return; const a = [...sections]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; onChange(a) }
  const moveDown = (idx: number) => { if (idx === sections.length-1) return; const a = [...sections]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; onChange(a) }

  return (
    <div>
      {sections.map((sec, idx) => (
        <div key={sec.id} style={{ border: '1.5px solid #d4e0ec', borderRadius: 10, marginBottom: 12, background: '#fafcff', overflow: 'hidden' }}>
          {/* Section header */}
          <div style={{ background: '#eef3f9', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #d4e0ec' }}>
            <span style={{ fontSize: '.78rem', fontWeight: 800, color: '#3a5068', fontFamily: 'Nunito,sans-serif' }}>Section {idx + 1}</span>
            <div style={{ flex: 1 }} />
            <button type="button" onClick={() => moveUp(idx)} style={{ ...bS, padding: '3px 8px', fontSize: '.75rem' }}>↑</button>
            <button type="button" onClick={() => moveDown(idx)} style={{ ...bS, padding: '3px 8px', fontSize: '.75rem' }}>↓</button>
            <button type="button" onClick={() => removeSection(idx)} style={{ ...bDanger, padding: '3px 10px' }}>✕ Remove</button>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Title */}
            <div>
              <label style={lb}>Section Title *</label>
              <input value={sec.title} onChange={e => update(idx, { title: e.target.value })} style={si} placeholder="e.g. DEE Assam Merit List Details" />
            </div>
            {/* Content */}
            <div>
              <label style={lb}>Content / Description</label>
              <textarea value={sec.content} onChange={e => update(idx, { content: e.target.value })}
                style={{ ...si, minHeight: 80, resize: 'vertical' }}
                placeholder="Write the main content for this section. Supports line breaks." />
            </div>
            {/* PDF Link */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
              <div>
                <label style={lb}>📄 Google Drive PDF Link</label>
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
                  <button type="button" onClick={() => addLink(idx)} style={{ ...bS, padding: '4px 12px', fontSize: '.75rem' }}>+ Add Link</button>
                )}
              </div>
              {sec.links.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#eef3f9' }}>
                      <th style={{ padding: '6px 8px', fontSize: '.72rem', color: '#3a5068', fontWeight: 700, textAlign: 'left', borderBottom: '1px solid #d4e0ec' }}>Label</th>
                      <th style={{ padding: '6px 8px', fontSize: '.72rem', color: '#3a5068', fontWeight: 700, textAlign: 'left', borderBottom: '1px solid #d4e0ec' }}>URL</th>
                      <th style={{ width: 40, borderBottom: '1px solid #d4e0ec' }} />
                    </tr>
                  </thead>
                  <tbody>
                    {sec.links.map((lnk, li) => (
                      <tr key={lnk.id}>
                        <td style={{ padding: '5px 6px' }}>
                          <input value={lnk.label} onChange={e => updateLink(idx, li, { label: e.target.value })}
                            style={{ ...si, padding: '6px 9px' }} placeholder="e.g. Final Merit List" />
                        </td>
                        <td style={{ padding: '5px 6px' }}>
                          <input value={lnk.url} onChange={e => updateLink(idx, li, { url: e.target.value })}
                            style={{ ...si, padding: '6px 9px' }} placeholder="https://..." />
                        </td>
                        <td style={{ padding: '5px 6px', textAlign: 'center' }}>
                          <button type="button" onClick={() => removeLink(idx, li)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontSize: '1rem' }}>✕</button>
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
        <button type="button" onClick={() => onChange([...sections, blankSection()])}
          style={{ ...bS, width: '100%', textAlign: 'center', borderStyle: 'dashed' }}>
          ➕ Add Section {sections.length + 1}
        </button>
      )}
    </div>
  )
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
function PostModal({
  initial, type, onSave, onClose,
}: {
  initial: OthersPost | null
  type: OthersPost['type']
  onSave: (p: OthersPost) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Omit<OthersPost, 'id' | 'createdAt'>>(
    initial
      ? { ...initial }
      : blankPost(type)
  )
  const [tab, setTab] = useState<'basic' | 'sections' | 'seo'>('basic')
  const p = <K extends keyof typeof form>(k: K) => (v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const autoSlug = () => {
    if (!form.slug && form.title) p('slug')(generateSlug(form.title))
  }

  const handleSave = () => {
    if (!form.title.trim()) { alert('Title is required'); return }
    if (!form.slug.trim()) { alert('Slug is required'); return }
    const now = new Date().toISOString()
    const post: OthersPost = {
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
        background: W, borderRadius: 18, width: '100%', maxWidth: 680,
        boxShadow: '0 30px 80px rgba(0,0,0,.35)', margin: 'auto',
      }}>
        {/* Modal header */}
        <div style={{
          padding: '18px 24px 14px', borderBottom: '1.5px solid #eef3f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h2 style={{ margin: 0, fontFamily: 'Arial Black,sans-serif', fontSize: '1.05rem', color: N }}>
            {initial ? '✏️ Edit' : '➕ Add'} {getTypeLabel(type)}
          </h2>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, background: '#f0f4f8', border: '1.5px solid #d4e0ec', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Tab switcher */}
        <div style={{ padding: '12px 24px 0', display: 'flex', gap: 8 }}>
          {tabBtn('basic', '📝 Basic Info')}
          {tabBtn('sections', `📦 Sections (${form.sections.length})`)}
          {tabBtn('seo', '🔍 SEO')}
        </div>

        <div style={{ padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* ── BASIC TAB ── */}
          {tab === 'basic' && <>
            {/* Emoji + Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 10 }}>
              <div>
                <label style={lb}>Emoji</label>
                <input value={form.emoji} onChange={e => p('emoji')(e.target.value)} style={{ ...si, textAlign: 'center', fontSize: '1.4rem' }} maxLength={2} />
              </div>
              <div>
                <label style={lb}>Title * (English)</label>
                <input value={form.title} onChange={e => p('title')(e.target.value)}
                  onBlur={autoSlug} style={si} placeholder={`e.g. DEE Assam Merit List 2026`} />
              </div>
            </div>

            {/* Assamese title */}
            <div>
              <label style={lb}>শিৰোনাম (Assamese Title — optional)</label>
              <input value={form.titleAs || ''} onChange={e => p('titleAs')(e.target.value)} style={si} placeholder="অসমীয়া শিৰোনাম" />
            </div>

            {/* Slug + Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ ...lb, color: G }}>SEO Slug * <span style={{ color: '#8fa3b8', fontWeight: 400, fontSize: '.7rem' }}>(auto-generated)</span></label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input value={form.slug} onChange={e => p('slug')(generateSlug(e.target.value))} style={si} placeholder="dee-assam-merit-list-2026" />
                </div>
                <div style={{ fontSize: '.68rem', color: '#8fa3b8', marginTop: 3 }}>/{getTypePath(type)}/{form.slug || '...'}</div>
              </div>
              <div>
                <label style={lb}>Category</label>
                <input value={form.category || ''} onChange={e => p('category')(e.target.value)} style={si} placeholder="e.g. Education, Banking, State Govt" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={lb}>Short Description (shown on listing page)</label>
              <textarea value={form.description || ''} onChange={e => p('description')(e.target.value)}
                style={{ ...si, minHeight: 70, resize: 'vertical' }}
                placeholder="2-3 sentences summarizing this post. Used for SEO and listing cards." />
            </div>

            {/* Assamese description */}
            <div>
              <label style={lb}>বিৱৰণ (Assamese Description — optional)</label>
              <textarea value={form.descriptionAs || ''} onChange={e => p('descriptionAs')(e.target.value)}
                style={{ ...si, minHeight: 60, resize: 'vertical' }} placeholder="অসমীয়া বিৱৰণ" />
            </div>

            {/* Affiliate */}
            <div style={{ background: '#fdf9ee', border: `1.5px solid ${G}44`, borderRadius: 10, padding: '12px 14px' }}>
              <label style={{ ...lb, color: G }}>🤝 Affiliate Link (optional)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                <input value={form.affiliateLink || ''} onChange={e => p('affiliateLink')(e.target.value)} style={si} placeholder="https://testbook.com/?ref=..." />
                <input value={form.affiliateLinkText || ''} onChange={e => p('affiliateLinkText')(e.target.value)} style={si} placeholder="Button text e.g. Start Prep →" />
              </div>
            </div>

            {/* Published */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="pub" checked={form.published} onChange={e => p('published')(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }} />
              <label htmlFor="pub" style={{ ...lb, marginBottom: 0, cursor: 'pointer', color: form.published ? '#27ae60' : '#5a6a7a' }}>
                {form.published ? '✅ Published (visible on public site)' : '🚫 Draft (hidden from public)'}
              </label>
            </div>
          </>}

          {/* ── SECTIONS TAB ── */}
          {tab === 'sections' && <>
            <div style={{ fontSize: '.78rem', color: '#5a6a7a', marginBottom: 4 }}>
              Add up to <strong>10 sections</strong>. Each section can have a title, content, PDF download link, and up to 10 external links.
            </div>
            <SectionBuilder sections={form.sections} onChange={p('sections')} />
          </>}

          {/* ── SEO TAB ── */}
          {tab === 'seo' && <>
            <div style={{ background: '#f0faf9', border: `1.5px solid ${T}44`, borderRadius: 10, padding: '12px 14px', fontSize: '.78rem', color: '#1a5a54', marginBottom: 4 }}>
              💡 <strong>Leave blank</strong> to auto-generate from Title and Description. Only fill if you want custom SEO text.
            </div>
            <div>
              <label style={{ ...lb, color: T }}>Meta Title <span style={{ color: '#8fa3b8', fontWeight: 400 }}>(max 60 chars)</span></label>
              <input value={form.metaTitle || ''} onChange={e => p('metaTitle')(e.target.value)} style={si} maxLength={60}
                placeholder={`${form.title} | Assam Career Point & Info`} />
              <div style={{ fontSize: '.68rem', color: '#8fa3b8', marginTop: 3 }}>{(form.metaTitle || '').length}/60 characters</div>
            </div>
            <div>
              <label style={{ ...lb, color: T }}>Meta Description <span style={{ color: '#8fa3b8', fontWeight: 400 }}>(max 160 chars)</span></label>
              <textarea value={form.metaDescription || ''} onChange={e => p('metaDescription')(e.target.value)}
                style={{ ...si, minHeight: 70, resize: 'vertical' }} maxLength={160}
                placeholder={form.description || 'Auto-generated from description...'} />
              <div style={{ fontSize: '.68rem', color: '#8fa3b8', marginTop: 3 }}>{(form.metaDescription || '').length}/160 characters</div>
            </div>
            <div style={{ background: '#f8fbff', border: '1px solid #d4e0ec', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#3a5068', marginBottom: 6 }}>📊 JSON-LD Schema Type</div>
              <div style={{ fontSize: '.82rem', color: '#5a6a7a' }}>
                {type === 'announcement' && '📰 Article schema — best for news & announcements'}
                {type === 'guide'        && '📋 HowTo schema — best for guides & documents'}
                {type === 'service'      && '🏛 GovernmentService schema — best for public services'}
              </div>
              <div style={{ fontSize: '.72rem', color: '#8fa3b8', marginTop: 4 }}>Auto-generated and injected on the public page.</div>
            </div>
          </>}

          {/* Save buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6, paddingTop: 12, borderTop: '1px solid #eef3f9' }}>
            <button type="button" onClick={onClose} style={bS}>Cancel</button>
            <button type="button" onClick={handleSave} style={bP}>
              {initial ? '💾 Update' : '➕ Add'} {getTypeLabel(type).split(' ')[0]}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OthersAdmin() {
  const [activeType, setActiveType] = useState<OthersPost['type']>('announcement')
  const [posts, setPosts] = useState<OthersPost[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editPost, setEditPost] = useState<OthersPost | null>(null)
  const [search, setSearch] = useState('')
  const { msg: toastMsg, toast } = useToast()

  // Load from localStorage
  useEffect(() => {
    setPosts(getOthersPosts(activeType))
  }, [activeType])

  const save = (updated: OthersPost[]) => {
    setPosts(updated)
    saveOthersPosts(activeType, updated)
  }

  const handleSave = (post: OthersPost) => {
    const updated = editPost
      ? posts.map(p => p.id === editPost.id ? post : p)
      : [...posts, post]
    save(updated)
    toast(editPost ? '✅ Updated!' : '✅ Added!')
    setShowModal(false)
    setEditPost(null)
  }

  const handleDelete = (id: number) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    save(posts.filter(p => p.id !== id))
    toast('🗑️ Deleted')
  }

  const togglePublish = (id: number) => {
    save(posts.map(p => p.id === id ? { ...p, published: !p.published } : p))
    toast('✅ Updated')
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  )

  const activeCfg = TABS.find(t => t.type === activeType)!

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
          fontWeight: 700, fontSize: '.88rem', zIndex: 2000, boxShadow: '0 4px 20px rgba(0,0,0,.3)',
          fontFamily: 'Nunito,sans-serif',
        }}>{toastMsg}</div>
      )}

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />

        {/* Main content */}
        <main style={{ flex: 1, padding: '28px 32px', overflowX: 'auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: N, margin: 0 }}>
              Others CMS
            </h1>
            <p style={{ color: '#5a6a7a', margin: '4px 0 0', fontSize: '.88rem' }}>
              Manage Announcements, Documents &amp; Guides, and Public Services
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            {TABS.map(cfg => {
              const all = getOthersPosts(cfg.type)
              return (
                <div key={cfg.type} onClick={() => setActiveType(cfg.type)} style={{
                  background: W, borderRadius: 14, padding: '16px 20px', cursor: 'pointer',
                  border: `2px solid ${activeType === cfg.type ? cfg.color : '#e8eef4'}`,
                  transition: 'all .15s',
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{cfg.emoji}</div>
                  <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: N }}>{all.length}</div>
                  <div style={{ fontSize: '.8rem', color: '#5a6a7a', marginTop: 2 }}>{cfg.label}</div>
                  <div style={{ fontSize: '.72rem', color: cfg.color, marginTop: 2, fontWeight: 700 }}>
                    ↑ {all.filter(p => p.published).length} published
                  </div>
                </div>
              )
            })}
          </div>

          {/* Type tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {TABS.map(cfg => (
              <button key={cfg.type} onClick={() => setActiveType(cfg.type)} style={{
                padding: '9px 20px', borderRadius: 9, fontWeight: 700, fontSize: '.86rem',
                border: `2px solid ${activeType === cfg.type ? cfg.color : '#d4e0ec'}`,
                background: activeType === cfg.type ? cfg.color + '18' : W,
                color: activeType === cfg.type ? cfg.color : '#3a5068',
                cursor: 'pointer', fontFamily: 'Nunito,sans-serif', transition: 'all .15s',
              }}>{cfg.emoji} {cfg.label}</button>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...si, maxWidth: 280 }} placeholder={`Search ${activeCfg.label}...`} />
            <div style={{ flex: 1 }} />
            <Link href={`/${getTypePath(activeType)}`} target="_blank"
              style={{ ...bS, textDecoration: 'none', fontSize: '.82rem' }}>↗ View Public Page</Link>
            <button onClick={() => { setEditPost(null); setShowModal(true) }} style={bP}>
              ➕ Add {getTypeLabel(activeType).split(' ')[0]}
            </button>
          </div>

          {/* Posts table */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8fa3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>{activeCfg.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>No {activeCfg.label} yet</div>
              <div style={{ fontSize: '.86rem' }}>Click "Add" to create your first entry</div>
            </div>
          ) : (
            <div style={{ background: W, borderRadius: 14, border: '1.5px solid #e8eef4', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f8fb' }}>
                    {['Post', 'Slug', 'Category', 'Sections', 'Status', 'Actions'].map(h => (
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
                            <div style={{ fontWeight: 700, fontSize: '.86rem', color: N }}>{post.title}</div>
                            {post.titleAs && <div style={{ fontSize: '.72rem', color: '#8fa3b8' }}>{post.titleAs}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <code style={{ fontSize: '.72rem', background: '#f0f4f8', padding: '2px 7px', borderRadius: 5, color: '#3a5068' }}>/{post.slug}</code>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '.82rem', color: '#5a6a7a' }}>{post.category || '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: '.82rem', color: '#5a6a7a' }}>{post.sections.length} sections</td>
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
                            <Link href={`/${getTypePath(activeType)}/${post.slug}`} target="_blank"
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

      {/* Modal */}
      {showModal && (
        <PostModal
          initial={editPost}
          type={activeType}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditPost(null) }}
        />
      )}
    </>
  )
}
