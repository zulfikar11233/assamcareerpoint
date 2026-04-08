'use client'
// src/components/Providers.tsx
// Wraps the app with NextAuth SessionProvider so useSession() works everywhere
import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}