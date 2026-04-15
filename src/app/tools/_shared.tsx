'use client'
import Link from 'next/link'
import { useState } from 'react'

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

export const S = {
  page: {
    minHeight: '100vh',
    background: C.gray50,
    fontFamily: 'var(--font-nunito), Nunito, system-ui, sans-serif',
  } as React.CSSProperties,

  hero: (): React.CSSProperties => ({
    background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
    padding: '44px 16px 36px',
  }),

  heroTitle: {
    fontSize: 'clamp(24px, 5vw, 38px)',
    fontWeight: 800,
    color: C.white,
    margin: '0 0 10px',
    lineHeight: 1.2,
  } as React.CSSProperties,

  heroDesc: {
    fontSize: '15px',
    color: '#cbd5e1',
    margin: 0,
    lineHeight: 1.7,
    maxWidth: '600px',
  } as React.CSSProperties,

  wrap: {
    maxWidth: '1040px',
    margin: '0 auto',
    padding: '32px 16px',
  } as React.CSSProperties,

  // ✅ MOBILE SAFE: auto-fill wraps on small screens
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
    gap: '18px',
  } as React.CSSProperties,

  card: {
    background: C.white,
    borderRadius: '16px',
    border: `1px solid ${C.gray200}`,
    padding: '22px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  } as React.CSSProperties,

  cardTitle: {
    fontSize: '16px',
    fontWeight: 800,
    color: C.navy,
    margin: '0 0 16px',
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 700,
    color: C.gray700,
    marginBottom: '6px',
  } as React.CSSProperties,

  input: {
    width: '100%',
    border: `2px solid ${C.gray200}`,
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '15px',
    color: C.gray800,
    background: C.white,
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    WebkitAppearance: 'none' as const,
  } as React.CSSProperties,

  select: {
    width: '100%',
    border: `2px solid ${C.gray200}`,
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '15px',
    color: C.gray800,
    background: C.white,
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    cursor: 'pointer',
    WebkitAppearance: 'none' as const,
    appearance: 'none' as const,
  } as React.CSSProperties,

  textarea: {
    width: '100%',
    border: `2px solid ${C.gray200}`,
    borderRadius: '10px',
    padding: '12px 14px',
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
    padding: '14px 20px',
    fontSize: '16px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
    WebkitAppearance: 'none' as const,
  } as React.CSSProperties,

  btnGold: {
    width: '100%',
    background: C.gold,
    color: C.navy,
    border: 'none',
    borderRadius: '12px',
    padding: '14px 20px',
    fontSize: '16px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
    WebkitAppearance: 'none' as const,
  } as React.CSSProperties,

  btnOutline: {
    background: C.white,
    color: C.gray700,
    border: `2px solid ${C.gray200}`,
    borderRadius: '10px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  error: {
    background: '#fef2f2',
    border: `1px solid #fca5a5`,
    color: '#dc2626',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
  } as React.CSSProperties,

  hint: {
    fontSize: '12px',
    color: C.gray400,
    marginTop: '4px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '19px',
    fontWeight: 800,
    color: C.navy,
    margin: '0 0 16px',
    paddingBottom: '10px',
    borderBottom: `2px solid ${C.gray100}`,
  } as React.CSSProperties,

  tabBar: {
    display: 'flex',
    gap: '5px',
    background: C.gray100,
    borderRadius: '11px',
    padding: '4px',
    marginBottom: '20px',
    overflowX: 'auto' as const,
    flexWrap: 'nowrap' as const,
    WebkitOverflowScrolling: 'touch' as const,
  } as React.CSSProperties,

  infoBox: {
    background: C.gray50,
    borderRadius: '12px',
    padding: '16px',
    marginTop: '18px',
    border: `1px solid ${C.gray200}`,
  } as React.CSSProperties,

  statCard: {
    background: C.gray50,
    borderRadius: '11px',
    padding: '12px',
    textAlign: 'center' as const,
    border: `1px solid ${C.gray200}`,
  } as React.CSSProperties,

  statVal: {
    fontSize: '20px',
    fontWeight: 800,
    color: C.navy,
    margin: '0 0 2px',
  } as React.CSSProperties,

  statLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: C.gray500,
    margin: 0,
  } as React.CSSProperties,
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Home',        href: '/' },
  { label: 'Govt Jobs',   href: '/govt-jobs' },
  { label: 'Exams',       href: '/exams' },
  { label: 'Information', href: '/information' },
  { label: 'PDF Forms',   href: '/pdf-forms' },
  { label: 'Results',     href: '/results' },
  { label: '🛠 Tools',    href: '/tools' },
]

