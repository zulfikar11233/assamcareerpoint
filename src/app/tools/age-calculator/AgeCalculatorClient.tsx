'use client'
import { useState, useMemo } from 'react'
import { C, S, ToolsNavbar, ToolHeader } from '../_shared'

const EXAMS = [
  { name:'ADRE Grade III',            min:18, max:{general:40,obc:43,sc:45,stp:45,sth:45,ews:40,pwd:50}, cat:'Assam State' },
  { name:'ADRE Grade IV',             min:18, max:{general:40,obc:43,sc:45,stp:45,sth:45,ews:40,pwd:50}, cat:'Assam State' },
  { name:'APSC CCE',                  min:21, max:{general:38,obc:41,sc:43,stp:43,sth:43,ews:38,pwd:48}, cat:'Assam State' },
  { name:'SLPRB – Assam Police SI',   min:20, max:{general:26,obc:29,sc:31,stp:31,sth:31,ews:26,pwd:36}, cat:'Assam State' },
  { name:'SLPRB – Constable',         min:18, max:{general:25,obc:28,sc:30,stp:30,sth:30,ews:25,pwd:35}, cat:'Assam State' },
  { name:'SSC CGL',                   min:18, max:{general:32,obc:35,sc:37,stp:37,sth:37,ews:32,pwd:42}, cat:'Central' },
  { name:'SSC CHSL',                  min:18, max:{general:27,obc:30,sc:32,stp:32,sth:32,ews:27,pwd:37}, cat:'Central' },
  { name:'SSC MTS',                   min:18, max:{general:25,obc:28,sc:30,stp:30,sth:30,ews:25,pwd:35}, cat:'Central' },
  { name:'SSC GD Constable',          min:18, max:{general:23,obc:26,sc:28,stp:28,sth:28,ews:23,pwd:33}, cat:'Central' },
  { name:'RRB NTPC',                  min:18, max:{general:33,obc:36,sc:38,stp:38,sth:38,ews:33,pwd:43}, cat:'Railway' },
  { name:'RRB Group D',               min:18, max:{general:33,obc:36,sc:38,stp:38,sth:38,ews:33,pwd:43}, cat:'Railway' },
  { name:'IBPS PO / Clerk',           min:20, max:{general:30,obc:33,sc:35,stp:35,sth:35,ews:30,pwd:40}, cat:'Banking' },
  { name:'SBI PO / Clerk',            min:20, max:{general:30,obc:33,sc:35,stp:35,sth:35,ews:30,pwd:40}, cat:'Banking' },
  { name:'UPSC Civil Services',       min:21, max:{general:32,obc:35,sc:37,stp:37,sth:37,ews:32,pwd:42}, cat:'UPSC' },
]
const CATS_LIST = ['Assam State','Central','Railway','Banking','UPSC']
const CAT_LABELS: Record<string,string> = {
  general:'General / Unreserved', ews:'EWS', obc:'OBC / MOBC',
  sc:'Schedule Caste (SC)', stp:'Schedule Tribe (ST-P)', sth:'Schedule Tribe (ST-H)',
  pwd:'PwD',
}

function calcAge(dob:Date, ref:Date) {
  let y=ref.getFullYear()-dob.getFullYear(), m=ref.getMonth()-dob.getMonth(), d=ref.getDate()-dob.getDate()
  if(d<0){m--;d+=new Date(ref.getFullYear(),ref.getMonth(),0).getDate()}
  if(m<0){y--;m+=12}
  return {y,m,d}
}
const zodiac=(d:Date)=>{const mo=d.getMonth()+1,day=d.getDate();if((mo===3&&day>=21)||(mo===4&&day<=19))return'♈ Aries';if((mo===4&&day>=20)||(mo===5&&day<=20))return'♉ Taurus';if((mo===5&&day>=21)||(mo===6&&day<=20))return'♊ Gemini';if((mo===6&&day>=21)||(mo===7&&day<=22))return'♋ Cancer';if((mo===7&&day>=23)||(mo===8&&day<=22))return'♌ Leo';if((mo===8&&day>=23)||(mo===9&&day<=22))return'♍ Virgo';if((mo===9&&day>=23)||(mo===10&&day<=22))return'♎ Libra';if((mo===10&&day>=23)||(mo===11&&day<=21))return'♏ Scorpio';if((mo===11&&day>=22)||(mo===12&&day<=21))return'♐ Sagittarius';if((mo===12&&day>=22)||(mo===1&&day<=19))return'♑ Capricorn';if((mo===1&&day>=20)||(mo===2&&day<=18))return'♒ Aquarius';return'♓ Pisces'}

