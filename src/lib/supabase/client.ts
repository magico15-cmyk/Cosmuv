import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const globalForSupabase = globalThis as unknown as {
  supabaseBrowserClient?: SupabaseClient;
};

export function createClient() {
  if (globalForSupabase.supabaseBrowserClient) {
    return globalForSupabase.supabaseBrowserClient;
  }

  const isVercelApp = typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app');
  const isLocalHost = typeof window !== 'undefined' && (window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1');

  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: (process.env.NODE_ENV === 'development' || isLocalHost || isVercelApp)
          ? undefined
          : `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cosmuv.com'}`,
      },
    }
  );

  if (typeof window !== 'undefined') {
    globalForSupabase.supabaseBrowserClient = client;
  }

  return client;
}
