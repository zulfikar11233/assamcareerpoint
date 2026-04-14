'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { C, S, ToolHeader, TabBtn, Divider } from '../_shared'

const countWords     = (t:string) => t.trim()==='' ? 0 : t.trim().split(/\s+/).length
const countSentences = (t:string) => t.trim()==='' ? 0 : (t.match(/[^.!?]*[.!?]+/g)||[]).length
const countParagraphs= (t:string) => t.trim()==='' ? 0 : t.split(/\n\s*\n/).filter(p=>p.trim()).length
const countSyllables = (w:string) => { w=w.toLowerCase().replace(/[^a-z]/g,''); if(w.length<=3) return 1; w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,''); const m=w.match(/[aeiouy]{1,2}/g); return m?m.length:1 }
const readingLevel   = (words:number,sentences:number,syllables:number) => { if(!words||!sentences) return '—'; const sc=206.835-1.015*(words/sentences)-84.6*(syllables/words); if(sc>=90) return 'Very Easy (Grade 5)'; if(sc>=80) return 'Easy (Grade 6)'; if(sc>=70) return 'Fairly Easy (Grade 7)'; if(sc>=60) return 'Standard (Grade 8–9)'; if(sc>=50) return 'Fairly Difficult (College)'; return 'Difficult (Professional)' }
const topKeywords    = (text:string) => { const stop=new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','i','you','he','she','it','we','they','this','that','these','those','not','no','so','as','if','also','just','more','can','all','both','very','too','who','what','how','why','when','where','which']); const ws=text.toLowerCase().match(/\b[a-z]{3,}\b/g)||[]; const f:Record<string,number>={}; ws.forEach(w=>{if(!stop.has(w))f[w]=(f[w]||0)+1}); const tot=Object.values(f).reduce((a,b)=>a+b,0); return Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([w,c])=>({w,c,pct:tot>0?((c/tot)*100).toFixed(1):'0'})) }
const toTitleCase    = (t:string) => t.replace(/\w\S*/g,w=>w[0].toUpperCase()+w.slice(1).toLowerCase())
const toSentCase     = (t:string) => t.replace(/(^\s*\w|[.!?]\s*\w)/g,c=>c.toUpperCase())
const sentColor      = (len:number) => len<=1?'#6366f1':len<=6?'#0ea5e9':len<=15?'#22c55e':len<=25?'#f59e0b':len<=39?'#f97316':'#ef4444'

const EXAM_TARGETS = [
  { label:'Custom', val:0 },
  { label:'UPSC Essay (1200 words)', val:1200 },
  { label:'UPSC GS Answer (150 words)', val:150 },
  { label:'UPSC GS Answer (250 words)', val:250 },
  { label:'SSC Descriptive (250 words)', val:250 },
  { label:'APSC Essay (500 words)', val:500 },
  { label:'Cover Letter (400 words)', val:400 },
  { label:'Blog / Article (800 words)', val:800 },
]

export default function WordCounterClient() {
  const [text, setText]         = useState('')
  const [targetPreset, setTP]   = useState(0)
  const [customTarget, setCT]   = useState('')
  const [tab, setTab]           = useState<'stats'|'keywords'|'flow'|'tools'>('stats')
  const [findTxt, setFindTxt]   = useState('')
  const [replaceTxt, setReplace]= useState('')
  const [caseSen, setCaseSen]   = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [copied, setCopied]     = useState(false)
  const [showFlow, setShowFlow] = useState(false)

  const words      = countWords(text)
  const chars      = text.length
  const charsNS    = text.replace(/\s/g,'').length
  const sentences  = countSentences(text)
  const paragraphs = countParagraphs(text)
  const lines      = text==='' ? 0 : text.split('\n').length
  const uniqueW    = text.trim()==='' ? 0 : new Set(text.trim().toLowerCase().split(/\s+/)).size
  const allW: string[] = text.toLowerCase().match(/\b[a-z]+\b/g)||[]
  const syllables  = allW.reduce((acc:number,w:string)=>acc+countSyllables(w),0)
  const pages      = words>0 ? (words/250).toFixed(1) : '0'
  const readTime   = words>0 ? `${Math.ceil(words/238)} min` : '—'
  const speakTime  = words>0 ? `${Math.ceil(words/130)} min` : '—'
  const writeTime  = words>0 ? `${Math.ceil(words/20)} min` : '—'
  const level      = readingLevel(words,sentences,syllables)
  const keywords   = topKeywords(text)

  const targetVal  = targetPreset===0 ? (customTarget ? Number(customTarget) : 0) : targetPreset
  const progress   = targetVal>0 ? Math.min(110, Math.round((words/targetVal)*100)) : 0
  const progColor  = progress<70 ? C.teal : progress<90 ? '#f59e0b' : progress<=100 ? '#22c55e' : '#ef4444'

  const findCount  = findTxt ? (text.match(new RegExp(findTxt.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), caseSen?'g':'gi'))||[]).length : 0

  const doReplace = () => { if(!findTxt) return; setText(p=>p.replace(new RegExp(findTxt.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),caseSen?'g':'gi'),replaceTxt)) }
  const convert = (t:string) => { switch(t){case'upper':setText(text.toUpperCase());break;case'lower':setText(text.toLowerCase());break;case'title':setText(toTitleCase(text));break;case'sentence':setText(toSentCase(text));break;case'alt':setText(text.split('').map((c,i)=>i%2===0?c.toLowerCase():c.toUpperCase()).join(''));break} }
  const clean = (t:string) => { switch(t){case'spaces':setText(text.replace(/ +/g,' ').replace(/\n{3,}/g,'\n\n').trim());break;case'breaks':setText(text.replace(/\n+/g,' ').trim());break;case'trim':setText(text.split('\n').map(l=>l.trim()).join('\n'));break;case'nums':setText(text.replace(/\d+/g,''));break;case'punct':setText(text.replace(/[^\w\s]/g,''));break} }

  const toggleSpeak = () => {
    if(speaking){window.speechSynthesis.cancel();setSpeaking(false);return}
    if(!text.trim()) return
    const u=new SpeechSynthesisUtterance(text); u.onend=()=>setSpeaking(false)
    window.speechSynthesis.speak(u); setSpeaking(true)
  }
  const copyText = () => { navigator.clipboard.writeText(text).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)}) }
  const download = () => { const b=new Blob([text],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='text.txt'; a.click() }

  useEffect(()=>{ const t=setTimeout(()=>{if(text)localStorage.setItem('acpi_wc',text)},1000); return()=>clearTimeout(t) },[text])
  useEffect(()=>{ const s=localStorage.getItem('acpi_wc'); if(s) setText(s) },[])

  const flowHtml = useCallback(()=>{
    if(!text.trim()) return ''
    return text.split(/([.!?]+\s*)/).map((p)=>{
      const wc=p.trim().split(/\s+/).filter(Boolean).length
      if(!wc) return `<span>${p}</span>`
      const col=sentColor(wc)
      return `<span style="background:${col}20;border-bottom:2px solid ${col};padding:1px 0;" title="${wc} words">${p}</span>`
    }).join('')
  },[text])

  const smallBtn = (label:string, onClick:()=>void, active?:boolean) => (
    <button key={label} onClick={onClick} style={{
      padding:'9px 16px', borderRadius:'10px', fontSize:'14px', fontWeight:700, fontFamily:'inherit',
      border:`2px solid ${active ? C.teal : C.gray200}`,
      background: active ? '#e6faf8' : C.white, color: active ? C.teal2 : C.gray600,
      cursor:'pointer',
    }}>{label}</button>
  )

  return (
    <main style={S.page}>
      <ToolHeader title="Word Counter"
        desc="Count words, characters, sentences and reading time. Includes exam word limit checker, keyword density, sentence flow analysis, find & replace and case converter." />

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'40px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'24px', alignItems:'start' }}>

          {/* ── MAIN AREA ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

            {/* Target */}
            <div style={S.card}>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', alignItems:'flex-end' }}>
                <div style={{ flex:1, minWidth:'220px' }}>
                  <label style={S.label}>📏 Exam Word Limit Target</label>
                  <select style={S.select} value={targetPreset} onChange={e=>setTP(Number(e.target.value))}>
                    {EXAM_TARGETS.map(t=><option key={t.label} value={t.val}>{t.label}</option>)}
                  </select>
                </div>
                {targetPreset===0 && (
                  <div style={{ width:'180px' }}>
                    <label style={S.label}>Custom Limit (words)</label>
                    <input style={S.input} value={customTarget} onChange={e=>setCT(e.target.value)} placeholder="e.g. 500" type="number" />
                  </div>
                )}
              </div>
              {targetVal>0 && (
                <div style={{ marginTop:'16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                    <span style={{ fontSize:'15px', fontWeight:600, color:C.gray700 }}>{words.toLocaleString()} / {targetVal.toLocaleString()} words</span>
                    <span style={{ fontSize:'15px', fontWeight:800, color:progColor }}>{Math.min(progress,100)}%</span>
                  </div>
                  <div style={{ background:C.gray200, borderRadius:'99px', height:'10px', overflow:'hidden' }}>
                    <div style={{ height:'100%', background:progColor, width:`${Math.min(progress,100)}%`, borderRadius:'99px', transition:'width 0.3s' }} />
                  </div>
                  {progress>100 && <p style={{ color:'#dc2626', fontSize:'14px', marginTop:'8px', fontWeight:600 }}>⚠ Exceeded by {words-targetVal} words</p>}
                  {progress>=90&&progress<=100 && <p style={{ color:'#15803d', fontSize:'14px', marginTop:'8px', fontWeight:600 }}>✓ Within target — good to go!</p>}
                </div>
              )}
            </div>

            {/* Editor */}
            <div style={S.card}>
              {/* Toolbar */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'14px', paddingBottom:'14px', borderBottom:`1px solid ${C.gray100}` }}>
                <button onClick={()=>setText('')} style={{ padding:'8px 14px', borderRadius:'8px', border:`1px solid ${C.gray200}`, background:C.white, color:C.gray600, fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Clear</button>
                <button onClick={copyText} style={{ padding:'8px 14px', borderRadius:'8px', border:`1px solid ${C.gray200}`, background:C.white, color:C.gray600, fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>{copied?'✓ Copied':'📋 Copy'}</button>
                <button onClick={download} style={{ padding:'8px 14px', borderRadius:'8px', border:`1px solid ${C.gray200}`, background:C.white, color:C.gray600, fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>⬇ .txt</button>
                <button onClick={toggleSpeak} style={{ padding:'8px 14px', borderRadius:'8px', border:`1px solid ${speaking?'#fca5a5':C.gray200}`, background:speaking?'#fef2f2':C.white, color:speaking?'#dc2626':C.gray600, fontSize:'14px', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>{speaking?'⏹ Stop':'🔊 Read Aloud'}</button>
                <div style={{ marginLeft:'auto', display:'flex', gap:'8px' }}>
                  <span style={{ padding:'8px 14px', borderRadius:'8px', background:'#e6faf8', fontSize:'14px', fontWeight:800, color:C.teal2 }}>{words.toLocaleString()} words</span>
                  <span style={{ padding:'8px 14px', borderRadius:'8px', background:C.gray100, fontSize:'14px', fontWeight:700, color:C.gray600 }}>{chars.toLocaleString()} chars</span>
                </div>
              </div>
              <textarea
                value={text}
                onChange={e=>setText(e.target.value)}
                placeholder="Start typing or paste your text here…&#10;&#10;Word count, reading time, keyword density and more stats will update in real time."
                style={{ ...S.textarea, minHeight:'280px', border:'none', padding:0, resize:'vertical' }}
              />
            </div>

            {/* Flow highlight */}
            {showFlow && text.trim() && (
              <div style={S.card}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                  <h3 style={{ margin:0, fontSize:'17px', fontWeight:700, color:C.navy }}>Sentence Flow Highlight</h3>
                  <button onClick={()=>setShowFlow(false)} style={{ background:'none', border:'none', color:C.gray400, cursor:'pointer', fontSize:'18px' }}>✕</button>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'16px' }}>
                  {[['#6366f1','1 word'],['#0ea5e9','2–6 words'],['#22c55e','7–15 words'],['#f59e0b','16–25 words'],['#f97316','26–39 words'],['#ef4444','40+']].map(([c,l])=>(
                    <span key={l} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', color:C.gray500 }}>
                      <span style={{ width:'12px', height:'12px', borderRadius:'3px', background:c, display:'inline-block' }} />{l}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize:'16px', lineHeight:'2', color:C.gray800 }} dangerouslySetInnerHTML={{ __html:flowHtml() }} />
              </div>
            )}

            {/* Tabs */}
            <div style={S.card}>
              <div style={S.tabBar}>
                {(['stats','keywords','flow','tools'] as const).map(t=>(
                  <TabBtn key={t} active={tab===t} onClick={()=>setTab(t)}>
                    {t==='stats'?'📊 Detailed Stats':t==='keywords'?'🔑 Keywords':t==='flow'?'📈 Flow Analysis':'🛠 Text Tools'}
                  </TabBtn>
                ))}
              </div>

              {/* STATS */}
              {tab==='stats' && (
                <div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px,1fr))', gap:'12px', marginBottom:'20px' }}>
                    {[
                      ['Words',words.toLocaleString()],['Characters',chars.toLocaleString()],['Chars (no spaces)',charsNS.toLocaleString()],
                      ['Sentences',sentences.toLocaleString()],['Paragraphs',paragraphs.toLocaleString()],['Lines',lines.toLocaleString()],
                      ['Unique Words',uniqueW.toLocaleString()],['Syllables',syllables.toLocaleString()],['Pages (~250w)',pages],
                    ].map(([l,v])=>(
                      <div key={l} style={S.statCard}>
                        <p style={S.statVal}>{v}</p>
                        <p style={S.statLabel}>{l}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:'12px' }}>
                    {[
                      { l:'Reading Time', v:readTime, bg:'#E1F5EE', cl:'#0F6E56' },
                      { l:'Speaking Time', v:speakTime, bg:'#E6F1FB', cl:'#185FA5' },
                      { l:'Handwriting Time', v:writeTime, bg:'#FAEEDA', cl:'#854F0B' },
                      { l:'Reading Level', v:level.split('(')[0].trim(), bg:'#EEEDFE', cl:'#534AB7' },
                    ].map(x=>(
                      <div key={x.l} style={{ background:x.bg, borderRadius:'14px', padding:'16px', textAlign:'center' }}>
                        <p style={{ fontSize:'18px', fontWeight:800, color:x.cl, margin:'0 0 4px' }}>{x.v}</p>
                        <p style={{ fontSize:'13px', fontWeight:600, color:x.cl, margin:0, opacity:0.8 }}>{x.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* KEYWORDS */}
              {tab==='keywords' && (
                <div>
                  <p style={{ fontSize:'15px', color:C.gray500, marginBottom:'20px' }}>Top keywords in your text (stop words excluded). Useful for checking keyword balance in articles and essays.</p>
                  {keywords.length===0 ? <p style={{ color:C.gray400, fontStyle:'italic' }}>Start typing to see keyword analysis…</p> : (
                    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                      {keywords.map(k=>(
                        <div key={k.w} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                          <span style={{ width:'120px', fontSize:'15px', fontWeight:700, color:C.gray700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{k.w}</span>
                          <div style={{ flex:1, background:C.gray100, borderRadius:'99px', height:'24px', overflow:'hidden' }}>
                            <div style={{ height:'100%', background:C.teal, borderRadius:'99px', width:`${Math.max(8,Number(k.pct)*4)}%`, minWidth:'36px', display:'flex', alignItems:'center', paddingLeft:'10px' }}>
                              <span style={{ fontSize:'12px', fontWeight:700, color:C.white }}>{k.c}×</span>
                            </div>
                          </div>
                          <span style={{ fontSize:'14px', color:C.gray500, width:'40px', textAlign:'right' }}>{k.pct}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* FLOW */}
              {tab==='flow' && (
                <div>
                  <p style={{ fontSize:'15px', color:C.gray500, marginBottom:'20px' }}>Sentence length variety makes writing more engaging. Mix short punchy sentences with longer ones for better readability.</p>
                  {text.trim()==='' ? <p style={{ color:C.gray400, fontStyle:'italic' }}>Start typing to see flow analysis…</p> : (() => {
                    const sl=text.match(/[^.!?]+[.!?]+/g)||text.split('\n').filter(Boolean)
                    const b={a:0,b:0,c:0,d:0,e:0,f:0}
                    sl.forEach(s=>{const w=s.trim().split(/\s+/).length; if(w<=1)b.a++;else if(w<=6)b.b++;else if(w<=15)b.c++;else if(w<=25)b.d++;else if(w<=39)b.e++;else b.f++})
                    const tot=sl.length
                    const rows=[
                      {l:'Impact (1 word)',k:'a',c:'#6366f1'},{l:'Staccato (2–6 words)',k:'b',c:'#0ea5e9'},
                      {l:'Standard (7–15 words)',k:'c',c:'#22c55e'},{l:'Complex (16–25 words)',k:'d',c:'#f59e0b'},
                      {l:'Long (26–39 words)',k:'e',c:'#f97316'},{l:'Very Long (40+)',k:'f',c:'#ef4444'},
                    ] as const
                    return (
                      <div>
                        <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'20px' }}>
                          {rows.map(r=>{const cnt=b[r.k as keyof typeof b]; const pct=tot>0?Math.round((cnt/tot)*100):0; return (
                            <div key={r.k} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                              <span style={{ width:'160px', fontSize:'13px', fontWeight:600, color:C.gray600, flexShrink:0 }}>{r.l}</span>
                              <div style={{ flex:1, background:C.gray100, borderRadius:'99px', height:'22px', overflow:'hidden' }}>
                                <div style={{ height:'100%', background:r.c, width:`${pct}%`, borderRadius:'99px', minWidth:cnt>0?16:0 }} />
                              </div>
                              <span style={{ fontSize:'15px', fontWeight:800, color:r.c, width:'24px', textAlign:'right' }}>{cnt}</span>
                              <span style={{ fontSize:'13px', color:C.gray400, width:'32px' }}>{pct}%</span>
                            </div>
                          )})}
                        </div>
                        <button onClick={()=>setShowFlow(true)} style={{ ...S.btnPrimary, width:'auto', padding:'12px 24px', fontSize:'15px' }}>
                          View Colour-Highlighted Text ↑
                        </button>
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* TOOLS */}
              {tab==='tools' && (
                <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
                  <div>
                    <p style={{ ...S.cardTitle, fontSize:'16px', marginBottom:'12px' }}>🔤 Case Converter</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                      {[['sentence','Sentence case'],['title','Title Case'],['upper','UPPERCASE'],['lower','lowercase'],['alt','aLtErNaTe']].map(([t,l])=>smallBtn(l,()=>convert(t)))}
                    </div>
                  </div>
                  <Divider title="Find & Replace" />
                  <div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'12px' }}>
                      <div>
                        <label style={S.label}>Find {findTxt&&findCount>0&&<span style={{ color:C.teal, fontWeight:700 }}>({findCount} found)</span>}</label>
                        <input style={S.input} value={findTxt} onChange={e=>setFindTxt(e.target.value)} placeholder="Search text…" />
                      </div>
                      <div>
                        <label style={S.label}>Replace with</label>
                        <input style={S.input} value={replaceTxt} onChange={e=>setReplace(e.target.value)} placeholder="Replace with…" />
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
                      <button onClick={doReplace} disabled={!findTxt} style={{ ...S.btnPrimary, width:'auto', padding:'12px 24px', fontSize:'15px', opacity:findTxt?1:0.4 }}>Replace All</button>
                      <label style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'15px', color:C.gray600, cursor:'pointer' }}>
                        <input type="checkbox" checked={caseSen} onChange={e=>setCaseSen(e.target.checked)} style={{ accentColor:C.teal, width:'16px', height:'16px' }} />
                        Case sensitive
                      </label>
                    </div>
                  </div>
                  <Divider title="Clean Text" />
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                    {[['spaces','Remove Extra Spaces'],['trim','Trim Line Spaces'],['breaks','Remove Line Breaks'],['nums','Remove Numbers'],['punct','Remove Punctuation']].map(([t,l])=>smallBtn(l,()=>clean(t)))}
                  </div>
                  <Divider title="Export" />
                  <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                    <button onClick={download} style={{ ...S.btnOutline, fontSize:'15px' }}>⬇ Download as .TXT</button>
                    <button onClick={copyText} style={{ ...S.btnOutline, fontSize:'15px' }}>{copied?'✓ Copied!':'📋 Copy All'}</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ ...S.card, position:'sticky', top:'20px' }}>
            <h2 style={{ fontSize:'17px', fontWeight:800, color:C.navy, margin:'0 0 16px' }}>Quick Stats</h2>
            {[
              { l:'Words',           v:words.toLocaleString(),    c:C.teal },
              { l:'Characters',      v:chars.toLocaleString(),    c:'#378ADD' },
              { l:'Sentences',       v:sentences.toLocaleString(),c:'#534AB7' },
              { l:'Paragraphs',      v:paragraphs.toLocaleString(),c:'#f59e0b' },
              { l:'Unique Words',    v:uniqueW.toLocaleString(),  c:'#22c55e' },
              { l:'Pages',           v:pages,                     c:'#f97316' },
              { l:'Reading Time',    v:readTime,                  c:'#ec4899' },
              { l:'Speaking Time',   v:speakTime,                 c:'#8b5cf6' },
              { l:'Reading Level',   v:level.split('(')[0].trim(),c:C.navy },
            ].map(x=>(
              <div key={x.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.gray100}` }}>
                <span style={{ fontSize:'14px', color:C.gray500 }}>{x.l}</span>
                <span style={{ fontSize:'14px', fontWeight:800, color:x.c }}>{x.v}</span>
              </div>
            ))}

            <div style={{ marginTop:'20px', paddingTop:'16px', borderTop:`1px solid ${C.gray100}` }}>
              <p style={{ fontSize:'12px', fontWeight:700, color:C.gray400, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'12px' }}>Exam Word Limits</p>
              {[['UPSC GS Answer','150–250 w'],['UPSC Essay','1000–1200 w'],['SSC Descriptive','200–250 w'],['APSC Essay','~500 w'],['Cover Letter','300–400 w']].map(([e,l])=>(
                <div key={e} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:'13px' }}>
                  <span style={{ color:C.gray500 }}>{e}</span>
                  <span style={{ fontWeight:700, color:C.teal }}>{l}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize:'12px', color:C.gray400, marginTop:'14px' }}>💾 Auto-saved in browser</p>
          </div>
        </div>
      </div>
    </main>
  )
}