export default function AgeCalculatorClient() {
  const [dob, setDob]       = useState('')
  const [ref, setRef]       = useState(new Date().toISOString().split('T')[0])
  const [cat, setCat]       = useState<keyof typeof EXAMS[0]['max']>('general')
  const [mode, setMode]     = useState<'basic'|'exam'>('basic')
  const [group, setGroup]   = useState('Assam State')

  const dobDate = dob ? new Date(dob) : null
  const refDate = ref ? new Date(ref) : new Date()
  const age     = useMemo(()=>dobDate ? calcAge(dobDate,refDate) : null,[dob,ref])
  const totalDays = useMemo(()=>dobDate ? Math.floor((refDate.getTime()-dobDate.getTime())/(86400000)):0,[dob,ref])
  const nextBday  = useMemo(()=>{
    if(!dobDate) return null
    const t=new Date(); let n=new Date(t.getFullYear(),dobDate.getMonth(),dobDate.getDate())
    if(n<=t) n.setFullYear(n.getFullYear()+1)
    return Math.floor((n.getTime()-t.getTime())/86400000)
  },[dob])

  const eligible = useMemo(()=>{
    if(!age) return []
    return EXAMS.filter(e=>e.cat===group).map(e=>{
      const mx = e.max[cat]; const eligible=age.y>=e.min&&age.y<=mx
      return {...e, mx, eligible, left:mx-age.y}
    })
  },[age,cat,group])

  const bigNum = (v:number|string, label:string) => (
    <div style={{ textAlign:'center', padding:'0 16px' }}>
      <p style={{ fontSize:'56px', fontWeight:800, color:C.navy, margin:'0 0 4px', lineHeight:1 }}>{v}</p>
      <p style={{ fontSize:'15px', color:C.gray500, margin:0, fontWeight:600 }}>{label}</p>
    </div>
  )

  const modeBtn = (m:'basic'|'exam', label:string) => (
    <button onClick={()=>setMode(m)} style={{
      flex:1, padding:'14px', borderRadius:'12px', border:'none', fontSize:'16px', fontWeight:700,
      fontFamily:'inherit', cursor:'pointer',
      background: mode===m ? C.teal : 'transparent', color: mode===m ? C.white : C.gray500,
      transition:'all 0.15s',
    }}>{label}</button>
  )

  return (
    <main style={S.page}>
      <ToolsNavbar />
      <ToolHeader title="Age Calculator"
        desc="Calculate your exact age and check government exam eligibility. Includes OBC/SC/ST age relaxation for ADRE, APSC, SSC, Railway, Bank and UPSC exams." />

      <div style={S.wrap}>

        {/* Mode toggle */}
        <div style={{ display:'flex', background:C.white, border:`1px solid ${C.gray200}`, borderRadius:'16px', padding:'6px', marginBottom:'28px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
          {modeBtn('basic','🧮 Basic Age')}
          {modeBtn('exam','📋 Exam Eligibility')}
        </div>

        <div style={S.grid2}>
          {/* Input */}
          <div style={S.card}>
            <h2 style={S.cardTitle}>Enter Details</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              <div>
                <label style={S.label}>Date of Birth *</label>
                <input style={S.input} type="date" value={dob} onChange={e=>setDob(e.target.value)} max={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label style={S.label}>Calculate Age As On</label>
                <input style={S.input} type="date" value={ref} onChange={e=>setRef(e.target.value)} />
                <p style={S.hint}>For exam eligibility — enter the cut-off date from the official notification</p>
              </div>
              {mode==='exam' && (
                <div>
                  <label style={S.label}>Your Category</label>
                  <select style={S.select} value={cat} onChange={e=>setCat(e.target.value as any)}>
                    {Object.entries(CAT_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div style={{ ...S.infoBox, marginTop:'24px' }}>
              <p style={{ margin:'0 0 12px', fontSize:'15px', fontWeight:700, color:C.gray700 }}>Common Cut-Off Dates</p>
              {[
                ['ADRE / Assam Govt','January 1 of notification year'],
                ['SSC CGL/CHSL/MTS','August 1 of exam year'],
                ['UPSC Civil Services','August 1 of exam year'],
                ['IBPS / Bank exams','Date in notification'],
                ['Railway RRB','Date in notification'],
              ].map(([e,d])=>(
                <div key={e} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.gray100}`, fontSize:'14px' }}>
                  <span style={{ color:C.gray600 }}>{e}</span>
                  <span style={{ fontWeight:700, color:C.teal }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Result */}
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
            {!age ? (
              <div style={{ ...S.card, textAlign:'center', padding:'60px 20px' }}>
                <div style={{ fontSize:'72px', opacity:0.15, marginBottom:'16px' }}>🎂</div>
                <p style={{ color:C.gray400, fontSize:'16px', margin:0 }}>Enter your date of birth to calculate your age</p>
              </div>
            ) : (
              <>
                <div style={{ ...S.card, textAlign:'center' }}>
                  <p style={{ fontSize:'14px', fontWeight:700, color:C.gray400, textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 24px' }}>
                    Your Age As On {new Date(ref).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}
                  </p>
                  <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginBottom:'20px' }}>
                    {bigNum(age.y,'Years')}
                    <div style={{ fontSize:'32px', color:C.gray200, alignSelf:'center' }}>·</div>
                    {bigNum(age.m,'Months')}
                    <div style={{ fontSize:'32px', color:C.gray200, alignSelf:'center' }}>·</div>
                    {bigNum(age.d,'Days')}
                  </div>
                  <p style={{ color:C.gray400, fontSize:'15px', margin:0 }}>= {totalDays.toLocaleString()} total days</p>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  {[
                    { l:'Total Weeks',      v:Math.floor(totalDays/7).toLocaleString() },
                    { l:'Total Hours',      v:(totalDays*24).toLocaleString() },
                    { l:'Day of Birth',     v:dobDate!.toLocaleDateString('en-IN',{weekday:'long'}) },
                    { l:'Zodiac Sign',      v:zodiac(dobDate!) },
                    { l:'Days to Birthday', v:nextBday===0?'🎉 Today!':nextBday+' days' },
                  ].map(x=>(
                    <div key={x.l} style={S.statCard}>
                      <p style={{ ...S.statVal, fontSize:'18px' }}>{x.v}</p>
                      <p style={S.statLabel}>{x.l}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Exam eligibility */}
        {mode==='exam' && age && (
          <div style={{ ...S.card, marginTop:'28px' }}>
            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'16px', marginBottom:'20px' }}>
              <h2 style={{ ...S.sectionTitle, margin:0, border:'none', paddingBottom:0 }}>Exam Eligibility Check</h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                {CATS_LIST.map(g=>(
                  <button key={g} onClick={()=>setGroup(g)} style={{
                    padding:'8px 16px', borderRadius:'10px', fontSize:'14px', fontWeight:700, fontFamily:'inherit',
                    border:`2px solid ${group===g ? C.teal : C.gray200}`,
                    background: group===g ? '#e6faf8' : C.white, color: group===g ? C.teal2 : C.gray500, cursor:'pointer',
                  }}>{g}</button>
                ))}
              </div>
            </div>
            <p style={{ fontSize:'15px', color:C.gray500, marginBottom:'16px' }}>
              Age: <strong style={{ color:C.navy }}>{age.y} years {age.m} months</strong> · Category: <strong style={{ color:C.navy }}>{CAT_LABELS[cat]}</strong> · Reference: <strong style={{ color:C.navy }}>{new Date(ref).toLocaleDateString('en-IN')}</strong>
            </p>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'15px' }}>
                <thead>
                  <tr style={{ background:C.gray50 }}>
                    {['Exam / Post','Min Age','Max Age','Years Left','Status'].map(h=>(
                      <th key={h} style={{ padding:'14px 16px', textAlign: h==='Exam / Post'?'left':'center', fontWeight:700, color:C.gray700, borderBottom:`2px solid ${C.gray200}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {eligible.map((e,i)=>(
                    <tr key={e.name} style={{ background: i%2===0 ? C.gray50 : C.white }}>
                      <td style={{ padding:'14px 16px', fontWeight:600, color:C.gray800, borderBottom:`1px solid ${C.gray100}` }}>{e.name}</td>
                      <td style={{ padding:'14px 16px', textAlign:'center', color:C.gray600, borderBottom:`1px solid ${C.gray100}` }}>{e.min}</td>
                      <td style={{ padding:'14px 16px', textAlign:'center', color:C.gray600, borderBottom:`1px solid ${C.gray100}` }}>{e.mx}</td>
                      <td style={{ padding:'14px 16px', textAlign:'center', borderBottom:`1px solid ${C.gray100}` }}>
                        {e.eligible ? <span style={{ fontWeight:700, color:'#16a34a' }}>{e.left} yr{e.left!==1?'s':''}</span>
                         : age.y<e.min ? <span style={{ color:'#2563eb' }}>Too young</span>
                         : <span style={{ color:C.gray400 }}>—</span>}
                      </td>
                      <td style={{ padding:'14px 16px', textAlign:'center', borderBottom:`1px solid ${C.gray100}` }}>
                        {age.y<e.min
                          ? <span style={{ background:'#eff6ff', color:'#1d4ed8', borderRadius:'99px', padding:'4px 12px', fontSize:'13px', fontWeight:700 }}>Too Young</span>
                          : e.eligible
                          ? <span style={{ background:'#f0fdf4', color:'#15803d', borderRadius:'99px', padding:'4px 12px', fontSize:'13px', fontWeight:700 }}>✓ Eligible</span>
                          : <span style={{ background:'#fef2f2', color:'#dc2626', borderRadius:'99px', padding:'4px 12px', fontSize:'13px', fontWeight:700 }}>✗ Over Age</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize:'13px', color:C.gray400, marginTop:'12px' }}>⚠ Always verify exact age limits from the official notification before applying.</p>
          </div>
        )}

        {/* Relaxation table */}
        <div style={{ ...S.card, marginTop:'28px' }}>
          <h2 style={S.sectionTitle}>Age Relaxation Rules for Assam Government Jobs</h2>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'15px' }}>
              <thead>
                <tr style={{ background:C.gray50 }}>
                  {['Category','Relaxation','General Upper Limit','After Relaxation'].map(h=>(
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontWeight:700, color:C.gray700, borderBottom:`2px solid ${C.gray200}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['General / Unreserved','—','40 years','40 years'],
                  ['EWS','—','40 years','40 years'],
                  ['OBC / MOBC','+3 years','40 years','43 years'],
                  ['Schedule Caste (SC)','+5 years','40 years','45 years'],
                  ['Schedule Tribe (ST-P / ST-H)','+5 years','40 years','45 years'],
                  ['PwD (all categories)','+10 years','40 years','50 years'],
                ].map((r,i)=>(
                  <tr key={r[0]} style={{ background:i%2===0?C.gray50:C.white }}>
                    <td style={{ padding:'12px 16px', fontWeight:600, color:C.gray800, borderBottom:`1px solid ${C.gray100}` }}>{r[0]}</td>
                    <td style={{ padding:'12px 16px', fontWeight:700, color:C.teal, borderBottom:`1px solid ${C.gray100}` }}>{r[1]}</td>
                    <td style={{ padding:'12px 16px', color:C.gray600, borderBottom:`1px solid ${C.gray100}` }}>{r[2]}</td>
                    <td style={{ padding:'12px 16px', fontWeight:700, color:C.navy, borderBottom:`1px solid ${C.gray100}` }}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
