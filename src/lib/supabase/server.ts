import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  const rawRoot = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cosmuv.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .trim();
  const vercelUrl = process.env.VERCEL_URL || '';

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      cookieOptions: {
        domain: (process.env.NODE_ENV === 'development' || vercelUrl.endsWith('.vercel.app') || rawRoot.includes('localhost') || rawRoot.endsWith('.vercel.app'))
          ? undefined
          : `.${rawRoot}`,
      }
    }
  );
}
