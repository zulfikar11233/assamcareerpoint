// next.config.js — PROJECT ROOT (same level as package.json)

/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key:   'X-Frame-Options',
    value: 'DENY',
  },
  {
    key:   'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key:   'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key:   'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key:   'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key:   'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    // NOTE: 'unsafe-inline' and 'unsafe-eval' are REQUIRED by Next.js App Router.
    // Next.js injects inline scripts for page hydration — removing these breaks
    // ALL client-side JavaScript including login forms, buttons, React state, etc.
    // Do NOT remove them without implementing nonces (an advanced setup).
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://adservice.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://lh3.googleusercontent.com https://drive.google.com https://www.google.com https://pagead2.googlesyndication.com",
      "frame-src https://drive.google.com https://www.google.com",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self' https://formspree.io",
    ].join('; '),
  },
]

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  async redirects() {
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'assamcareerpoint-info.com' }],
      destination: 'https://www.assamcareerpoint-info.com/:path*',
      permanent: true,
    },
  ]
},

  async headers() {
  return [
    {
  source: '/_next/static/:path*',
  headers: [
    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    { key: 'Content-Type', value: 'application/javascript' },
  ],
},
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
    {
      source: '/admin/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
        { key: 'Pragma',        value: 'no-cache' },
      ],
    },
  ]
},

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
  },
}

module.exports = nextConfig
