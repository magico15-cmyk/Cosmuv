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

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname, strip port for clean logic
  const hostname = req.headers.get('host')!.split(':')[0];

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cosmuv.com';

  // 1. MAIN DOMAIN DETECTION
  // Check if the request is hitting the clean platform root
  const isMainDomain = 
    hostname === rootDomain || 
    hostname === `www.${rootDomain}` || 
    hostname === 'localhost' || 
    hostname === '127.0.0.1';

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // 2. API ROUTING (Global)
  // We want to extract tenantKey for API if needed, but do not rewrite the path.
  if (url.pathname.startsWith('/api/')) {
    let apiTenantKey = 'cosmuv'; // Default fallback
    if (!isMainDomain) {
      if (hostname.endsWith(`.${rootDomain}`)) {
        apiTenantKey = hostname.replace(`.${rootDomain}`, '');
      } else if (hostname.endsWith('.localhost')) {
        apiTenantKey = hostname.replace('.localhost', '');
      }
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-tenant-subdomain', apiTenantKey);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Helper to determine the correct rewrite
  const getRewriteResponse = () => {
    if (isMainDomain) {
      // RULE 1: Frontpage / Main Domain Logic
      if (path === '/') {
        // Platform Landing Page
        return NextResponse.rewrite(new URL(`/platform-landing`, req.url));
      } else if (path.startsWith('/admin') || path.startsWith('/login') || path.startsWith('/register')) {
        // Platform Backend & Dashboard - map to the default tenant 'cosmuv'
        return NextResponse.rewrite(new URL(`/cosmuv${path}`, req.url));
      } else {
        // Static SaaS pages (if any) or fallback
        return NextResponse.next();
      }
    } else {
      // RULE 2: Dynamic Store Subdomain
      let tenantKey = hostname;
      
      if (hostname.endsWith(`.${rootDomain}`)) {
        tenantKey = hostname.replace(`.${rootDomain}`, '');
      } else if (hostname.endsWith('.localhost')) {
        tenantKey = hostname.replace('.localhost', '');
      } else if (hostname.endsWith('.vercel.app')) {
        // Fallback for vercel preview URLs
        tenantKey = hostname.includes('---') ? hostname.split('---')[0] : 'cosmuv';
      }
      
      // Rewrite to the dynamic storefront route (src/app/[domain]/...)
      return NextResponse.rewrite(new URL(`/${tenantKey}${path}`, req.url));
    }
  };

  let response = getRewriteResponse();

  // 3. SUPABASE AUTH WITH CROSS-SUBDOMAIN COOKIES
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          // If cookies change during initialization, we must recreate the response
          response = getRewriteResponse();
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
      cookieOptions: {
        domain: process.env.NODE_ENV === 'development' ? '.localhost' : `.${rootDomain}`,
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 4. PROTECT ADMIN & AUTH ROUTES
  if (path.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  if (path.startsWith('/login') && user) {
    return NextResponse.redirect(new URL(`/admin`, req.url));
  }

  return response;
}
