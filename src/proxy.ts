// src/proxy.ts  ← This is the middleware file for Next.js 16 (Turbopack)
// In this version of Next.js, "proxy.ts" is the middleware convention (not middleware.ts)
// This file runs on EVERY request that matches the "matcher" config below.

import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // /admin/login is the login page itself — never block it
  const isLoginPage =
    pathname === '/admin/login' ||
    pathname.startsWith('/admin/login/')

  // Protect all /admin/* pages
  if (pathname.startsWith('/admin') && !isLoginPage) {

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Not logged in OR token doesn't have admin role → redirect to login
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

// Which paths this middleware runs on
export const config = {
  matcher: ['/admin/:path*'],
}
