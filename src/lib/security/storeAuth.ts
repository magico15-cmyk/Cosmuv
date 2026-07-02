import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export interface SecureStoreContext {
  storeId: string;
  userId: string;
  store: Record<string, any>;
  supabase: SupabaseClient;
}

/**
 * Mandatory validation checkpoint to verify if a user owns a specific store.
 * Cross-references the active session user ID against the database.
 * Never trusts client-side payloads blindly.
 */
export async function assertStoreOwnership(storeIdOrSubdomain: string, userId: string): Promise<Record<string, any>> {
  if (!storeIdOrSubdomain || !userId) {
    throw new Error("Unauthorized: Missing store identifier or user session.");
  }

  // Check by UUID or subdomain
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(storeIdOrSubdomain);
  const column = isUuid ? "id" : "subdomain";

  const { data: store, error } = await supabaseAdmin
    .from("stores")
    .select("*")
    .eq(column, storeIdOrSubdomain)
    .maybeSingle();

  if (error || !store) {
    throw new Error("Store not found or invalid identifier.");
  }

  if (store.user_id !== userId) {
    console.warn(`[SECURITY ALERT] Unauthorized access attempt! User [${userId}] attempted to access/mutate Store [${store.id}] owned by [${store.user_id}].`);
    throw new Error("Forbidden: You do not own or have permission to access this store data.");
  }

  return store;
}

/**
 * Secure Server Action Wrapper.
 * Injects mandatory authorization & store ownership checkpoints into Server Actions.
 */
export function withSecureStoreAction<T, R>(
  action: (context: SecureStoreContext, payload: T) => Promise<R>
) {
  return async (payload: T & { store_id?: string; subdomain?: string }): Promise<R> => {
    // 1. Verify active session user ID from Supabase auth
    const supabaseServer = await createServerSupabase();
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized: Authentication required to perform this action.");
    }

    // 2. Identify target store from payload (never trust client payload blindly without database cross-checking)
    const targetStoreIdentifier = payload.store_id || payload.subdomain;
    if (!targetStoreIdentifier) {
      throw new Error("Bad Request: Target store_id or subdomain is required.");
    }

    // 3. Mandatory Checkpoint: Validate ownership against PostgreSQL database
    const store = await assertStoreOwnership(targetStoreIdentifier, user.id);

    // 4. Execute action with verified context (forcing storeId to verified database ID)
    return await action(
      {
        storeId: store.id,
        userId: user.id,
        store,
        supabase: supabaseAdmin,
      },
      {
        ...payload,
        store_id: store.id, // Strictly override any malicious store_id attempt
      }
    );
  };
}

/**
 * Secure API Route Wrapper for store admin operations (order retrieval, product manipulation, settings updates).
 */
export function withSecureStoreApi(
  handler: (req: NextRequest, context: SecureStoreContext, routeParams?: any) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest, routeParams?: any): Promise<NextResponse> => {
    try {
      // 1. Verify user session
      const supabaseServer = await createServerSupabase();
      const { data: { user }, error: authError } = await supabaseServer.auth.getUser();

      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized: Active session required." }, { status: 401 });
      }

      // 2. Extract target store identifier from headers, query params, or JSON body
      const subdomainHeader = req.headers.get("x-tenant-subdomain");
      const urlStoreId = req.nextUrl.searchParams.get("store_id") || req.nextUrl.searchParams.get("subdomain");
      
      let bodyStoreId = null;
      if (req.method !== "GET" && req.method !== "HEAD") {
        try {
          const clone = req.clone();
          const json = await clone.json();
          bodyStoreId = json.store_id || json.subdomain;
        } catch {
          // Ignore parse errors if body is not JSON
        }
      }

      const targetIdentifier = subdomainHeader || urlStoreId || bodyStoreId;
      if (!targetIdentifier) {
        return NextResponse.json({ error: "Bad Request: Missing store context or identifier." }, { status: 400 });
      }

      // 3. Mandatory Checkpoint: Cross-reference active user against PostgreSQL store ownership
      let store;
      try {
        store = await assertStoreOwnership(targetIdentifier, user.id);
      } catch (err: any) {
        const status = err.message.includes("Forbidden") ? 403 : 404;
        return NextResponse.json({ error: err.message }, { status });
      }

      // 4. Invoke API handler with verified, immutable context
      return await handler(req, {
        storeId: store.id,
        userId: user.id,
        store,
        supabase: supabaseAdmin,
      }, routeParams);
    } catch (err: any) {
      console.error("Secure Store API Checkpoint Error:", err);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}
