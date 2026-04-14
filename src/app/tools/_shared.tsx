'use client'
import Link from 'next/link'
import { useState } from 'react'

// ─── Brand tokens ─────────────────────────────────────────────────────────────
export const C = {
  navy:   '#0b1f33',
  navy2:  '#1a3a5c',
  teal:   '#1dbfad',
  teal2:  '#0fa898',
  gold:   '#c9a227',
  white:  '#ffffff',
  gray50: '#f9fafb',
  gray100:'#f3f4f6',
  gray200:'#e5e7eb',
  gray300:'#d1d5db',
  gray400:'#9ca3af',
  gray500:'#6b7280',
  gray600:'#4b5563',
  gray700:'#374151',
  gray800:'#1f2937',
  red:    '#ef4444',
  green:  '#22c55e',
  amber:  '#f59e0b',
}

// ─── Shared base styles ───────────────────────────────────────────────────────
export const S = {
  page: {
    minHeight: '100vh',
    background: C.gray50,
    fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
  } as React.CSSProperties,

  hero: (): React.CSSProperties => ({
    background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
    padding: '48px 24px 40px',
  }),

  heroTitle: {
    fontSize: 'clamp(26px, 5vw, 40px)',
    fontWeight: 800,
    color: C.white,
    margin: '0 0 12px',
    lineHeight: 1.2,
  } as React.CSSProperties,

  heroDesc: {
    fontSize: '16px',
    color: '#cbd5e1',
    margin: 0,
    lineHeight: 1.7,
    maxWidth: '620px',
  } as React.CSSProperties,

  wrap: {
    maxWidth: '1040px',
    margin: '0 auto',
    padding: '36px 16px',
  } as React.CSSProperties,

  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  } as React.CSSProperties,

  card: {
    background: C.white,
    borderRadius: '18px',
    border: `1px solid ${C.gray200}`,
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  } as React.CSSProperties,

  cardTitle: {
    fontSize: '17px',
    fontWeight: 800,
    color: C.navy,
    margin: '0 0 18px',
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 700,
    color: C.gray700,
    marginBottom: '7px',
  } as React.CSSProperties,

  input: {
    width: '100%',
    border: `2px solid ${C.gray200}`,
    borderRadius: '11px',
    padding: '13px 15px',
    fontSize: '15px',
    color: C.gray800,
    background: C.white,
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  } as React.CSSProperties,

  select: {
    width: '100%',
    border: `2px solid ${C.gray200}`,
    borderRadius: '11px',
    padding: '13px 15px',
    fontSize: '15px',
    color: C.gray800,
    background: C.white,
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    cursor: 'pointer',
  } as React.CSSProperties,

  textarea: {
    width: '100%',
    border: `2px solid ${C.gray200}`,
    borderRadius: '11px',
    padding: '13px 15px',
    fontSize: '15px',
    color: C.gray800,
    background: C.white,
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  } as React.CSSProperties,

  btnPrimary: {
    width: '100%',
    background: C.teal,
    color: C.white,
    border: 'none',
    borderRadius: '12px',
    padding: '15px 22px',
    fontSize: '16px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  btnGold: {
    width: '100%',
    background: C.gold,
    color: C.navy,
    border: 'none',
    borderRadius: '12px',
    padding: '15px 22px',
    fontSize: '16px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  btnOutline: {
    background: C.white,
    color: C.gray700,
    border: `2px solid ${C.gray200}`,
    borderRadius: '11px',
    padding: '11px 18px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  error: {
    background: '#fef2f2',
    border: `1px solid #fca5a5`,
    color: '#dc2626',
    borderRadius: '11px',
    padding: '13px 15px',
    fontSize: '14px',
  } as React.CSSProperties,

  hint: {
    fontSize: '12px',
    color: C.gray400,
    marginTop: '5px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '20px',
    fontWeight: 800,
    color: C.navy,
    margin: '0 0 18px',
    paddingBottom: '10px',
    borderBottom: `2px solid ${C.gray100}`,
  } as React.CSSProperties,

  tabBar: {
    display: 'flex',
    gap: '6px',
    background: C.gray100,
    borderRadius: '12px',
    padding: '5px',
    marginBottom: '22px',
    overflowX: 'auto' as const,
    flexWrap: 'nowrap' as const,
  } as React.CSSProperties,

  infoBox: {
    background: C.gray50,
    borderRadius: '12px',
    padding: '18px',
    marginTop: '20px',
    border: `1px solid ${C.gray200}`,
  } as React.CSSProperties,

  statCard: {
    background: C.gray50,
    borderRadius: '12px',
    padding: '14px',
    textAlign: 'center' as const,
    border: `1px solid ${C.gray200}`,
  } as React.CSSProperties,

  statVal: {
    fontSize: '22px',
    fontWeight: 800,
    color: C.navy,
    margin: '0 0 3px',
  } as React.CSSProperties,

  statLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: C.gray500,
    margin: 0,
  } as React.CSSProperties,
}

