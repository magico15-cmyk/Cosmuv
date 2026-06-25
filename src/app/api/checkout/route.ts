import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for secure server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    const { store_id } = orderData;

    if (!store_id) {
      return NextResponse.json({ error: "Missing store_id" }, { status: 400 });
    }

    // 1. Extract the real IP address
    const ip = req.headers.get("x-forwarded-for")?.split(',')[0].trim() || req.ip || "unknown";

    // 2. Fetch the store's max_orders_per_ip setting
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('max_orders_per_ip')
      .eq('id', store_id)
      .single();

    if (storeError) {
      console.error("Error fetching store settings:", storeError);
      return NextResponse.json({ error: "Failed to fetch store settings." }, { status: 500 });
    }

    // 3. Check rate limit if configured
    if (store && store.max_orders_per_ip) {
      // Calculate time 24 hours ago
      const yesterday = new Date();
      yesterday.setHours(yesterday.getHours() - 24);
      const yesterdayISO = yesterday.toISOString();

      // Query number of orders by this IP in the last 24 hours for this store
      const { count, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', store_id)
        .eq('ip_address', ip)
        .gte('created_at', yesterdayISO);

      if (countError) {
        console.error("Error counting previous orders:", countError);
        return NextResponse.json({ error: "Internal validation error." }, { status: 500 });
      }

      if (count !== null && count >= store.max_orders_per_ip) {
        // Block the order
        return NextResponse.json(
          { error: "You have reached the maximum number of allowed order attempts for today." },
          { status: 429 }
        );
      }
    }

    // 4. Insert the order
    const orderToInsert = {
      ...orderData,
      ip_address: ip,
      // Ensure we don't accidentally override system fields if sent from client
      created_at: undefined, 
      id: undefined
    };
    
    // Remove undefined properties
    Object.keys(orderToInsert).forEach(key => orderToInsert[key] === undefined && delete orderToInsert[key]);

    const { data: insertedOrder, error: insertError } = await supabase
      .from('orders')
      .insert([orderToInsert])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting order:", insertError);
      return NextResponse.json({ error: "Failed to process order." }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: insertedOrder }, { status: 200 });

  } catch (error: any) {
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
