import type { Metadata } from 'next'
import WordCounterClient from './WordCounterClient'

export const metadata: Metadata = {
  title: 'Free Word Counter – Count Words, Characters, Sentences & More | Assam Career Point',
  description:
    'Free online word counter tool. Count words, characters, sentences, paragraphs, reading time, speaking time and keyword density. Includes exam word limit checker, case converter, find & replace, text cleaner and more advanced features.',
  keywords:
    'word counter online free, character counter, count words online, essay word count, word counter for exam Assam, UPSC essay word limit, SSC word counter, reading time calculator, keyword density checker',
  openGraph: {
    title: 'Free Word Counter with Advanced Features | Assam Career Point',
    description:
      'Count words, characters, sentences, reading time and keyword density. Includes exam word limit checker, case converter, find & replace and more.',
    url: 'https://assamcareerpoint-info.com/tools/word-counter',
  },
}

export default function WordCounterPage() {
  return <WordCounterClient />
}