// ─── NAV LINKS ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Home',        href: '/' },
  { label: 'Govt Jobs',   href: '/govt-jobs' },
  { label: 'Exams',       href: '/exams' },
  { label: 'Information', href: '/information' },
  { label: 'PDF Forms',   href: '/pdf-forms' },
  { label: 'Results',     href: '/results' },
  { label: '🛠 Tools',    href: '/tools' },
]

// ─── Navbar for all tool pages ────────────────────────────────────────────────
export function ToolsNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: C.navy,
      borderBottom: `2px solid rgba(29,191,173,0.3)`,
      boxShadow: '0 2px 16px rgba(0,0,0,0.25)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: C.navy }}>A</div>
          <span style={{ fontSize: '15px', fontWeight: 800, color: C.white, lineHeight: 1.2 }}>Assam Career<br /><span style={{ color: C.teal, fontSize: '12px' }}>Point & Info</span></span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap', overflowX: 'auto', maxWidth: 'calc(100% - 180px)' }}>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: 'none',
                padding: '7px 13px',
                borderRadius: '99px',
                fontSize: '13px',
                fontWeight: 700,
                color: C.white,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                whiteSpace: 'nowrap' as const,
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = C.teal
                ;(e.currentTarget as HTMLAnchorElement).style.color = C.navy
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = C.teal
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'
                ;(e.currentTarget as HTMLAnchorElement).style.color = C.white
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ─── Tool Hero (below navbar) ─────────────────────────────────────────────────
export function ToolHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={S.hero()}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <Link href="/tools" style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginBottom: '14px' }}>← Back to Tools</Link>
        <h1 style={S.heroTitle}>{title}</h1>
        <p style={S.heroDesc}>{desc}</p>
      </div>
    </div>
  )
}

// ─── Tab button ───────────────────────────────────────────────────────────────
export function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: '9px 16px', borderRadius: '9px', border: 'none',
      fontSize: '13px', fontWeight: 700, cursor: 'pointer',
      whiteSpace: 'nowrap' as const, fontFamily: 'inherit',
      background: active ? C.teal : 'transparent',
      color: active ? C.white : C.gray500,
      flexShrink: 0,
    }}>
      {children}
    </button>
  )
}

// ─── Mode tab ─────────────────────────────────────────────────────────────────
export function ModeTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '11px 8px', borderRadius: '10px', border: 'none',
      fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
      background: active ? C.white : 'transparent',
      color: active ? C.navy : C.gray500,
      boxShadow: active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
    }}>
      {label}
    </button>
  )
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: '50px', height: '27px', borderRadius: '99px', border: 'none',
      background: on ? C.teal : C.gray200, cursor: 'pointer', position: 'relative',
      flexShrink: 0,
    }}>
      <span style={{
        position: 'absolute', top: '3px', left: on ? '25px' : '3px',
        width: '21px', height: '21px', borderRadius: '50%',
        background: C.white, boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ title }: { title: string }) {
  return (
    <div style={{ margin: '20px 0 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '1px', background: C.gray200 }} />
      <span style={{ fontSize: '12px', fontWeight: 700, color: C.gray400, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{title}</span>
      <div style={{ flex: 1, height: '1px', background: C.gray200 }} />
    </div>
  )
}

// ─── Segment control ─────────────────────────────────────────────────────────
export function Seg({ opts, val, set }: { opts: string[]; val: string; set: (v: any) => void }) {
  return (
    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' as const }}>
      {opts.map(o => (
        <button key={o} onClick={() => set(o)} style={{
          padding: '9px 15px', borderRadius: '10px', fontSize: '13px', fontWeight: 700,
          border: `2px solid ${val === o ? C.teal : C.gray200}`,
          background: val === o ? '#e6faf8' : C.white,
          color: val === o ? C.teal2 : C.gray500,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>{o}</button>
      ))}
    </div>
  )
}
