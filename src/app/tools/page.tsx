import type { Metadata } from 'next'
import ToolsHubClient from './ToolsHubClient'

export const metadata: Metadata = {
  title: 'Free Online Tools for Government Job Seekers | Assam Career Point',
  description:
    'Free online tools for Assam government job applicants – Photo Resizer, UPI QR Generator, Images to PDF, Bio-Data Maker, Word Counter and Age Calculator with exam eligibility checker. All browser-based, 100% private.',
  keywords:
    'free tools assam government job, photo resize ADRE APSC, UPI QR code generator India, images to PDF converter, bio data maker assam government job, age calculator exam eligibility OBC SC ST, word counter essay UPSC SSC, passport size photo resize online, image resize online free',
  openGraph: {
    title: 'Free Online Tools for Government Job Seekers | Assam Career Point',
    description: '6 free tools: resize photos, check exam eligibility, count words, generate UPI QR, convert images to PDF and create bio-data.',
    url: 'https://assamcareerpoint-info.com/tools',
  },
}

export default function ToolsHubPage() {
  return <ToolsHubClient />
}
