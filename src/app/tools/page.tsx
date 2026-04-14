import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Online Tools for Government Job Seekers | Assam Career Point',
  description:
    'Free online tools for Assam government job applicants – Photo Resizer, UPI QR Generator, Images to PDF, Bio-Data Maker, Word Counter and Age Calculator with exam eligibility checker.',
  keywords:
    'free tools assam government job, photo resize ADRE APSC, UPI QR code, images to PDF, bio data maker assam, age calculator exam eligibility, word counter essay UPSC SSC',
  openGraph: {
    title: 'Free Online Tools for Government Job Seekers | Assam Career Point',
    description: '6 free tools: resize photos, check exam eligibility, count words, generate UPI QR, convert images to PDF and create bio-data.',
    url: 'https://assamcareerpoint-info.com/tools',
  },
}

const tools = [
  { href: '/tools/image-resizer', icon: '🖼️', title: 'Photo & Image Resizer', desc: 'Resize photos for ADRE, APSC, SLPRB, SSC, Railway, Bank exams. 25+ presets, compression, background color, rotation.', tags: ['ADRE', 'APSC', 'SLPRB', 'Passport Size'], color: 'from-teal-50 to-cyan-50', border: 'border-teal-200', badge: 'Most Popular' },
  { href: '/tools/age-calculator', icon: '🎂', title: 'Age Calculator', desc: 'Calculate exact age and check eligibility for ADRE, APSC, SSC, Railway, Bank and UPSC. Includes OBC/SC/ST relaxation.', tags: ['Exam Eligibility', 'OBC/SC/ST', 'ADRE', 'APSC'], color: 'from-green-50 to-emerald-50', border: 'border-green-200', badge: 'New' },
  { href: '/tools/word-counter', icon: '📝', title: 'Word Counter', desc: 'Count words, characters, reading time. Exam word limit checker, keyword density, sentence flow, find & replace, case converter.', tags: ['UPSC Essay', 'SSC', 'Keyword Density'], color: 'from-indigo-50 to-purple-50', border: 'border-indigo-200', badge: 'New' },
  { href: '/tools/bio-data-maker', icon: '📋', title: 'Bio-Data / Resume Maker', desc: 'Government-format bio-data with Assam fields — Employment Exchange No., PRC, Category, District. Download as PDF.', tags: ['Employment Exchange', 'PRC', 'PDF'], color: 'from-rose-50 to-pink-50', border: 'border-rose-200', badge: null },
  { href: '/tools/images-to-pdf', icon: '📄', title: 'Images to PDF Converter', desc: 'Convert photos and certificates into a single PDF. Compress, reorder, rotate, A4/Letter, page numbers.', tags: ['Certificates', 'A4', 'Compress'], color: 'from-blue-50 to-sky-50', border: 'border-blue-200', badge: null },
  { href: '/tools/upi-qr-generator', icon: '📲', title: 'UPI QR Code Generator', desc: 'Create UPI payment QR codes for GPay, PhonePe, Paytm, BHIM. Supports UPI ID, Bank Account and Mobile modes.', tags: ['GPay', 'PhonePe', 'BHIM', 'Paytm'], color: 'from-amber-50 to-yellow-50', border: 'border-amber-200', badge: null },
]

export default function ToolsHubPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #0b1f33 0%, #1a3a5c 100%)' }}>
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-5" style={{ background: 'rgba(201,162,39,0.2)', color: '#c9a227' }}>
            6 Free Tools · Works in Browser · No Login Required
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Free Tools for <span style={{ color: '#1dbfad' }}>Job Seekers</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Specially designed for Assam government job applicants. Resize photos, check exam eligibility, count words, generate UPI QR codes, convert images to PDF and build your bio-data — all free, private, in your browser.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className={`group relative bg-gradient-to-br ${tool.color} border ${tool.border} rounded-2xl p-7 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col`}>
              {tool.badge && <span className="absolute top-5 right-5 text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#c9a227', color: '#0b1f33' }}>{tool.badge}</span>}
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h2 className="text-xl font-bold mb-2" style={{ color: '#0b1f33' }}>{tool.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{tool.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tool.tags.map(tag => <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-500">{tag}</span>)}
              </div>
              <div className="text-sm font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all" style={{ color: '#1dbfad' }}>Open Tool →</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-14 text-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-7">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#0b1f33' }}>Your Privacy is Fully Protected</h3>
          <p className="text-base text-gray-600 leading-relaxed">All tools process your files and data entirely in your browser. No files are uploaded to any server. Your photos, documents and personal details never leave your device. No login, no signup, no tracking.</p>
        </div>
      </section>
    </main>
  )
}
