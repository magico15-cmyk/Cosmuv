import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { decodeHostname, getAccountsUrl, getStoreUrl, getRootDomain } from '@/lib/domain';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /_next (Next.js internals)
     * 2. /_static (inside /public)
     * 3. _vercel (Vercel internals)
     * 4. assets/
     * 5. root static files (e.g. favicon.ico, cosmuv-logo.png)
     */
    '/((?!_next/|_static/|_vercel|assets/|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Use x-forwarded-host if available (Vercel edge proxy), fallback to host header, then nextUrl.hostname
  const rawHostname = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.hostname;
  
  // 1. Strictly decode incoming hostname into the 4 distinct cases
  const decoded = decodeHostname(rawHostname);
  const rootDomain = getRootDomain();

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // 2. Setup Supabase Auth Client with unified domain scoping
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
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
      cookieOptions: {
        domain: (process.env.NODE_ENV === 'development' || rootDomain.includes('localhost') || rawHostname.endsWith('.vercel.app') || decoded.type === 'root')
          ? undefined
          : `.${rootDomain}`,
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  function withCookies(res: NextResponse): NextResponse {
    response.cookies.getAll().forEach(cookie => {
      res.cookies.set(cookie.name, cookie.value);
    });
    return res;
  }

  // Strict User-to-Store Mapping: Lookup store strictly by authenticated user's ID
  let userStoreSubdomain: string | null = null;
  if (user) {
    const { data: stores } = await supabase
      .from('stores')
      .select('subdomain')
      .eq('user_id', user.id)
      .limit(1);
    if (stores && stores.length > 0) {
      userStoreSubdomain = stores[0].subdomain;
    }
  }

  // 3. API ROUTING (Global)
  if (url.pathname.startsWith('/api/')) {
    let apiTenantKey = 'cosmuv';
    if (decoded.type === 'store' && decoded.subdomain) {
      apiTenantKey = decoded.subdomain;
    } else {
      apiTenantKey = userStoreSubdomain || 'cosmuv';
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-tenant-subdomain', apiTenantKey);
    return withCookies(
      NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    );
  }

  // CASE 1: Root Landing Page (cosmuv.com)
  // When host is exactly cosmuv.com / localhost:3000, render global platform frontpage.
  // Do not check for subdomains or attempt tenant store resolution here.
  if (decoded.type === 'root') {
    if (path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/register') || path.startsWith('/logout') || path.startsWith('/onboarding')) {
      const targetPath = path.replace('/register', '/signup').replace('/onboarding', '/signup');
      return withCookies(NextResponse.redirect(new URL(getAccountsUrl(targetPath))));
    }
    if (path.startsWith('/admin')) {
      if (!user) {
        return withCookies(NextResponse.redirect(new URL(getAccountsUrl('/login'))));
      }
      if (userStoreSubdomain) {
        return withCookies(NextResponse.redirect(new URL(getStoreUrl(userStoreSubdomain, '/admin'))));
      }
      return withCookies(NextResponse.redirect(new URL(getAccountsUrl('/login'))));
    }
    return withCookies(NextResponse.next());
  }

  // CASE 2: Centralized Authentication Hub (accounts.cosmuv.com)
  // Rewrite strictly to handle centralized authentication routes under unified domain context.
  if (decoded.type === 'accounts') {
    if (path === '/' || path.startsWith('/login')) {
      if (user && userStoreSubdomain) {
        return withCookies(NextResponse.redirect(new URL(getStoreUrl(userStoreSubdomain, '/admin'))));
      }
      return withCookies(NextResponse.rewrite(new URL(`/accounts/login${url.search}`, req.url)));
    }
    if (path.startsWith('/signup') || path.startsWith('/register') || path.startsWith('/onboarding') || path.startsWith('/logout') || path.startsWith('/auth/callback')) {
      const targetPath = path.replace('/register', '/signup').replace('/onboarding', '/signup');
      return withCookies(NextResponse.rewrite(new URL(`/accounts${targetPath}`, req.url)));
    }
    // Any unknown path on accounts redirects to login
    return withCookies(NextResponse.redirect(new URL(getAccountsUrl('/login'))));
  }

  // CASE 3 & 4: Dynamic Store Subdomains (*.cosmuv.com)
  if (decoded.type === 'store' && decoded.subdomain) {
    const subdomain = decoded.subdomain;

    // Redirect direct login/signup access on store subdomain to centralized accounts hub
    if (path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/register') || path.startsWith('/logout') || path.startsWith('/onboarding')) {
      const targetPath = path.replace('/register', '/signup').replace('/onboarding', '/signup');
      return withCookies(NextResponse.redirect(new URL(getAccountsUrl(targetPath))));
    }

    const { data: store } = await supabase.from('stores').select('status, user_id').eq('subdomain', subdomain).maybeSingle();
    
    if (store && store.status === 'pending') {
      return withCookies(NextResponse.redirect(new URL(`/holding-page`, req.url)));
    }

    // CASE 4: If path is /admin/*, verify authenticated user session from accounts.cosmuv.com
    // matches user_id mapped to this store row.
    if (path.startsWith('/admin')) {
      if (!user) {
        return withCookies(NextResponse.redirect(new URL(getAccountsUrl('/login'))));
      }
      if (store && store.user_id !== user.id) {
        if (userStoreSubdomain) {
          return withCookies(NextResponse.redirect(new URL(getStoreUrl(userStoreSubdomain, '/admin'))));
        }
        return withCookies(NextResponse.redirect(new URL(getAccountsUrl('/login?error=Unauthorized+store+access'))));
      }
    }

    // CASE 3: Rewrite to /[domain] route in src/app/[domain]/...
    return withCookies(NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url)));
  }

  return withCookies(NextResponse.next());
}
