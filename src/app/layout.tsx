// src/app/layout.tsx
// ✅ Complete SEO: title, description, Open Graph, Twitter Cards, canonical
// ✅ Structured Data (JSON-LD): WebSite + Organization schema
// ✅ Google AdSense slot ready (replace ca-pub-XXXXXXXXXXXXXXXX with your Publisher ID)
// ✅ Google Analytics 4 slot ready (replace G-XXXXXXXXXX with your Measurement ID)
// ✅ robots, sitemap, manifest connected

import type { Metadata, Viewport } from 'next'

const SITE_URL  = 'https://www.assamcareerpoint-info.com'
const SITE_NAME = 'Assam Career Point & Info'
const SITE_DESC = 'Latest Govt Jobs in Assam, Competitive Exams (CTET, NEET, UPSC), and important information like Voter ID, PAN-Aadhaar linking, government schemes — updated daily for Assam & North East India.'

// ─── GLOBAL METADATA ─────────────────────────────────────────────
export const metadata: Metadata = {
  // ── Basic ──
  title: {
    default:  `${SITE_NAME} — Govt Jobs, Exams & Information`,
    template: `%s | ${SITE_NAME}`,   // page titles become: "Assam Police Jobs | Assam Career Point & Info"
  },
  description: SITE_DESC,
  keywords: [
    'Assam govt jobs 2026', 'APSC recruitment', 'Assam Police vacancy',
    'SLPRB Assam', 'BTC jobs', 'Assam career', 'sarkari naukri Assam',
    'CTET 2026', 'NEET 2026', 'competitive exams Assam',
    'voter ID registration Assam', 'PAN Aadhaar linking',
    'govt schemes Assam', 'NE India jobs', 'assamcareerpoint-info.com',
  ],
  authors: [{ name: 'Assam Career Point & Info', url: SITE_URL }],
  creator:  'Assam Career Point & Info',
  publisher:'Assam Career Point & Info',
  category: 'Government Jobs & Information Portal',

  // ── Canonical & Alternates ──
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en-IN': SITE_URL,
      'as':    `${SITE_URL}/as`,      // Assamese version if you add it
    },
  },

  // ── Open Graph (Facebook, WhatsApp, Telegram previews) ──
  openGraph: {
    type:        'website',
    url:          SITE_URL,
    siteName:     SITE_NAME,
    title:       `${SITE_NAME} — Govt Jobs, Exams & Information`,
    description:  SITE_DESC,
    locale:      'en_IN',
    images: [{
      url:    `${SITE_URL}/og-image.png`,   // create a 1200×630 banner image
      width:   1200,
      height:  630,
      alt:    `${SITE_NAME} — Govt Jobs, Exams & Information Portal`,
    }],
  },

  // ── Twitter / X Cards ──
  twitter: {
    card:        'summary_large_image',
    site:        '@AssamCareerPt',          // replace with your Twitter handle
    creator:     '@AssamCareerPt',
    title:       `${SITE_NAME} — Govt Jobs & Exams`,
    description:  SITE_DESC,
    images:      [`${SITE_URL}/og-image.png`],
  },

  // ── Robots ──
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  // ── Verification (add your codes when you verify) ──
  verification: {
    google: 'REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_CODE',  // from Google Search Console
    // yandex: 'xxx',
    // bing: 'xxx',
  },

  // ── PWA / App ──
  manifest: '/manifest.json',
  appleWebApp: {
    capable:    true,
    title:      SITE_NAME,
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

// ─── STRUCTURED DATA (JSON-LD) ────────────────────────────────────
// Google reads this to show rich results in search — VERY important for job portals
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
    'https://t.me/assamcareerpoint',         // replace with your Telegram
    'https://wa.me/your-whatsapp-channel',   // replace with your WhatsApp
    'https://youtube.com/@assamcareerpoint', // replace with your YouTube
  ],
  contactPoint: {
    '@type':       'ContactPoint',
    contactType:   'customer support',
    email:         'admin@assamcareerpoint-info.com',
    areaServed:    'IN',
    availableLanguage: ['English', 'Assamese'],
  },
}

// ─── SAFE JSON-LD SERIALISER (prevents XSS via structured data) ──
// Escapes <, >, &, ' to Unicode escapes — safe inside <script> tags
function safeJsonLd(obj: object): string {
  return JSON.stringify(obj)
    .replace(/</g,  '\\u003c')
    .replace(/>/g,  '\\u003e')
    .replace(/&/g,  '\\u0026')
    .replace(/'/g,  '\\u0027')
}

// ─── LAYOUT COMPONENT ─────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" dir="ltr">
      <head>
        {/* ── Preconnect to speed up Google Fonts, AdSense, Analytics ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* ── Fonts ── */}
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Nunito:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ── Favicon set ── */}
        <link rel="icon"             type="image/x-icon"       href="/favicon.ico" />
        <link rel="icon"             type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon"             type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180"             href="/apple-touch-icon.png" />

        {/* ── Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(orgSchema) }}
        />

        {/* ════════════════════════════════════════════════════════════
            GOOGLE ADSENSE
            Step 1: Replace ca-pub-XXXXXXXXXXXXXXXX with your Publisher ID
            Step 2: This auto-ads script shows ads automatically across the site
            Step 3: You can ALSO place manual ad units in specific spots (see AdSlot component below)
            ════════════════════════════════════════════════════════════ */}
        {/*
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
        */}

        {/* ════════════════════════════════════════════════════════════
            GOOGLE ANALYTICS 4
            Replace G-XXXXXXXXXX with your Measurement ID from analytics.google.com
            ════════════════════════════════════════════════════════════ */}
        {/*
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}} />
        */}
      </head>

      <body style={{ margin: 0, padding: 0, fontFamily: 'Nunito, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
