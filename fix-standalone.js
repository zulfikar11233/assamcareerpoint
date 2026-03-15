const fs = require('fs')
const path = require('path')

// ── Copy these packages to standalone ──────────────────────────
const packages = [
  'bcryptjs', 'next-auth', '@auth/core',
  'oauth', 'openid-client', 'jose', 'uuid', 'cookie',
]

packages.forEach(pkg => {
  const src = path.join('node_modules', pkg)
  const dst = path.join('.next', 'standalone', 'node_modules', pkg)
  if (fs.existsSync(src)) {
    fs.cpSync(src, dst, { recursive: true })
    console.log(`✅ ${pkg} copied`)
  } else {
    console.log(`⚠️  ${pkg} not found — skipping`)
  }
})

// ── Only copy .env.local if it exists (local dev only) ─────────
const envFile = '.env.local'
if (fs.existsSync(envFile)) {
  const original = fs.readFileSync(envFile, 'utf8')
  const fixed = original.replace(/\\\$/g, '$')
  fs.writeFileSync('.next/standalone/.env.local', fixed)
  console.log('✅ .env.local written with real $ signs')
} else {
  console.log('ℹ️  No .env.local found — skipping (Hostinger uses panel env vars)')
}
