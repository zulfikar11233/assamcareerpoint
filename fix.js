const fs = require('fs')

const content = [
  'NEXTAUTH_URL=http://localhost:3000',
  'NEXTAUTH_SECRET=z4WogtSl0H5s+xaaJaL9QxeQDxJrVh0ygS+bKYwi+Ck=',
  'ADMIN_USERNAME=acpi_admin',
  'ADMIN_PASSWORD_HASH=$2b$12$5SizkMx6rK1WJwfR1Ee8f.4LVEUlMnqaQqboirxwnG5A.QhykMOXG',
  'NODE_ENV=production',
].join('\n')

fs.writeFileSync('.next/standalone/.env.local', content)
console.log('Done! Check:')
console.log(fs.readFileSync('.next/standalone/.env.local', 'utf8'))
```

---

## Then in your terminal run:
```
node fix.js