import { supabase } from "./supabase";

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

  let query = supabase
    .from('stores')
    .select('id, store_name, subdomain, custom_domain')
    // Check if the cleanHostname matches a custom domain OR if the extracted subdomain matches the subdomain column
    .or(`subdomain.eq.${subdomain},custom_domain.eq.${cleanHostname}`)
    .single();

  const { data: store, error } = await query;

  if (error || !store) {
    return null;
  }

  return store;
}
