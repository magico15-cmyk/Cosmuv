import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const globalForSupabase = globalThis as unknown as {
  supabaseBrowserClient?: SupabaseClient;
};

export function createClient() {
  if (globalForSupabase.supabaseBrowserClient) {
    return globalForSupabase.supabaseBrowserClient;
  }

  const rawRoot = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cosmuv.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .trim();

  let cookieDomain: string | undefined = undefined;
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (!hostname.includes('localhost') && 
        hostname !== '127.0.0.1' && 
        !hostname.endsWith('.vercel.app') &&
        (hostname === rawRoot || hostname.endsWith(`.${rawRoot}`))) {
      cookieDomain = `.${rawRoot}`;
    }
  }

  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        domain: cookieDomain,
      },
    }
  );

  if (typeof window !== 'undefined') {
    globalForSupabase.supabaseBrowserClient = client;
  }

  return client;
}
