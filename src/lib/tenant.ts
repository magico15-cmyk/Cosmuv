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

  // Clean hostname (remove port if present)
  const cleanHostname = hostname.split(':')[0];

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';
  const defaultStore = process.env.DEFAULT_STORE_SUBDOMAIN || 'sello';

  let subdomain = cleanHostname;

  // --- Detect environment-specific hostnames and resolve to a subdomain ---

  // Vercel preview/production URLs — middleware should have already rewritten these,
  // but as a safety net, fall back to the default store.
  if (cleanHostname.endsWith('.vercel.app')) {
    subdomain = defaultStore;
  }
  // Standard subdomain routing (e.g., shop1.localhost or shop1.sello.com)
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
