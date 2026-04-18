import type { Metadata } from 'next'
import AgeCalculatorClient from './AgeCalculatorClient'

export const metadata: Metadata = {
  title: 'Free Age Calculator for Government Job – Check Eligibility | Assam Career Point',
  description:
    'Calculate your exact age for government job applications. Check if you are eligible for ADRE, APSC, SLPRB, SSC, Railway and other exams based on age cut-off dates. Includes OBC/SC/ST age relaxation calculator for Assam state jobs.',
  keywords:
    'age calculator government job Assam, ADRE age limit check, APSC age eligibility, age calculator with relaxation OBC SC ST, government exam age cut-off, born date age calculator India, age calculator for competitive exam',
  openGraph: {
    title: 'Free Age Calculator for Government Job Eligibility | Assam Career Point',
    description:
      'Calculate your exact age and check eligibility for ADRE, APSC, SSC, Railway and other exams. Includes OBC/SC/ST age relaxation for Assam.',
    url: 'https://assamcareerpoint-info.com/tools/age-calculator',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://www.assamcareerpoint-info.com/tools/age-calculator',
  },
}

export default function AgeCalculatorPage() {
  return <AgeCalculatorClient />
}