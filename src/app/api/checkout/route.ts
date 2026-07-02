import { NextRequest, NextResponse } from "next/server";
import { withTenant, TenantContext } from "@/lib/tenant/withTenant";

export const POST = withTenant(async (req: NextRequest, context: TenantContext) => {
  try {
    const orderData = await req.json();
    
    // 1. ANTI-BOT SPAM PROTECTION (Honeypot Technique)
    // If the hidden website_url field contains any text, an automated bot is submitting the form.
    if (orderData.website_url && String(orderData.website_url).trim().length > 0) {
      console.warn(`[ANTI-BOT SPAM BLOCKED] Honeypot triggered by IP [${context.ip}]. Dropping fake COD lead.`);
      // Return silent success so bot doesn't retry, without polluting merchant database
      return NextResponse.json({ success: true, order: { id: "bot_rejected", status: "blocked" } }, { status: 200 });
    }
    
    // STRICT TENANT ISOLATION:
    // We completely ignore any store_id the client might have maliciously passed.
    // Instead, we force the store_id to be the securely resolved tenant ID.
    const store_id = context.tenant.id;
    const ip = context.ip;
    const supabase = context.supabase;

    // 2. Fetch the store's max_orders_per_ip setting (we already have the store from context!)
    const store = context.tenant;
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

    // Check product stock
    let currentStock = null;
    let isTracked = false;
    const productId = orderData.product_id || (orderData.items && orderData.items.length > 0 ? orderData.items[0].product_id : null);

    if (productId) {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('inventory, stock')
        .eq('id', productId)
        .single();

      if (productError) {
        console.error("Error fetching product:", productError);
        return NextResponse.json({ error: "Failed to validate product." }, { status: 500 });
      }

      if (productData.inventory === 'Tracked') {
        isTracked = true;
        currentStock = Number(productData.stock || 0);
        if (currentStock <= 0) {
          return NextResponse.json({ error: "Product is out of stock." }, { status: 400 });
        }
      }
    }

    // 4. Insert the order
    const orderToInsert = {
      ...orderData,
      ip_address: ip,
      website_url: undefined, // Remove honeypot field before PostgreSQL insertion
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

    if (isTracked && currentStock !== null && productId) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: currentStock - 1 })
        .eq('id', productId);
        
      if (updateError) {
        console.error("Error updating stock:", updateError);
      }
    }

    return NextResponse.json({ success: true, order: insertedOrder }, { status: 200 });

  } catch (error: any) {
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
});
