import type { Metadata } from 'next'
import BioDataClient from './BioDataClient'

export const metadata: Metadata = {
  title: 'Free Bio-Data Maker for Government Jobs – Download PDF | Assam Career Point',
  description:
    'Create a professional bio-data for government job applications in Assam. Includes Assam-specific fields like Employment Exchange Registration Number, PRC, Category, District and more. Download as PDF instantly. Free, private, no login required.',
  keywords:
    'bio data maker for government job Assam, resume maker free India, bio data format Assam, employment exchange registration bio data, government job CV maker, APSC bio data, ADRE application form maker',
  openGraph: {
    title: 'Free Bio-Data Maker for Assam Government Jobs | Assam Career Point',
    description:
      'Build a complete government-format bio-data with Assam-specific fields. Download as PDF instantly. Free and private.',
    url: 'https://assamcareerpoint-info.com/tools/bio-data-maker',
  },
}

export default function BioDataPage() {
  return <BioDataClient />
}
