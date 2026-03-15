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
        clientIp: { label: 'IP',       type: 'text'     },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const ip = credentials.clientIp || 'unknown'

        // ── DEBUG ──
        console.log('=== LOGIN ATTEMPT ===')
        console.log('Username received:', credentials.username)
        console.log('Expected username:', process.env.ADMIN_USERNAME || 'acpi_admin')
        console.log('Hash from env:', process.env.ADMIN_PASSWORD_HASH ? 'EXISTS len=' + process.env.ADMIN_PASSWORD_HASH.length : 'MISSING')

        const { allowed } = checkRateLimit(ip)
        if (!allowed) throw new Error('RATE_LIMIT')

        const isCorrectUser =
          credentials.username.trim() === (process.env.ADMIN_USERNAME || 'acpi_admin').trim()

        const hashToCheck = (
  (process.env.ADMIN_PASSWORD_HASH || '').trim().replace(/\\\$/g, '$')
) || '$2b$12$5SizkMx6rK1WJwfR1Ee8f.4LVEUlMnqaQqboirxwnG5A.QhykMOXG'

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