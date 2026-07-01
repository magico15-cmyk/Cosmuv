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
  
  // Use x-forwarded-host if available (Vercel edge proxy), fallback to host header, then nextUrl.hostname
  const rawHostname = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.hostname;
  
  // Get hostname, strip port for clean logic
  const hostname = rawHostname.split(':')[0];

  // Clean up rootDomain in case of misconfigured ENV vars (e.g. https://cosmuv.com)
  let rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cosmuv.com').replace(/^https?:\/\//, '').replace(/\/$/, '').trim();

  // 1. STRICT MAIN DOMAIN DETECTION
  // Check if the request is hitting the clean platform root
  const isMainDomain = 
    hostname === rootDomain || 
    hostname === `www.${rootDomain}` || 
    hostname === 'cosmuv.com' || 
    hostname === 'www.cosmuv.com' ||
    hostname === 'localhost' || 
    hostname === '127.0.0.1';

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  // 2. API ROUTING (Global)
  if (url.pathname.startsWith('/api/')) {
    let apiTenantKey = 'cosmuv'; // Default fallback
    if (!isMainDomain) {
      if (hostname.endsWith(`.${rootDomain}`)) {
        apiTenantKey = hostname.replace(`.${rootDomain}`, '');
      } else if (hostname.endsWith('.cosmuv.com')) {
        apiTenantKey = hostname.replace('.cosmuv.com', '');
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
      // RULE 1: STRICT ROOT DOMAIN ISOLATION
      // Never rewrite to a store. Just let Next.js handle it natively.
      // / -> src/app/page.tsx (which now natively returns PlatformLandingPage)
      
      if (path.startsWith('/admin') || path.startsWith('/login') || path.startsWith('/register')) {
        // Rewrite auth and admin routes to the default platform tenant internally
        // so the URL remains clean (e.g. www.cosmuv.com/login)
        const defaultStore = process.env.DEFAULT_STORE_SUBDOMAIN || 'cosmuv';
        return NextResponse.rewrite(new URL(`/${defaultStore}${path}`, req.url));
      } else {
        // All other paths on the main domain (e.g. /features, /) bypass store logic completely
        return NextResponse.next();
      }
    } else {
      // RULE 2: SUBDOMAINS ONLY FOR STORES
      let tenantKey = hostname;
      
      if (hostname.endsWith(`.${rootDomain}`)) {
        tenantKey = hostname.replace(`.${rootDomain}`, '');
      } else if (hostname.endsWith('.cosmuv.com')) {
        tenantKey = hostname.replace('.cosmuv.com', '');
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
        domain: (process.env.NODE_ENV === 'development' || rootDomain.includes('localhost') || hostname.endsWith('.vercel.app'))
          ? undefined
          : `.${rootDomain}`,
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 4. MANUAL APPROVAL GATEWAY
  if (!isMainDomain) {
      let tenantKey = hostname;
      if (hostname.endsWith(`.${rootDomain}`)) {
        tenantKey = hostname.replace(`.${rootDomain}`, '');
      } else if (hostname.endsWith('.cosmuv.com')) {
        tenantKey = hostname.replace('.cosmuv.com', '');
      } else if (hostname.endsWith('.localhost')) {
        tenantKey = hostname.replace('.localhost', '');
      } else if (hostname.endsWith('.vercel.app')) {
        tenantKey = hostname.includes('---') ? hostname.split('---')[0] : 'cosmuv';
      }

      const { data: store } = await supabase.from('stores').select('status').eq('subdomain', tenantKey).maybeSingle();
      
      if (store && store.status === 'pending') {
          const isLocal = rootDomain === 'localhost';
          const protocol = isLocal ? 'http' : (req.headers.get('x-forwarded-proto') || 'https');
          const port = isLocal ? ':3000' : '';
          
          const holdingResponse = NextResponse.redirect(new URL(`${protocol}://${rootDomain}${port}/holding-page`));
          
          // Carry over any cookies modified by Supabase Auth initialization
          response.cookies.getAll().forEach(cookie => {
              holdingResponse.cookies.set(cookie.name, cookie.value);
          });
          
          return holdingResponse;
      }
  }

  // 5. PROTECT ADMIN & AUTH ROUTES
  if (path.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  if (path.startsWith('/login') && user) {
    return NextResponse.redirect(new URL(`/admin`, req.url));
  }

  return response;
}
