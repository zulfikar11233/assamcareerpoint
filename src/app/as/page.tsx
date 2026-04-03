// src/app/as/page.tsx
// Redirect /as to homepage — fixes Google 404
import { redirect } from 'next/navigation'
export default function AsPage() {
  redirect('/')
}