import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const attempts = new Map<string, { count: number; firstAttempt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

function checkRateLimit(ip: string): { allowed: boolean } {
  const now  = Date.now()
  const data = attempts.get(ip)
  if (!data || now - data.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: now })
    return { allowed: true }
  }
  if (data.count >= MAX_ATTEMPTS) return { allowed: false }
  data.count++
  attempts.set(ip, data)
  return { allowed: true }
}

function resetRateLimit(ip: string) {
  attempts.delete(ip)
}

function getClientIp(req?: { headers?: Record<string, string | string[] | undefined> }): string {
  const headers = req?.headers
  if (!headers) return 'unknown'
  const realIp = headers['x-real-ip']
  if (typeof realIp === 'string' && realIp) return realIp
  const forwarded = headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded) {
    const ips = forwarded.split(',').map(s => s.trim())
    return ips[ips.length - 1] || 'unknown'  // last entry = closest to your server, hardest to fake
  }
  return 'unknown'
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  pages: { signIn: '/admin/login', error: '/admin/login' },

  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        username: { label: 'Username', type: 'text'     },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null

        const ip = getClientIp(req as { headers?: Record<string, string | string[] | undefined> })

        // ── DEBUG ──
        console.log('=== LOGIN ATTEMPT ===')
        console.log('Username received:', credentials.username)
        console.log('Expected username:', process.env.ADMIN_USERNAME || 'acpi_admin')
        console.log('Hash from env:', process.env.ADMIN_PASSWORD_HASH ? 'EXISTS len=' + process.env.ADMIN_PASSWORD_HASH.length : 'MISSING')

        const { allowed } = checkRateLimit(ip)
        if (!allowed) throw new Error('RATE_LIMIT')

        const isCorrectUser =
          credentials.username.trim() === (process.env.ADMIN_USERNAME || 'acpi_admin').trim()

        const rawHash = process.env.ADMIN_PASSWORD_HASH
if (!rawHash) {
  console.error('ADMIN_PASSWORD_HASH is not set — refusing all logins.')
  return null
}
const hashToCheck = rawHash.trim().replace(/\\\$/g, '$')

        console.log('Hash length used:', hashToCheck.length)
        console.log('Hash starts with:', hashToCheck.substring(0, 10))

        const isCorrectPass = await bcrypt.compare(credentials.password, hashToCheck)

        console.log('Username match:', isCorrectUser)
        console.log('Password match:', isCorrectPass)

        if (!isCorrectUser || !isCorrectPass) return null

        resetRateLimit(ip)
        return { id: '1', name: 'Admin', email: process.env.ADMIN_USERNAME }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = 'admin'
      return token
    },
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
