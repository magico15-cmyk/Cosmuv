import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. favicon.ico)
     * 5. assets/
     */
    '/((?!api/|_next/|_static/|_vercel|assets/|[\\w-]+\\.\\w+).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  // Strip the port to ensure the rewritten path is clean (e.g., /shop1.localhost instead of /shop1.localhost:3000)
  let hostname = req.headers.get('host')!.split(':')[0];

  // Special case for Vercel preview deployment URLs
  if (
    hostname.includes('---') &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split('---')[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'
    }`;
  }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ''
  }`;

  // If we are on the admin path, just rewrite to admin (to avoid going into [domain])
  if (url.pathname.startsWith('/admin')) {
    return NextResponse.rewrite(new URL(`${path}`, req.url));
  }

  // Rewrite to the appropriate domain folder
  // E.g., if host is "store.sello.local", it rewrites to /store.sello.local/...
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
