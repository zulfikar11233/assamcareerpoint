// src/app/results/page.tsx 
import { getPublishedResults, RESULT_CATEGORIES, ResultPost } from '@/lib/results-db'
import type { Metadata } from 'next'
import ResultsClient from './ResultsClient'

export const metadata: Metadata = {
  title: 'Exam Results, Merit Lists & Answer Keys – Assam | Assam Career Point',
  description: 'Latest government exam results, merit lists, answer keys and cut-off marks for APSC, Assam Police, SSC, Railway, Banking and other recruitments in Assam & Northeast India.',
  alternates: {
    canonical: 'https://www.assamcareerpoint-info.com/results',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function ResultsPage() {
  // Fetch data server-side
  let posts: ResultPost[] = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.assamcareerpoint-info.com'}/api/data/results`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length) posts = data
      else posts = getPublishedResults()
    } else {
      posts = getPublishedResults()
    }
  } catch {
    posts = getPublishedResults()
  }

  return <ResultsClient initialPosts={posts} />
}