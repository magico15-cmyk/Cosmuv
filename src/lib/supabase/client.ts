import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | undefined;

export function createClient() {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: (process.env.NODE_ENV === 'development' || (typeof window !== 'undefined' && window.location.hostname.includes('localhost')))
          ? undefined
          : `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cosmuv.com'}`,
      },
    }
  );

  return browserClient;
}
