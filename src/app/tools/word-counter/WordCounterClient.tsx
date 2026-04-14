'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'

/* ─── helpers ─── */
const countWords = (t: string) => t.trim() === '' ? 0 : t.trim().split(/\s+/).length
const countSentences = (t: string) => t.trim() === '' ? 0 : (t.match(/[^.!?]*[.!?]+/g) || []).length
const countParagraphs = (t: string) => t.trim() === '' ? 0 : t.split(/\n\s*\n/).filter(p => p.trim()).length
const countSyllables = (w: string) => {
  w = w.toLowerCase().replace(/[^a-z]/g, '')
  if (w.length <= 3) return 1
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '')
  const m = w.match(/[aeiouy]{1,2}/g)
  return m ? m.length : 1
}
const readingLevel = (words: number, sentences: number, syllables: number): string => {
  if (words === 0 || sentences === 0) return '—'
  const asl = words / sentences
  const asw = syllables / words
  const score = 206.835 - 1.015 * asl - 84.6 * asw
  if (score >= 90) return 'Very Easy (Grade 5)'
  if (score >= 80) return 'Easy (Grade 6)'
  if (score >= 70) return 'Fairly Easy (Grade 7)'
  if (score >= 60) return 'Standard (Grade 8–9)'
  if (score >= 50) return 'Fairly Difficult (Grade 10–12)'
  if (score >= 30) return 'Difficult (College)'
  return 'Very Difficult (Professional)'
}
const topKeywords = (text: string, n = 10): { word: string; count: number; pct: string }[] => {
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','i','you','he','she','it','we','they','this','that','these','those','my','your','his','her','its','our','their','not','no','nor','so','yet','as','if','then','than','also','just','more','some','can','all','been','its','into','up','out','about','after','before','over','under','again','further','once','very','too','also','both','each','few','more','most','other','some','such','other','own','same','than','too','very','just','because','while','although','though','since','unless','until','when','where','which','who','whom','whose','what','how','why'])
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []
  const freq: Record<string, number> = {}
  words.forEach(w => { if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1 })
  const total = Object.values(freq).reduce((a, b) => a + b, 0)
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count, pct: total > 0 ? ((count / total) * 100).toFixed(1) : '0' }))
}
const toTitleCase = (t: string) => t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
const toSentenceCase = (t: string) => t.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())

/* ─── Exam targets ─── */
const EXAM_TARGETS = [
  { label: 'Custom', value: 0 },
  { label: 'UPSC Essay (1000–1200 words)', value: 1200 },
  { label: 'UPSC GS Answer (150 words)', value: 150 },
  { label: 'UPSC GS Answer (250 words)', value: 250 },
  { label: 'SSC Essay (250 words)', value: 250 },
  { label: 'SSC Letter (150 words)', value: 150 },
  { label: 'APSC Essay (500 words)', value: 500 },
  { label: 'Cover Letter (400 words)', value: 400 },
  { label: 'Article / Blog (800 words)', value: 800 },
  { label: 'Twitter/X post (280 chars)', value: -280 },
]

/* ─── Sentence flow colours ─── */
const sentenceColor = (len: number) => {
  if (len <= 1) return '#6366f1'
  if (len <= 6) return '#0ea5e9'
  if (len <= 15) return '#22c55e'
  if (len <= 25) return '#f59e0b'
  if (len <= 39) return '#f97316'
  return '#ef4444'
}