export function ToolsNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <style>{`
        .acpi-nav-link {
          text-decoration: none;
          padding: 7px 12px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
          display: inline-block;
        }
        .acpi-nav-link:hover {
          background: #1dbfad !important;
          color: #0b1f33 !important;
          border-color: #1dbfad !important;
        }
        .acpi-nav-scroll {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          max-width: calc(100% - 160px);
        }
        .acpi-nav-scroll::-webkit-scrollbar { display: none; }
        @media (max-width: 600px) {
          .acpi-nav-scroll { display: none; }
          .acpi-mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 601px) {
          .acpi-mobile-menu-btn { display: none !important; }
        }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: C.navy, borderBottom: '2px solid rgba(29,191,173,0.3)', boxShadow: '0 2px 14px rgba(0,0,0,0.25)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '58px' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '9px', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: C.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, color: C.navy, flexShrink: 0 }}>A</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: C.white }}>Assam Career</div>
              <div style={{ fontSize: '11px', color: C.teal }}>Point & Info</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="acpi-nav-scroll">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} className="acpi-nav-link">{item.label}</Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="acpi-mobile-menu-btn"
            onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', color: C.white, cursor: 'pointer', fontSize: '22px', padding: '4px', display: 'none', alignItems: 'center' }}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div style={{ background: '#0f2744', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href} className="acpi-nav-link" onClick={() => setOpen(false)}>{item.label}</Link>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}

export function ToolHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={S.hero()}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <Link href="/tools" style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginBottom: '12px' }}>← Back to Tools</Link>
        <h1 style={S.heroTitle}>{title}</h1>
        <p style={S.heroDesc}>{desc}</p>
      </div>
    </div>
  )
}

export function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px', borderRadius: '8px', border: 'none',
      fontSize: '13px', fontWeight: 700, cursor: 'pointer',
      whiteSpace: 'nowrap' as const, fontFamily: 'inherit', flexShrink: 0,
      background: active ? C.teal : 'transparent',
      color: active ? C.white : C.gray500,
    }}>
      {children}
    </button>
  )
}

export function ModeTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '11px 8px', borderRadius: '9px', border: 'none',
      fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
      background: active ? C.white : 'transparent',
      color: active ? C.navy : C.gray500,
      boxShadow: active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
    }}>
      {label}
    </button>
  )
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: '48px', height: '26px', borderRadius: '99px', border: 'none',
      background: on ? C.teal : C.gray200, cursor: 'pointer', position: 'relative', flexShrink: 0,
    }}>
      <span style={{ position: 'absolute', top: '3px', left: on ? '24px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: C.white, boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
    </button>
  )
}

export function Divider({ title }: { title: string }) {
  return (
    <div style={{ margin: '18px 0 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, height: '1px', background: C.gray200 }} />
      <span style={{ fontSize: '11px', fontWeight: 700, color: C.gray400, textTransform: 'uppercase' as const, letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }}>{title}</span>
      <div style={{ flex: 1, height: '1px', background: C.gray200 }} />
    </div>
  )
}

export function Seg({ opts, val, set }: { opts: string[]; val: string; set: (v: any) => void }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
      {opts.map(o => (
        <button key={o} onClick={() => set(o)} style={{
          padding: '8px 13px', borderRadius: '9px', fontSize: '13px', fontWeight: 700,
          border: `2px solid ${val === o ? C.teal : C.gray200}`,
          background: val === o ? '#e6faf8' : C.white,
          color: val === o ? C.teal2 : C.gray500,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>{o}</button>
      ))}
    </div>
  )
}
