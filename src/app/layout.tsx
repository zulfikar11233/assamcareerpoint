// src/app/layout.tsx
import { Sora, Nunito } from 'next/font/google';
import type { Metadata, Viewport } from 'next'
import Providers from '@/components/Providers'   // â† NEW IMPORT
import AlertBanner from '@/components/AlertBanner'

const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
  weight: ['700', '800'],
  preload: true,
  fallback: ['Arial Black', 'sans-serif'],
});

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
  weight: ['400', '600', '700'],
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

const SITE_URL  = 'https://www.assamcareerpoint-info.com'
const SITE_NAME = 'Assam Career Point & Info'
const SITE_DESC = 'Latest Govt Jobs in Assam, Competitive Exams (CTET, NEET, UPSC), and important information like Voter ID, PAN-Aadhaar linking, government schemes â€” updated daily for Assam & North East India.'

export const metadata: Metadata = {
  title: {
    default: 'Assam Career Point & Info — Govt Jobs, Exams, Results',
    template: '%s | Assam Career Point & Info',
  },
  description: 'Your gateway to Government Jobs, Competitive Exams, Results and Career Information in Assam & NE India. Updated daily.',
  keywords: ['Assam government jobs', 'APSC', 'SLPRB', 'Assam police', 'Assam career', 'govt jobs Assam 2026'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://assamcareerpoint-info.com',
    siteName: 'Assam Career Point & Info',
    title: 'Assam Career Point & Info — Govt Jobs, Exams & Results',
    description: 'Daily updates on Government Jobs, Exams, Results and Career Information for Assam.',
    images: [{
      url: 'https://assamcareerpoint-info.com/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Assam Career Point & Info',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Assam Career Point & Info',
    description: 'Govt Jobs, Exams, Results & Career Info for Assam.',
    images: ['https://assamcareerpoint-info.com/og-image.png'],
  },
  metadataBase: new URL('https://assamcareerpoint-info.com'),
  alternates: {
    canonical: '/',
  },
}
export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor:   '#0b1f33',
}

const websiteSchema = {
  '@context':   'https://schema.org',
  '@type':      'WebSite',
  name:          SITE_NAME,
  url:           SITE_URL,
  description:   SITE_DESC,
  inLanguage:   ['en-IN', 'as'],
  potentialAction: {
    '@type':       'SearchAction',
    target: {
      '@type':     'EntryPoint',
      urlTemplate: `${SITE_URL}/govt-jobs?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const orgSchema = {
  '@context':  'https://schema.org',
  '@type':     'Organization',
  name:         SITE_NAME,
  url:          SITE_URL,
  logo:        `${SITE_URL}/acpi-logo.png.png`,
  description:  SITE_DESC,
  sameAs: [
    'https://t.me/assamcareerpoint',
    'https://wa.me/your-whatsapp-channel',
    'https://youtube.com/@assamcareerpoint',
  ],
  contactPoint: {
    '@type':           'ContactPoint',
    contactType:       'customer support',
    email:             'admin@assamcareerpoint-info.com',
    areaServed:        'IN',
    availableLanguage: ['English', 'Assamese'],
  },
}

function safeJsonLd(obj: object): string {
  return JSON.stringify(obj)
    .replace(/</g,  '\\u003c')
    .replace(/>/g,  '\\u003e')
    .replace(/&/g,  '\\u0026')
    .replace(/'/g,  '\\u0027')
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" dir="ltr" className={`${sora.variable} ${nunito.variable}`}>
      <head>
        <link rel="icon"             type="image/x-icon"            href="/favicon.ico" />
        <link rel="icon"             type="image/png" href="/acpi-logo.png.png" />
        <link rel="apple-touch-icon" href="/acpi-logo.png.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(orgSchema) }}
        />

        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.addEventListener('load', function() {
            setTimeout(function() {
              var s = document.createElement('script');
              s.src = 'https://www.googletagmanager.com/gtag/js?id=G-KXLWVXBV4Q';
              s.async = true;
              s.onload = function() {
                gtag('js', new Date());
                gtag('config', 'G-KXLWVXBV4Q');
              };
              document.head.appendChild(s);
            }, 2000);
          });
        `}} />
      </head>

      <body style={{ margin: 0, padding: 0, fontFamily: 'var(--font-nunito), sans-serif' }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Assam Career Point & Info",
            "url": "https://assamcareerpoint-info.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://assamcareerpoint-info.com/og-image.png",
              "width": 1200,
              "height": 630
            },
            "description": "Government jobs, exams, results and career information portal for Assam and Northeast India.",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Assam",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://www.facebook.com/assamcareerpoint",
              "https://www.youtube.com/@assamcareerpoint"
            ]
          })}}
        />
        <Providers>       {/* â† THIS IS THE FIX â€” wraps all pages with SessionProvider */}
          <AlertBanner />
          {children}
        </Providers>
      </body>
    </html>
  )
}
