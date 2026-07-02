import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAccountsUrl } from "@/lib/domain";

export async function GET(_request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const loginUrl = getAccountsUrl('/login');
  return NextResponse.redirect(new URL(loginUrl));
}

export async function POST(_request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const loginUrl = getAccountsUrl('/login');
  return NextResponse.redirect(new URL(loginUrl));
}
