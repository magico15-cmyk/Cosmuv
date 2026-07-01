import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

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
        domain: (process.env.NODE_ENV === 'development' || process.env.VERCEL_URL?.endsWith('.vercel.app') || process.env.NEXT_PUBLIC_ROOT_DOMAIN?.includes('localhost') || process.env.NEXT_PUBLIC_ROOT_DOMAIN?.endsWith('.vercel.app'))
          ? undefined
          : `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cosmuv.com'}`,
      }
    }
  );
}
