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

  // Clean hostname (e.g., remove port in local dev if needed, though middleware handles some of this)
  const cleanHostname = hostname.split(':')[0];

  // Extract just the subdomain part (e.g. 'shop1' from 'shop1.localhost' or 'shop1.sello.com')
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost';
  let subdomain = cleanHostname;
  if (cleanHostname.endsWith(`.${rootDomain}`)) {
    subdomain = cleanHostname.replace(`.${rootDomain}`, '');
  }
  
  // Local network testing fallback: if accessed via IP address, default to 'shop1'
  if (/^[0-9.]+$/.test(cleanHostname)) {
    subdomain = 'shop1';
  }

  let query = supabaseServer
    .from('stores')
    .select('*')
    // Check if the cleanHostname matches a custom domain OR if the extracted subdomain matches the subdomain column
    .or(`subdomain.eq.${subdomain},custom_domain.eq.${cleanHostname}`)
    .single();

  const { data: store, error } = await query;

  if (error || !store) {
    return null;
  }

  return store;
}
