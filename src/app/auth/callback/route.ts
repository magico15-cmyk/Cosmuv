import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAccountsUrl } from '@/lib/domain';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/login';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(getAccountsUrl(next));
    }
  }

  // If code exchange fails, return the user to the login page on accounts
  return NextResponse.redirect(getAccountsUrl('/login?error=Verification+failed+or+link+expired.'));
}
