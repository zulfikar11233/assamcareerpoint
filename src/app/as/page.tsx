// src/app/as/page.tsx
// Redirect /as to homepage — fixes Google 404
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AsPage() {
  redirect('/')
}