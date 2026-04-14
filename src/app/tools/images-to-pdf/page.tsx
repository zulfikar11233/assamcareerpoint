import type { Metadata } from 'next'
import ImagesToPdfClient from './ImagesToPdfClient'

export const metadata: Metadata = {
  title: 'Free Images to PDF Converter – Convert Photos to PDF Online | Assam Career Point',
  description:
    'Convert multiple images and photos into a single PDF file online. Compress, reorder, rotate pages, set A4/Letter size, add page numbers and password-protect your PDF. Free, private, 100% browser-based.',
  keywords:
    'images to PDF converter free, convert photos to PDF online, compress PDF India, A4 PDF maker, certificate to PDF online, government job document PDF, image to PDF Assam',
  openGraph: {
    title: 'Free Images to PDF Converter | Assam Career Point Tools',
    description:
      'Convert photos and scanned certificates to PDF. Compress, reorder, rotate and password-protect. Free, private, browser-based.',
    url: 'https://assamcareerpoint-info.com/tools/images-to-pdf',
  },
}

export default function ImagesToPdfPage() {
  return <ImagesToPdfClient />
}
