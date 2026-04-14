'use client'
import Link from 'next/link'

// ─── Brand tokens ────────────────────────────────────────────────────────────
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

  hero: (extra?: React.CSSProperties): React.CSSProperties => ({
    background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`,
    padding: '48px 24px 40px',
    ...extra,
  }),

  heroBack: {
    display: 'inline-block',
    color: '#94a3b8',
    fontSize: '15px',
    fontWeight: 600,
    textDecoration: 'none',
    marginBottom: '16px',
  } as React.CSSProperties,

  heroTitle: {
    fontSize: 'clamp(28px, 5vw, 42px)',
    fontWeight: 800,
    color: C.white,
    margin: '0 0 12px',
    lineHeight: 1.2,
  } as React.CSSProperties,

  heroDesc: {
    fontSize: '17px',
    color: '#cbd5e1',
    margin: 0,
    lineHeight: 1.7,
    maxWidth: '600px',
  } as React.CSSProperties,

  wrap: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
  } as React.CSSProperties,

  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  } as React.CSSProperties,

  card: {
    background: C.white,
    borderRadius: '20px',
    border: `1px solid ${C.gray200}`,
    padding: '28px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  } as React.CSSProperties,

  cardTitle: {
    fontSize: '18px',
    fontWeight: 800,
    color: C.navy,
    margin: '0 0 20px',
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: '15px',
    fontWeight: 700,
    color: C.gray700,
    marginBottom: '8px',
  } as React.CSSProperties,

  input: {
    width: '100%',
    border: `2px solid ${C.gray200}`,
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '16px',
    color: C.gray800,
    background: C.white,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  } as React.CSSProperties,

  select: {
    width: '100%',
    border: `2px solid ${C.gray200}`,
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '16px',
    color: C.gray800,
    background: C.white,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    cursor: 'pointer',
  } as React.CSSProperties,

  textarea: {
    width: '100%',
    border: `2px solid ${C.gray200}`,
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '16px',
    color: C.gray800,
    background: C.white,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
  } as React.CSSProperties,

  btnPrimary: {
    width: '100%',
    background: C.teal,
    color: C.white,
    border: 'none',
    borderRadius: '14px',
    padding: '16px 24px',
    fontSize: '17px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'opacity 0.2s',
  } as React.CSSProperties,

  btnGold: {
    width: '100%',
    background: C.gold,
    color: C.navy,
    border: 'none',
    borderRadius: '14px',
    padding: '16px 24px',
    fontSize: '17px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  btnOutline: {
    background: C.white,
    color: C.gray700,
    border: `2px solid ${C.gray200}`,
    borderRadius: '12px',
    padding: '12px 20px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  error: {
    background: '#fef2f2',
    border: `1px solid #fca5a5`,
    color: '#dc2626',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '15px',
    marginTop: '12px',
  } as React.CSSProperties,

  hint: {
    fontSize: '13px',
    color: C.gray400,
    marginTop: '6px',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '22px',
    fontWeight: 800,
    color: C.navy,
    margin: '0 0 20px',
    paddingBottom: '12px',
    borderBottom: `2px solid ${C.gray100}`,
  } as React.CSSProperties,

  tag: (bg: string, cl: string): React.CSSProperties => ({
    display: 'inline-block',
    background: bg,
    color: cl,
    borderRadius: '99px',
    padding: '4px 12px',
    fontSize: '13px',
    fontWeight: 700,
  }),

  tabBar: {
    display: 'flex',
    gap: '8px',
    background: C.gray100,
    borderRadius: '14px',
    padding: '6px',
    marginBottom: '24px',
    overflowX: 'auto' as const,
  } as React.CSSProperties,

  infoBox: {
    background: C.gray50,
    borderRadius: '14px',
    padding: '20px',
    marginTop: '24px',
    border: `1px solid ${C.gray200}`,
  } as React.CSSProperties,

  statCard: {
    background: C.gray50,
    borderRadius: '14px',
    padding: '16px',
    textAlign: 'center' as const,
    border: `1px solid ${C.gray200}`,
  } as React.CSSProperties,

  statVal: {
    fontSize: '26px',
    fontWeight: 800,
    color: C.navy,
    margin: '0 0 4px',
  } as React.CSSProperties,

  statLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: C.gray500,
    margin: 0,
  } as React.CSSProperties,
}

// ─── Reusable ToolHeader ──────────────────────────────────────────────────────
export function ToolHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={S.hero()}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Link href="/tools" style={S.heroBack}>← Back to Tools</Link>
        <h1 style={S.heroTitle}>{title}</h1>
        <p style={S.heroDesc}>{desc}</p>
      </div>
    </div>
  )
}

// ─── Tab button ───────────────────────────────────────────────────────────────
export function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px',
        borderRadius: '10px',
        border: 'none',
        fontSize: '14px',
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap' as const,
        fontFamily: 'inherit',
        background: active ? C.teal : 'transparent',
        color: active ? C.white : C.gray500,
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

// ─── Mode tab (UPI ID / Bank / Mobile style) ──────────────────────────────────
export function ModeTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px 8px',
        borderRadius: '10px',
        border: 'none',
        fontSize: '15px',
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        background: active ? C.white : 'transparent',
        color: active ? C.navy : C.gray500,
        boxShadow: active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

// ─── Toggle switch ────────────────────────────────────────────────────────────
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: '52px',
        height: '28px',
        borderRadius: '99px',
        border: 'none',
        background: on ? C.teal : C.gray200,
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: '3px',
        left: on ? '27px' : '3px',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: C.white,
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

// ─── Section divider ──────────────────────────────────────────────────────────
export function Divider({ title }: { title: string }) {
  return (
    <div style={{ margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ flex: 1, height: '1px', background: C.gray200 }} />
      <span style={{ fontSize: '13px', fontWeight: 700, color: C.gray400, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</span>
      <div style={{ flex: 1, height: '1px', background: C.gray200 }} />
    </div>
  )
}
