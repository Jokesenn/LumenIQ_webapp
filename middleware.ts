import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// --- Nonce-based Content Security Policy ---
// Generates a unique nonce per request. Modern browsers seeing 'strict-dynamic'
// ignore 'unsafe-inline' and 'self' for script-src, restoring XSS protection.
// 'unsafe-inline' is kept as fallback for older browsers that don't support nonces.
function buildCspHeader(nonce: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://kshtmftvjhsdlxpsvgyr.supabase.co'
  const supabaseWs = supabaseUrl.replace('https://', 'wss://')
  const isDev = process.env.NODE_ENV === 'development'

  const directives = [
    "default-src 'self'",
    // In dev: unsafe-eval needed for HMR/Fast Refresh. In prod: strict nonce-only.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''}`,
    // Styles: unsafe-inline kept for Tailwind, Framer Motion, dynamic styles
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self' ${supabaseUrl} ${supabaseWs} ${isDev ? 'ws://localhost:* http://localhost:*' : ''}`,
    "worker-src 'self' blob:",
    "frame-src 'none'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ]

  return directives.join('; ')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Generate nonce and CSP ---
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeaderValue = buildCspHeader(nonce)

  // Set nonce on request headers so server components can read it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', cspHeaderValue)

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  })

  // Apply CSP to response
  supabaseResponse.headers.set('Content-Security-Policy', cspHeaderValue)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          })
          // Re-apply CSP after Supabase recreates the response
          supabaseResponse.headers.set('Content-Security-Policy', cspHeaderValue)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes: redirect to login if not authenticated
  if (pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated and tries to access login, redirect to dashboard
  if (pathname === '/login' && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo')
    const url = request.nextUrl.clone()
    url.pathname = redirectTo || '/dashboard'
    url.searchParams.delete('redirectTo')
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
