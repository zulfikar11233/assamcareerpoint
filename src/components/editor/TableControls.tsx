'use client'
import type { Editor } from '@tiptap/react'

export default function TableControls({ editor }: { editor: Editor }) {
  const action = (fn: () => boolean) => () => fn()
  return <details style={{ position: 'relative' }}><summary style={{ cursor: 'pointer' }}>Table ▾</summary><span style={{ position: 'absolute', zIndex: 10, top: 'calc(100% + 4px)', left: 0, display: 'flex', gap: 4, flexWrap: 'wrap', width: 320, padding: 8, border: '1px solid var(--border,#d4e0ec)', borderRadius: 6, background: 'var(--card-bg,#fff)' }}>
    <button type="button" onClick={e => { const d = e.currentTarget.closest('details') as HTMLDetailsElement | null; if (d) d.open = false }} style={{ fontWeight: 700 }}>✕ Close</button>
    <span style={{ width: '100%' }} />
    <button type="button" onClick={action(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}>Insert table</button>
    <button type="button" onClick={action(() => editor.chain().focus().addRowBefore().run())}>Row ↑</button><button type="button" onClick={action(() => editor.chain().focus().addRowAfter().run())}>Row ↓</button><button type="button" onClick={action(() => editor.chain().focus().deleteRow().run())}>Delete row</button>
    <button type="button" onClick={action(() => editor.chain().focus().addColumnBefore().run())}>Col ←</button><button type="button" onClick={action(() => editor.chain().focus().addColumnAfter().run())}>Col →</button><button type="button" onClick={action(() => editor.chain().focus().deleteColumn().run())}>Delete col</button>
    <button type="button" onClick={action(() => editor.chain().focus().mergeCells().run())}>Merge</button><button type="button" title="Undoes a previous Merge — cannot split a normal cell into new pieces" onClick={action(() => editor.chain().focus().splitCell().run())}>Split (undo merge)</button>
    <button type="button" onClick={action(() => editor.chain().focus().toggleHeaderRow().run())}>Header row</button><button type="button" onClick={action(() => editor.chain().focus().toggleHeaderColumn().run())}>Header col</button>
    <span style={{ width: '100%', fontWeight: 700, fontSize: '.72rem', marginTop: 6, color: '#5a6a7a' }}>Cell Style (click inside a cell first)</span>
    <label style={{ fontSize: '.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>Border color <input type="color" title="Border color" defaultValue="#d4e0ec" onChange={e => editor.chain().focus().setCellAttribute('borderColor', e.target.value).run()} /></label>
    <select title="Border width" defaultValue="" onChange={e => { if (e.target.value) editor.chain().focus().setCellAttribute('borderWidth', e.target.value).run() }}>
      <option value="">Width</option>
      {['1px','2px','3px','4px','5px','6px','7px','8px','9px','10px'].map(w => <option key={w} value={w}>{w}</option>)}
    </select>
    <select title="Border style" defaultValue="" onChange={e => { if (e.target.value) editor.chain().focus().setCellAttribute('borderStyle', e.target.value).run() }}>
      <option value="">Style</option>
      <option value="solid">Solid</option>
      <option value="dashed">Dashed</option>
      <option value="dotted">Dotted</option>
      <option value="double">Double</option>
    </select>
    <label style={{ fontSize: '.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>Background <input type="color" title="Background color" defaultValue="#ffffff" onChange={e => editor.chain().focus().setCellAttribute('backgroundColor', e.target.value).run()} /></label>
    <button type="button" onClick={action(() => editor.chain().focus().setCellAttribute('borderColor', null).setCellAttribute('borderWidth', null).setCellAttribute('borderStyle', null).setCellAttribute('backgroundColor', null).run())}>Reset cell style</button>
  </span></details>
}