export default function WordCounterClient() {
  const [text, setText] = useState('')
  const [targetPreset, setTargetPreset] = useState(0)
  const [customTarget, setCustomTarget] = useState('')
  const [activeTab, setActiveTab] = useState<'stats' | 'keywords' | 'flow' | 'tools'>('stats')
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [showFlow, setShowFlow] = useState(false)
  const [copied, setCopied] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const textRef = useRef<HTMLTextAreaElement>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  /* ─── derived stats ─── */
  const words = countWords(text)
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const sentences = countSentences(text)
  const paragraphs = countParagraphs(text)
  const lines = text === '' ? 0 : text.split('\n').length
  const uniqueWords = text.trim() === '' ? 0 : new Set(text.trim().toLowerCase().split(/\s+/)).size
  const avgWordLen = words > 0 ? (charsNoSpace / words).toFixed(1) : '0'
  const avgSentLen = sentences > 0 ? Math.round(words / sentences) : 0
  const allWords = text.toLowerCase().match(/\b[a-z]+\b/g) || []
  const syllables = allWords.reduce((acc: number, w: string) => acc + countSyllables(w), 0)
  const pages = words > 0 ? (words / 250).toFixed(1) : '0'
  const readTime = words > 0 ? `${Math.ceil(words / 238)} min` : '—'
  const speakTime = words > 0 ? `${Math.ceil(words / 130)} min` : '—'
  const handwriteTime = words > 0 ? `${Math.ceil(words / 20)} min` : '—'
  const level = readingLevel(words, sentences, syllables)
  const keywords = topKeywords(text)

  /* ─── target progress ─── */
  const isCharTarget = targetPreset < 0
  const targetVal = targetPreset === 0
    ? (customTarget ? Math.abs(Number(customTarget)) : 0)
    : Math.abs(targetPreset)
  const currentVal = isCharTarget ? chars : words
  const progress = targetVal > 0 ? Math.min(100, Math.round((currentVal / targetVal) * 100)) : 0
  const progressColor = progress < 70 ? '#1dbfad' : progress < 90 ? '#f59e0b' : progress <= 100 ? '#22c55e' : '#ef4444'

  /* ─── sentence flow highlight ─── */
  const flowHtml = useCallback(() => {
    if (!text.trim()) return ''
    const parts = text.split(/([.!?]+\s*)/)
    return parts.map((part, i) => {
      const wc = part.trim().split(/\s+/).filter(Boolean).length
      if (wc === 0) return `<span>${part}</span>`
      const col = sentenceColor(wc)
      return `<span style="background:${col}20;border-bottom:2px solid ${col};padding:1px 0;" title="${wc} words">${part}</span>`
    }).join('')
  }, [text])

  /* ─── find & replace ─── */
  const doReplace = () => {
    if (!findText) return
    const flags = caseSensitive ? 'g' : 'gi'
    setText(prev => prev.replace(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags), replaceText))
  }

  const findCount = findText
    ? (text.match(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), caseSensitive ? 'g' : 'gi')) || []).length
    : 0

  /* ─── case converter ─── */
  const convertCase = (type: string) => {
    switch (type) {
      case 'upper': setText(text.toUpperCase()); break
      case 'lower': setText(text.toLowerCase()); break
      case 'title': setText(toTitleCase(text)); break
      case 'sentence': setText(toSentenceCase(text)); break
      case 'alternate': setText(text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('')); break
    }
  }

  /* ─── clean text ─── */
  const cleanText = (type: string) => {
    switch (type) {
      case 'extra-spaces': setText(text.replace(/  +/g, ' ').replace(/\n{3,}/g, '\n\n').trim()); break
      case 'line-breaks': setText(text.replace(/\n+/g, ' ').trim()); break
      case 'trim-lines': setText(text.split('\n').map(l => l.trim()).join('\n')); break
      case 'remove-numbers': setText(text.replace(/\d+/g, '')); break
      case 'remove-punct': setText(text.replace(/[^\w\s]/g, '')); break
    }
  }

  /* ─── text to speech ─── */
  const toggleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    if (!text.trim()) return
    const u = new SpeechSynthesisUtterance(text)
    u.onend = () => setSpeaking(false)
    utteranceRef.current = u
    window.speechSynthesis.speak(u)
    setSpeaking(true)
  }

  /* ─── download ─── */
  const downloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'text.txt'; a.click()
  }
  const copyText = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  /* ─── auto-save ─── */
  useEffect(() => {
    const t = setTimeout(() => { if (text) localStorage.setItem('acpi_wordcounter', text) }, 1000)
    return () => clearTimeout(t)
  }, [text])
  useEffect(() => {
    const saved = localStorage.getItem('acpi_wordcounter')
    if (saved) setText(saved)
  }, [])

  const statCard = (label: string, value: string | number, sub?: string) => (
    <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
      <p className="text-2xl font-bold" style={{ color: '#0b1f33' }}>{value}</p>
      <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )

  const tabBtn = (id: typeof activeTab, label: string, emoji: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${activeTab === id ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
      style={activeTab === id ? { background: '#1dbfad' } : {}}
    >
      {emoji} {label}
    </button>
  )

  const inputClass = 'w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition bg-white'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5'

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0b1f33 0%, #1a3a5c 100%)' }} className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/tools" className="text-sm text-gray-400 hover:text-white mb-3 inline-block">← Back to Tools</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Word Counter</h1>
          <p className="text-gray-300 text-lg">Count words, characters, sentences, reading time and more. Includes exam word limit checker, keyword density, sentence flow analysis, case converter and find & replace.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* ── LEFT: Editor (2 cols) ── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Word limit target bar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className={labelClass}>📏 Word / Character Target</label>
                  <select
                    className={inputClass}
                    value={targetPreset}
                    onChange={e => setTargetPreset(Number(e.target.value))}
                  >
                    {EXAM_TARGETS.map(t => <option key={t.label} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                {targetPreset === 0 && (
                  <div className="w-44">
                    <label className={labelClass}>Custom Limit</label>
                    <input className={inputClass} value={customTarget} onChange={e => setCustomTarget(e.target.value)} placeholder="e.g. 500" type="number" min="1" />
                  </div>
                )}
              </div>
              {targetVal > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">{currentVal.toLocaleString()} / {targetVal.toLocaleString()} {isCharTarget ? 'characters' : 'words'}</span>
                    <span className="font-bold" style={{ color: progressColor }}>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: progressColor }} />
                  </div>
                  {progress > 100 && (
                    <p className="text-xs text-red-500 mt-1.5">⚠ Exceeded by {currentVal - targetVal} {isCharTarget ? 'characters' : 'words'}</p>
                  )}
                  {progress >= 90 && progress <= 100 && (
                    <p className="text-xs text-green-600 mt-1.5">✓ Within target range — good to go!</p>
                  )}
                </div>
              )}
            </div>

            {/* Editor */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
                <button onClick={() => setText('')} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition">Clear</button>
                <button onClick={copyText} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition">{copied ? '✓ Copied' : '📋 Copy'}</button>
                <button onClick={downloadTxt} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 transition">⬇ .txt</button>
                <button
                  onClick={toggleSpeak}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition"
                  style={speaking ? { background: '#fef2f2', borderColor: '#fca5a5', color: '#ef4444' } : { background: 'white', borderColor: '#d1d5db', color: '#4b5563' }}
                >
                  {speaking ? '⏹ Stop' : '🔊 Read Aloud'}
                </button>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ background: '#1dbfad20', color: '#0f6e56' }}>
                    {words.toLocaleString()} words
                  </span>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600">
                    {chars.toLocaleString()} chars
                  </span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                ref={textRef}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Start typing or paste your text here…&#10;&#10;Your stats will update in real time. Use the tabs below to see keyword density, sentence flow analysis, and more tools."
                className="w-full p-5 text-base leading-relaxed resize-none focus:outline-none"
                style={{ minHeight: '320px', fontFamily: 'inherit', color: '#0b1f33' }}
              />
            </div>

            {/* Sentence flow view */}
            {showFlow && text.trim() && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800">Sentence Flow Highlight</h3>
                  <button onClick={() => setShowFlow(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕ Close</button>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-3">
                  {[
                    { col: '#6366f1', label: '1 word' }, { col: '#0ea5e9', label: '2–6 words' }, { col: '#22c55e', label: '7–15 words' },
                    { col: '#f59e0b', label: '16–25 words' }, { col: '#f97316', label: '26–39 words' }, { col: '#ef4444', label: '40+ words' },
                  ].map(({ col, label }) => (
                    <span key={label} className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-sm inline-block" style={{ background: col }}></span>
                      <span className="text-gray-500">{label}</span>
                    </span>
                  ))}
                </div>
                <div
                  className="text-base leading-8 text-gray-800"
                  dangerouslySetInnerHTML={{ __html: flowHtml() }}
                />
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex gap-1 p-2 overflow-x-auto border-b border-gray-100 bg-gray-50">
                {tabBtn('stats', 'Detailed Stats', '📊')}
                {tabBtn('keywords', 'Keywords', '🔑')}
                {tabBtn('flow', 'Flow Analysis', '📈')}
                {tabBtn('tools', 'Text Tools', '🛠')}
              </div>

              <div className="p-5">
                {/* STATS TAB */}
                {activeTab === 'stats' && (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                      {statCard('Words', words.toLocaleString())}
                      {statCard('Characters', chars.toLocaleString())}
                      {statCard('Chars (no spaces)', charsNoSpace.toLocaleString())}
                      {statCard('Sentences', sentences.toLocaleString())}
                      {statCard('Paragraphs', paragraphs.toLocaleString())}
                      {statCard('Lines', lines.toLocaleString())}
                      {statCard('Unique Words', uniqueWords.toLocaleString())}
                      {statCard('Syllables', syllables.toLocaleString())}
                      {statCard('Pages', pages, '~250 words/page')}
                      {statCard('Avg. Word Length', avgWordLen, 'characters')}
                      {statCard('Avg. Sentence', avgSentLen, 'words')}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="rounded-xl p-4 text-center" style={{ background: '#E1F5EE' }}>
                        <p className="text-xl font-bold" style={{ color: '#0F6E56' }}>{readTime}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: '#1D9E75' }}>Reading Time</p>
                        <p className="text-xs mt-0.5" style={{ color: '#1D9E75' }}>~238 wpm</p>
                      </div>
                      <div className="rounded-xl p-4 text-center" style={{ background: '#E6F1FB' }}>
                        <p className="text-xl font-bold" style={{ color: '#185FA5' }}>{speakTime}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: '#378ADD' }}>Speaking Time</p>
                        <p className="text-xs mt-0.5" style={{ color: '#378ADD' }}>~130 wpm</p>
                      </div>
                      <div className="rounded-xl p-4 text-center" style={{ background: '#FAEEDA' }}>
                        <p className="text-xl font-bold" style={{ color: '#854F0B' }}>{handwriteTime}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: '#BA7517' }}>Handwriting Time</p>
                        <p className="text-xs mt-0.5" style={{ color: '#BA7517' }}>~20 wpm</p>
                      </div>
                      <div className="rounded-xl p-4 text-center" style={{ background: '#EEEDFE' }}>
                        <p className="text-base font-bold leading-tight" style={{ color: '#534AB7' }}>{level}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: '#7F77DD' }}>Reading Level</p>
                        <p className="text-xs mt-0.5" style={{ color: '#7F77DD' }}>Flesch-Kincaid</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* KEYWORDS TAB */}
                {activeTab === 'keywords' && (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">Top keywords in your text (stop words excluded). Useful to check keyword balance in articles and essays.</p>
                    {keywords.length === 0 ? (
                      <p className="text-gray-400 text-sm italic">Start typing to see keyword analysis…</p>
                    ) : (
                      <div className="space-y-2">
                        {keywords.map(k => (
                          <div key={k.word} className="flex items-center gap-3">
                            <span className="w-28 text-sm font-semibold text-gray-700 truncate">{k.word}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                              <div
                                className="h-5 rounded-full flex items-center pl-2 text-xs font-semibold text-white transition-all"
                                style={{ width: `${Math.max(8, Number(k.pct) * 4)}%`, background: '#1dbfad', minWidth: 32 }}
                              >
                                {k.count}×
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 w-12 text-right">{k.pct}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* FLOW TAB */}
                {activeTab === 'flow' && (
                  <div>
                    <p className="text-sm text-gray-500 mb-4">Sentence length variety makes writing more engaging. Aim for a mix of short and medium sentences.</p>
                    {text.trim() === '' ? (
                      <p className="text-gray-400 text-sm italic">Start typing to see flow analysis…</p>
                    ) : (() => {
                      const sentList = text.match(/[^.!?]+[.!?]+/g) || text.split('\n').filter(Boolean)
                      const buckets = { vshort: 0, short: 0, medium: 0, long: 0, vlong: 0, huge: 0 }
                      sentList.forEach(s => {
                        const wc = s.trim().split(/\s+/).length
                        if (wc <= 1) buckets.vshort++
                        else if (wc <= 6) buckets.short++
                        else if (wc <= 15) buckets.medium++
                        else if (wc <= 25) buckets.long++
                        else if (wc <= 39) buckets.vlong++
                        else buckets.huge++
                      })
                      const total = sentList.length
                      const rows = [
                        { label: 'Impact (1 word)', key: 'vshort', col: '#6366f1', tip: 'Dramatic emphasis' },
                        { label: 'Staccato (2–6 words)', key: 'short', col: '#0ea5e9', tip: 'Punchy & direct' },
                        { label: 'Standard (7–15 words)', key: 'medium', col: '#22c55e', tip: '✓ Sweet spot — aim for most here' },
                        { label: 'Complex (16–25 words)', key: 'long', col: '#f59e0b', tip: 'Good for connecting ideas' },
                        { label: 'Long (26–39 words)', key: 'vlong', col: '#f97316', tip: 'Use sparingly' },
                        { label: 'Very Long (40+ words)', key: 'huge', col: '#ef4444', tip: '⚠ May lose reader attention' },
                      ] as const
                      return (
                        <>
                          <div className="space-y-3 mb-5">
                            {rows.map(r => {
                              const cnt = buckets[r.key as keyof typeof buckets]
                              const pct = total > 0 ? Math.round((cnt / total) * 100) : 0
                              return (
                                <div key={r.key} className="flex items-center gap-3">
                                  <span className="w-36 text-xs font-semibold text-gray-600 flex-shrink-0">{r.label}</span>
                                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                                    <div className="h-5 rounded-full transition-all" style={{ width: `${pct}%`, background: r.col, minWidth: cnt > 0 ? 24 : 0 }} />
                                  </div>
                                  <span className="text-sm font-bold w-8 text-right" style={{ color: r.col }}>{cnt}</span>
                                  <span className="text-xs text-gray-400 w-8">{pct}%</span>
                                </div>
                              )
                            })}
                          </div>
                          <button
                            onClick={() => { setShowFlow(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                            className="text-sm font-semibold py-2.5 px-5 rounded-xl transition-all hover:opacity-90 text-white"
                            style={{ background: '#1dbfad' }}
                          >
                            View Colour-Highlighted Text ↑
                          </button>
                        </>
                      )
                    })()}
                  </div>
                )}

                {/* TOOLS TAB */}
                {activeTab === 'tools' && (
                  <div className="space-y-6">

                    {/* Case Converter */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 mb-3">🔤 Case Converter</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          ['sentence', 'Sentence case'],
                          ['title', 'Title Case'],
                          ['upper', 'UPPERCASE'],
                          ['lower', 'lowercase'],
                          ['alternate', 'aLtErNaTe'],
                        ].map(([type, label]) => (
                          <button key={type} onClick={() => convertCase(type)} className="text-sm font-semibold py-2 px-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-gray-700 transition-all">
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Find & Replace */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 mb-3">🔍 Find & Replace</h3>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 block mb-1">Find {findText && findCount > 0 && <span className="text-teal-600">({findCount} found)</span>}</label>
                          <input className={inputClass} value={findText} onChange={e => setFindText(e.target.value)} placeholder="Search text…" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 block mb-1">Replace with</label>
                          <input className={inputClass} value={replaceText} onChange={e => setReplaceText(e.target.value)} placeholder="Replace with…" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={doReplace} disabled={!findText} className="text-sm font-bold py-2.5 px-5 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40" style={{ background: '#1dbfad' }}>
                          Replace All
                        </button>
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input type="checkbox" checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} className="accent-teal-500" />
                          Case sensitive
                        </label>
                      </div>
                    </div>

                    {/* Text Cleaner */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 mb-3">🧹 Clean Text</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          ['extra-spaces', 'Remove Extra Spaces'],
                          ['trim-lines', 'Trim Line Spaces'],
                          ['line-breaks', 'Remove Line Breaks'],
                          ['remove-numbers', 'Remove Numbers'],
                          ['remove-punct', 'Remove Punctuation'],
                        ].map(([type, label]) => (
                          <button key={type} onClick={() => cleanText(type)} className="text-sm font-semibold py-2 px-4 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-gray-700 transition-all">
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Export */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-700 mb-3">📥 Export</h3>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={downloadTxt} className="text-sm font-semibold py-2.5 px-5 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-gray-700 transition-all">⬇ Download as .TXT</button>
                        <button onClick={copyText} className="text-sm font-semibold py-2.5 px-5 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 text-gray-700 transition-all">{copied ? '✓ Copied!' : '📋 Copy All'}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Quick Stats Sidebar ── */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm sticky top-6">
              <h2 className="text-base font-bold text-gray-800 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                {[
                  { label: 'Words', val: words.toLocaleString(), col: '#1dbfad' },
                  { label: 'Characters', val: chars.toLocaleString(), col: '#378ADD' },
                  { label: 'Sentences', val: sentences.toLocaleString(), col: '#534AB7' },
                  { label: 'Paragraphs', val: paragraphs.toLocaleString(), col: '#f59e0b' },
                  { label: 'Unique Words', val: uniqueWords.toLocaleString(), col: '#22c55e' },
                  { label: 'Pages (~250 w)', val: pages, col: '#f97316' },
                  { label: 'Reading Time', val: readTime, col: '#ec4899' },
                  { label: 'Speaking Time', val: speakTime, col: '#8b5cf6' },
                  { label: 'Handwriting', val: handwriteTime, col: '#6366f1' },
                  { label: 'Reading Level', val: level.split('(')[0].trim(), col: '#0b1f33' },
                ].map(({ label, val, col }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-bold" style={{ color: col }}>{val}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Exam Quick Reference</p>
                <div className="space-y-1.5 text-xs text-gray-500">
                  {[
                    ['UPSC GS Answer', '150–250 words'],
                    ['UPSC Essay', '1000–1200 words'],
                    ['SSC Descriptive', '200–250 words'],
                    ['APSC Essay', '~500 words'],
                    ['Cover Letter', '300–400 words'],
                  ].map(([exam, limit]) => (
                    <div key={exam} className="flex justify-between">
                      <span>{exam}</span>
                      <span className="font-semibold" style={{ color: '#1dbfad' }}>{limit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4">💾 Your text is auto-saved in browser</p>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-5" style={{ color: '#0b1f33' }}>What Makes This Word Counter Different?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-800 text-base mb-2">📏 Exam Word Limit Checker</h3>
              <p>Set a target word count for UPSC essays (1000–1200 words), SSC descriptive answers (250 words), APSC essays (500 words) or any custom limit. A live progress bar shows you how close you are.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base mb-2">📈 Sentence Flow Analysis</h3>
              <p>See a breakdown of your sentence lengths with colour-coded highlights. Mix short punchy sentences with longer ones for better readability — important for essay writing in competitive exams.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base mb-2">🔑 Keyword Density</h3>
              <p>Instantly see which words you use most and at what frequency. Helpful for article writers and bloggers to maintain keyword balance without over-stuffing.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base mb-2">⏱ Time Estimates</h3>
              <p>Get reading time, speaking time and handwriting time estimates — especially useful for competitive exam preparation where you need to manage answer writing speed.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base mb-2">🛠 Built-in Text Tools</h3>
              <p>Case converter (UPPERCASE, title case, sentence case), find & replace with case sensitivity toggle, and text cleaner to remove extra spaces, line breaks or punctuation.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base mb-2">🔊 Read Aloud</h3>
              <p>Listen to your text being read using browser text-to-speech. Useful to catch awkward sentences and grammar issues when proofreading your essays and answers.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
