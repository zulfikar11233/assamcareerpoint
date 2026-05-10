'use client'
// src/components/AlertBanner.tsx
// ---------------------------------------------------------------------
// HOW TO USE:
//   SHOW banner -> set  enabled: true
//   HIDE banner -> set  enabled: false
//   That's it. Change nothing else.
// ---------------------------------------------------------------------

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

// EDIT ONLY THIS SECTION WHEN NEEDED
const CONFIG = {
  enabled:  True,                        // TRUE = show  |  FALSE = hide

  emoji:    '📢',                         // any emoji
  label:    'RESULT OUT',                 // small badge  e.g. "NEW" "URGENT" "IMPORTANT"
  title:    'HS Result 2026(AHSEC) - Check Now',
  desc:     'Assam Class 12 Board Result declared by AHSEC. Click the button to check your result directly.',
  linkText: 'Check Result ->',
  linkUrl:  'https://results.ahsecregistration.in/as/ahsec/class-12th-exam-result-2026-ahsec/query.htm',
  newTab:   true,                         // true = opens in new browser tab
  color:    'teal',                       // 'teal'  'amber'  'red'  'purple'
}

const COLORS = {
  teal:   { bg:'#062E28', bdr:'#0ECFB0', badge:'#0ECFB0', bTxt:'#031A15', btn:'#0ECFB0', btnTxt:'#031A15' },
  amber:  { bg:'#2E1900', bdr:'#FD8940', badge:'#FD8940', bTxt:'#150A00', btn:'#FD8940', btnTxt:'#150A00' },
  red:    { bg:'#2E0808', bdr:'#F05050', badge:'#F05050', bTxt:'#fff',    btn:'#F05050', btnTxt:'#fff'    },
  purple: { bg:'#160828', bdr:'#9B7FFF', badge:'#9B7FFF', bTxt:'#08001A', btn:'#9B7FFF', btnTxt:'#08001A' },
}

export default function AlertBanner() {
  const [closed, setClosed] = useState(false)
  const path = usePathname()

  // Auto-hide on admin pages - never edit this part
  if (!CONFIG.enabled || closed || path.startsWith('/admin')) return null

  const C = COLORS[CONFIG.color as keyof typeof COLORS] ?? COLORS.teal
  const ext = CONFIG.newTab ? { target:'_blank', rel:'noopener noreferrer' } : {}

  return (
    <>
      <style>{`
        .alert-banner { animation: alertSlide .35s ease; }
        @keyframes alertSlide { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        .alert-btn:hover { opacity:.88; transform:translateY(-1px); }
        .alert-close:hover { color:rgba(255,255,255,.75) !important; }
        @media(max-width:600px){
          .alert-inner { flex-direction:column !important; align-items:flex-start !important; gap:10px !important; }
          .alert-btn  { width:100% !important; justify-content:center !important; }
        }
      `}</style>

      <div className="alert-banner" style={{
        background: C.bg,
        borderLeft: `4px solid ${C.bdr}`,
        borderRadius: 12,
        margin: '14px 16px',
        padding: '14px 42px 14px 16px',
        position: 'relative',
        maxWidth: 940,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxSizing: 'border-box',
      }}>
        <div className="alert-inner" style={{
          display:'flex', alignItems:'center',
          gap:12, flexWrap:'wrap',
        }}>
          <span style={{ fontSize:'1.55rem', flexShrink:0, lineHeight:1 }}>
            {CONFIG.emoji}
          </span>

          <span style={{
            background: C.badge, color: C.bTxt,
            fontSize:'.62rem', fontWeight:800, letterSpacing:'.07em',
            padding:'3px 9px', borderRadius:99, flexShrink:0,
            fontFamily:'Nunito,sans-serif',
          }}>
            {CONFIG.label}
          </span>

          <div style={{ flex:1, minWidth:180 }}>
            <div style={{
              fontFamily:"'Sora',sans-serif", fontWeight:700,
              fontSize:'.9rem', color:'#fff', marginBottom:3,
            }}>
              {CONFIG.title}
            </div>
            <div style={{
              fontFamily:'Nunito,sans-serif', fontSize:'.77rem',
              color:'rgba(255,255,255,.52)', lineHeight:1.45,
            }}>
              {CONFIG.desc}
            </div>
          </div>

          <Link href={CONFIG.linkUrl} {...ext}
            className="alert-btn"
            style={{
              display:'inline-flex', alignItems:'center', gap:5,
              background: C.btn, color: C.btnTxt,
              fontFamily:'Nunito,sans-serif', fontWeight:800,
              fontSize:'.8rem', padding:'9px 18px', borderRadius:9,
              textDecoration:'none', flexShrink:0,
              whiteSpace:'nowrap' as const, transition:'.15s',
            }}>
            {CONFIG.linkText}
          </Link>
        </div>

        <button onClick={()=>setClosed(true)} aria-label="Close"
          className="alert-close"
          style={{
            position:'absolute', top:10, right:12,
            background:'none', border:'none',
            color:'rgba(255,255,255,.3)', cursor:'pointer',
            fontSize:'1rem', lineHeight:1, padding:4,
            transition:'.15s',
          }}>
          x
        </button>
      </div>
    </>
  )
}
