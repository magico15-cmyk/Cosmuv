import { createClient } from '@supabase/supabase-js';
import { decodeHostname } from '@/lib/domain';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// We create a fresh client for server-side fetching that explicitly bypasses Next.js aggressive caching
const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
  }
});

let defaultStoreCache: Record<string, unknown> | null = null;
let defaultStoreCacheTime = 0;

async function getDefaultStorePayload() {
  const now = Date.now();
  if (defaultStoreCache && now - defaultStoreCacheTime < 60000) {
    return defaultStoreCache;
  }
  const { data } = await supabaseServer
    .from('stores')
    .select('*')
    .eq('subdomain', 'cosmuv')
    .maybeSingle();
  if (data) {
    defaultStoreCache = data;
    defaultStoreCacheTime = now;
  }
  return data;
}

export async function getTenantFromHost(hostname?: string) {
  if (!hostname) return null;

  const cleanHost = hostname.split(':')[0].toLowerCase().trim();
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cosmuv.com').split(':')[0].toLowerCase().trim();

  // 1. Root Landing Page & Centralized Authentication Hub check:
  // Do not check for subdomains or attempt tenant store resolution on root or accounts domains.
  if (
    cleanHost === rootDomain ||
    cleanHost === `www.${rootDomain}` ||
    cleanHost === 'cosmuv.com' ||
    cleanHost === 'www.cosmuv.com' ||
    cleanHost === 'localhost' ||
    cleanHost === '127.0.0.1' ||
    cleanHost === 'cosmuv.vercel.app' ||
    cleanHost === `accounts.${rootDomain}` ||
    cleanHost === 'accounts.cosmuv.com' ||
    cleanHost === 'accounts.localhost' ||
    (cleanHost.endsWith('.vercel.app') && cleanHost.startsWith('accounts---'))
  ) {
    return null;
  }

  // 2. Extract subdomain or custom domain
  const decoded = decodeHostname(hostname);
  const subdomain = decoded.subdomain || cleanHost;

  const query = supabaseServer
    .from('stores')
    .select('*')
    .or(`subdomain.eq.${subdomain},custom_domain.eq.${cleanHost}`)
    .maybeSingle();

  const { data: store, error } = await query;

  if (error || !store) {
    return null;
  }

  // 3. Clone default layout/styling metadata from COSMUV store payload if missing
  if (store.subdomain !== 'cosmuv') {
    try {
      const defaultStore = await getDefaultStorePayload();
      if (defaultStore) {
        for (const [key, val] of Object.entries(defaultStore)) {
          if (
            key !== 'id' &&
            key !== 'user_id' &&
            key !== 'subdomain' &&
            key !== 'store_name' &&
            key !== 'custom_domain' &&
            key !== 'created_at' &&
            key !== 'status' &&
            key !== 'stripe_account_id'
          ) {
            if (store[key] === null || store[key] === undefined || store[key] === '') {
              store[key] = val;
            }
          }
         }
      }
    } catch (e) {
      console.error("Failed to clone COSMUV store styling metadata:", e);
    }
  }

  // 4. Fetch menus
  const { data: menus } = await supabaseServer
    .from('store_menus')
    .select('*')
    .eq('store_id', store.id);

  if (menus) {
    store.menus = menus;
  }

  return store;
}
