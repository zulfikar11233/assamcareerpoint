import type { Metadata } from 'next'
import UpiQrClient from './UpiQrClient'

export const metadata: Metadata = {
  title: 'Free UPI QR Code Generator – GPay, PhonePe, Paytm | Assam Career Point',
  description:
    'Generate UPI payment QR codes instantly. Enter your UPI ID or bank account details to create a scannable QR code compatible with GPay, PhonePe, Paytm, BHIM and all UPI apps. Free, private, works offline.',
  keywords:
    'UPI QR code generator free, GPay QR code, PhonePe QR code, UPI ID QR generator Assam, BHIM QR code, payment QR code maker India',
  openGraph: {
    title: 'Free UPI QR Code Generator | Assam Career Point Tools',
    description:
      'Create UPI payment QR codes for GPay, PhonePe, Paytm, BHIM — free, instant, works in browser.',
    url: 'https://assamcareerpoint-info.com/tools/upi-qr-generator',
  },
}

export default function UpiQrPage() {
  return <UpiQrClient />
}
