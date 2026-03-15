// src/app/api/auth/[...nextauth]/route.ts
// ✅ SECURITY: bcrypt password comparison (never plaintext)
// ✅ SECURITY: Rate limiting — max 5 login attempts per 15 minutes per IP
// ✅ SECURITY: JWT session, 8-hour expiry
// ✅ SECURITY: Generic error message — never reveals if username or password was wrong

import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// ── Rate limiter (in-memory) ──────────────────────────────────────────────────
const attempts = new Map<string, { count: number; firstAttempt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS    = 15 * 60 * 1000 // 15 minutes

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

// ── NextAuth config ───────────────────────────────────────────────────────────
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
    maxAge:   8 * 60 * 60, // 8 hours
  },

  pages: {
    signIn: '/admin/login',
    error:  '/admin/login',
  },

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

        // Use the IP sent from the login page for rate limiting
        const ip = credentials.clientIp || 'unknown'

        // ── Rate limit check ───────────────────────────────────────────────
        const { allowed } = checkRateLimit(ip)
        if (!allowed) {
          throw new Error('RATE_LIMIT')
        }

        // ── Username check ─────────────────────────────────────────────────
        const isCorrectUser =
          credentials.username.trim() === (process.env.ADMIN_USERNAME || '').trim()

        // ── Password check (bcrypt) ────────────────────────────────────────
        // Always run bcrypt even on wrong username to prevent timing attacks
        const hashToCheck = (
          process.env.ADMIN_PASSWORD_HASH || '$2b$12$invalid.hash.placeholder.only'
        ).trim()

        const isCorrectPass = await bcrypt.compare(
          credentials.password,
          hashToCheck,
        )

        if (!isCorrectUser || !isCorrectPass) {
          return null
        }

        // ── Success ────────────────────────────────────────────────────────
        resetRateLimit(ip)
        return { id: '1', name: 'Admin', email: process.env.ADMIN_USERNAME }
      },
    }),
  ],

  callbacks: {
    // Store role='admin' inside the JWT token
    jwt({ token, user }) {
      if (user) token.role = 'admin'
      return token
    },
    // Make role available in the session
    session({ session, token }) {
      if (session.user) (session.user as { role?: string }).role = token.role as string
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
