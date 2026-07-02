import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Use service role to bypass RLS and guarantee store lookup by user_id
    const { data: stores, error } = await supabaseAdmin
      .from("stores")
      .select("subdomain, status")
      .eq("user_id", userId);

    if (error) {
      console.error("Error checking store via admin:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const store = stores && stores.length > 0 ? stores[0] : null;

    return NextResponse.json({ success: true, store });
  } catch (err: unknown) {
    console.error("Server error resolving store:", err);
    return NextResponse.json({ error: "Failed to resolve store" }, { status: 500 });
  }
}
