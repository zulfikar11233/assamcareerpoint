import type { Metadata } from 'next'
import ImageResizerClient from './ImageResizerClient'

export const metadata: Metadata = {
  title: 'Free Photo Resizer – ADRE, APSC, SLPRB, Passport Size | Assam Career Point',
  description:
    'Resize photos online for government job applications. Presets for ADRE, APSC, SLPRB, DHS, Assam Police, SSC, Railway, Bank and Passport size. Compress to target KB, change background color, crop and rotate. Free, private, browser-based.',
  keywords:
    'ADRE photo resize, APSC photo size, SLPRB photo resize, passport size photo online, government job photo resize Assam, compress photo to 50kb, image resizer online free India',
  openGraph: {
    title: 'Free Photo Resizer for Government Job Applications | Assam Career Point',
    description:
      'Resize photos to exact sizes required for ADRE, APSC, SLPRB, SSC, Railway, Bank exams. Includes compression, background color and crop tools.',
    url: 'https://assamcareerpoint-info.com/tools/image-resizer',
  },
}

export default function ImageResizerPage() {
  return <ImageResizerClient />
}
