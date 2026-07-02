import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// We create a fresh client for server-side fetching that explicitly bypasses Next.js aggressive caching
const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
  }
});

export async function getTenantFromHost(hostname?: string) {
  if (!hostname) return null;

  // Strict User-to-Store Mapping: Check if there is an authenticated user in server context
  try {
    const { createClient: createServerSupabase } = await import('@/lib/supabase/server');
    const supabaseAuth = await createServerSupabase();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (user) {
      const { data: userStores } = await supabaseServer
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .limit(1);

      if (userStores && userStores.length > 0) {
        const store = userStores[0];
        const cleanHost = hostname.split(':')[0];
        if (cleanHost === 'localhost' || cleanHost === 'cosmuv' || cleanHost === 'cosmuv.com' || cleanHost === 'www.cosmuv.com' || cleanHost.endsWith('.vercel.app') || cleanHost.includes(store.subdomain) || cleanHost === store.custom_domain) {
          const { data: menus } = await supabaseServer.from('store_menus').select('*').eq('store_id', store.id);
          if (menus) store.menus = menus;
          return store;
        }
      }
    }
  } catch (e) {
    // Proceed to standard domain resolution if not in request context or not logged in
  }

  // Clean hostname (remove port if present)
  const cleanHostname = hostname.split(':')[0];

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cosmuv.com';
  const defaultStore = process.env.DEFAULT_STORE_SUBDOMAIN || 'cosmuv';

  let subdomain = cleanHostname;

  // --- Detect environment-specific hostnames and resolve to a subdomain ---

  // Explicitly recognize the new platform roots
  if (
    cleanHostname === 'cosmuv.vercel.app' || 
    cleanHostname === 'cosmuv.com' || 
    cleanHostname === 'www.cosmuv.com' || 
    cleanHostname === 'cosmuv' || 
    cleanHostname === 'localhost'
  ) {
    subdomain = 'cosmuv';
  }
  // Vercel preview/production URLs — middleware should have already rewritten these,
  // but as a safety net, fall back to the default store.
  else if (cleanHostname.endsWith('.vercel.app')) {
    subdomain = defaultStore;
  }
  // Explicit check for *.cosmuv.com subdomains
  else if (cleanHostname.endsWith('.cosmuv.com')) {
    subdomain = cleanHostname.replace('.cosmuv.com', '');
  }
  // Standard subdomain routing (e.g., shop1.localhost)
  else if (cleanHostname.endsWith(`.${rootDomain}`)) {
    subdomain = cleanHostname.replace(`.${rootDomain}`, '');
  }
  // IP address access
  else if (/^[0-9.]+$/.test(cleanHostname)) {
    subdomain = defaultStore;
  }
  // Bare root domain with no subdomain
  else if (cleanHostname === rootDomain) {
    subdomain = defaultStore;
  }
  // Otherwise, treat cleanHostname as a potential custom domain — the query below
  // checks both the subdomain column and the custom_domain column.

  let query = supabaseServer
    .from('stores')
    .select('*')
    // Check if the subdomain matches OR if the full hostname is a registered custom domain
    .or(`subdomain.eq.${subdomain},custom_domain.eq.${cleanHostname}`)
    .single();

  const { data: store, error } = await query;

  if (error || !store) {
    return null;
  }

  // Fetch menus
  const { data: menus } = await supabaseServer
    .from('store_menus')
    .select('*')
    .eq('store_id', store.id);

  if (menus) {
    store.menus = menus;
  }

  return store;
}
