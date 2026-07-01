import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, subdomain, storeName } = body;

    if (!userId || !subdomain || !storeName) {
      return NextResponse.json(
        { error: "userId, subdomain, and storeName are required." },
        { status: 400 }
      );
    }

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

    // Check if store already exists for this subdomain
    const { data: existingStore } = await supabaseAdmin
      .from("stores")
      .select("id")
      .eq("subdomain", subdomain)
      .maybeSingle();

    if (existingStore) {
      return NextResponse.json(
        { error: "This subdomain is already taken." },
        { status: 409 }
      );
    }

    // Insert the store cleanly using service role (bypassing RLS or session timing issues)
    const { data: store, error: storeError } = await supabaseAdmin
      .from("stores")
      .insert({
        subdomain: subdomain,
        store_name: storeName,
        user_id: userId,
        status: "pending",
      })
      .select()
      .single();

    if (storeError) {
      console.error("Error creating store in DB:", storeError);
      return NextResponse.json(
        { error: storeError.message || "Failed to create store entry." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, store });
  } catch (error: any) {
    console.error("Store creation API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error." },
      { status: 500 }
    );
  }
}
