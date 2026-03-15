const bcrypt = require('bcryptjs')
const fs = require('fs')

// Read the standalone .env.local
const env = fs.readFileSync('.next/standalone/.env.local', 'utf8')
console.log('=== ENV FILE CONTENTS ===')
console.log(env)

// Parse it
const lines = env.split('\n')
const vars = {}
lines.forEach(line => {
  const [key, ...rest] = line.split('=')
  vars[key] = rest.join('=')
})

const hash = vars['ADMIN_PASSWORD_HASH']
const user = vars['ADMIN_USERNAME']
const password = 'Assam@2026#Portal!'

console.log('=== DEBUG ===')
console.log('Username in file:', user)
console.log('Hash in file:', hash)
console.log('Hash starts with $2b:', hash?.startsWith('$2b'))
console.log('Hash length:', hash?.length)

bcrypt.compare(password, hash).then(result => {
  console.log('=== RESULT ===')
  console.log('Password match:', result)
  if (result) {
    console.log('✅ Login SHOULD work - problem is elsewhere')
  } else {
    console.log('❌ bcrypt compare FAILED - hash is wrong')
  }
})
