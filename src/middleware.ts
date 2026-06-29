import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /_next (Next.js internals)
     * 2. /_static (inside /public)
     * 3. _vercel (Vercel internals)
     * 4. assets/
     * 5. root static files (e.g. favicon.ico)
     */
    '/((?!_next/|_static/|_vercel|assets/|[\\w-]+\\.\\w+).*)',
  ],
};

/**
 * Resolves the tenant subdomain from the incoming request hostname.
 *
 * Priority:
 * 1. Custom production domains (e.g., mystore.com) — passed through as-is
 *    for custom_domain lookup in the database.
 * 2. Subdomain-based routing (e.g., shop1.localhost:3000 or shop1.cosmuv.com)
 *    — extracts the subdomain part.
 * 3. Vercel preview/production URLs (*.vercel.app) — falls back to a
 *    default store defined by DEFAULT_STORE_SUBDOMAIN env var.
 * 4. IP address access — falls back to default store.
 */
export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname, strip port for clean rewrite paths
  let hostname = req.headers.get('host')!.split(':')[0];

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';
  const defaultStore = process.env.DEFAULT_STORE_SUBDOMAIN || 'cosmuv';

  // --- Determine the tenant key to use for the rewrite path ---
  let tenantKey = hostname; // Default: use the full hostname (for custom domains)

  // Case 1: Vercel preview/production URLs (e.g., my-app-abc123.vercel.app)
  // These are NOT real tenant hostnames — fall back to default store.
  if (hostname.endsWith('.vercel.app')) {
    tenantKey = defaultStore;
  }
  // Case 2: Vercel branch preview with --- separator
  // (e.g., feature---my-app.vercel.app)
  else if (
    hostname.includes('---') &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    // Extract the branch subdomain part before ---
    tenantKey = hostname.split('---')[0];
  }
  // Case 3: Standard subdomain routing (e.g., shop1.localhost or shop1.cosmuv.com)
  else if (hostname.endsWith(`.${rootDomain}`)) {
    tenantKey = hostname.replace(`.${rootDomain}`, '');
  }
  // Case 4: IP address access (e.g., 192.168.1.5)
  else if (/^[0-9.]+$/.test(hostname)) {
    tenantKey = defaultStore;
  }
  // Case 5: Bare root domain (e.g., just "localhost" or "cosmuv.com" with no subdomain)
  else if (hostname === rootDomain) {
    tenantKey = defaultStore;
  }
  // Case 6: Custom domain (e.g., mystore.com) — keep hostname as-is
  // tenantKey is already set to hostname above.

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // If this is an API route, do not rewrite the path to inject the tenantKey.
  // API routes live at /api/... globally, so we just attach the tenantKey via a header.
  if (url.pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-tenant-subdomain', tenantKey);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Update supabase session
  let response = NextResponse.rewrite(new URL(`/${tenantKey}${path}`, req.url));
  
  // We handle Supabase SSR auth here. We need a server client to check user.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
          response = NextResponse.rewrite(new URL(`/${tenantKey}${path}`, req.url));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin routes
  if (path.startsWith('/admin') && !user) {
    // redirect to login
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  // If user is logged in and trying to access /login, redirect to /admin
  if (path.startsWith('/login') && user) {
    return NextResponse.redirect(new URL(`/admin`, req.url));
  }

  return response;
}
