import { supabase } from "./supabase";

export async function getTenantFromHost(hostname?: string) {
  if (!hostname) return null;

  // Clean hostname (e.g., remove port in local dev if needed, though middleware handles some of this)
  const cleanHostname = hostname.split(':')[0];

  let query = supabase
    .from('stores')
    .select('id, store_name, subdomain, custom_domain')
    .or(`subdomain.eq.${cleanHostname},custom_domain.eq.${cleanHostname}`)
    .single();

  const { data: store, error } = await query;

  if (error || !store) {
    return null;
  }

  return store;
}
