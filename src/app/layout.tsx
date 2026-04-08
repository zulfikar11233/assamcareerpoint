// src/app/layout.tsx
import { Sora, Nunito } from 'next/font/google';
import type { Metadata, Viewport } from 'next'
import Providers from '@/components/Providers'   // ← NEW IMPORT

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
const SITE_DESC = 'Latest Govt Jobs in Assam, Competitive Exams (CTET, NEET, UPSC), and important information like Voter ID, PAN-Aadhaar linking, government schemes — updated daily for Assam & North East India.'

export const metadata: Metadata = {
  title: {
    default:  `${SITE_NAME} — Govt Jobs, Exams & Information`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    'Assam govt jobs 2026', 'APSC recruitment', 'Assam Police vacancy',
    'SLPRB Assam', 'BTC jobs', 'Assam career', 'sarkari naukri Assam',
    'CTET 2026', 'NEET 2026', 'competitive exams Assam',
    'voter ID registration Assam', 'PAN Aadhaar linking',
    'govt schemes Assam', 'NE India jobs', 'assamcareerpoint-info.com',
  ],
  authors:     [{ name: 'Assam Career Point & Info', url: SITE_URL }],
  creator:      'Assam Career Point & Info',
  publisher:    'Assam Career Point & Info',
  category:     'Government Jobs & Information Portal',
  alternates: {
    languages: { 'en-IN': SITE_URL },
  },
  openGraph: {
    type:        'website',
    url:          SITE_URL,
    siteName:     SITE_NAME,
    title:       `${SITE_NAME} — Govt Jobs, Exams & Information`,
    description:  SITE_DESC,
    locale:      'en_IN',
    images: [{
      url:    `${SITE_URL}/og-image.png`,
      width:   1200,
      height:  630,
      alt:    `${SITE_NAME} — Govt Jobs, Exams & Information Portal`,
    }],
  },
  twitter: {
    card:        'summary_large_image',
    site:        '@AssamCareerPt',
    creator:     '@AssamCareerPt',
    title:       `${SITE_NAME} — Govt Jobs & Exams`,
    description:  SITE_DESC,
    images:      [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
  verification: {
    google: 'QTg9Okvs2Ox9fTAxT4emmHEcPHrD0apfqn8xxRZ4mkQ',
  },
  manifest:    '/manifest.json',
  appleWebApp: {
    capable:        true,
    title:          SITE_NAME,
    statusBarStyle: 'black-translucent',
  },
  applicationName: SITE_NAME,
  formatDetection: { telephone: false },
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
  logo:        `${SITE_URL}/logo.png`,
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
        <link rel="icon"             type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon"             type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180"                href="/apple-touch-icon.png" />

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
        <Providers>       {/* ← THIS IS THE FIX — wraps all pages with SessionProvider */}
          {children}
        </Providers>
      </body>
    </html>
  )
}