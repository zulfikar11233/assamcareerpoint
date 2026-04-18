#!/usr/bin/env node
// scripts/copy-tinymce.mjs
// Run after: npm install @tinymce/tinymce-react tinymce
// This copies TinyMCE assets to /public/tinymce/ for self-hosted use (no API key needed)

import { cpSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = join(__dirname, '..')
const src       = join(root, 'node_modules', 'tinymce')
const dest      = join(root, 'public', 'tinymce')

if (!existsSync(src)) {
  console.error('❌ tinymce not found in node_modules. Run: npm install tinymce')
  process.exit(1)
}

mkdirSync(dest, { recursive: true })

const folders = ['skins', 'themes', 'icons', 'plugins', 'models']
for (const folder of folders) {
  const s = join(src, folder)
  const d = join(dest, folder)
  if (existsSync(s)) {
    cpSync(s, d, { recursive: true })
    console.log(`✅ Copied ${folder}`)
  }
}

// Copy main tinymce.min.js
cpSync(join(src, 'tinymce.min.js'), join(dest, 'tinymce.min.js'))
console.log('✅ Copied tinymce.min.js')
console.log('\n🎉 TinyMCE self-hosted assets ready in /public/tinymce/')
console.log('   No API key needed. Works on Hostinger deployment.')
