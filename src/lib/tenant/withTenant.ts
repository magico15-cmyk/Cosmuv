import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Single admin client instance
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});

export interface TenantContext {
  tenant: {
    id: string;
    subdomain: string;
    store_name: string;
    user_id?: string;
    status?: string;
    max_orders_per_ip?: number | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  supabase: SupabaseClient;
  ip: string;
}

type TenantRouteHandler = (
  req: NextRequest,
  context: TenantContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routeContext?: any
) => Promise<NextResponse> | NextResponse;

/**
 * Standard route handler wrapper that strictly isolates tenants.
 * It dynamically extracts the subdomain, looks up the tenant in the database,
 * and passes the verified tenant object to the underlying API route.
 */
export function withTenant(handler: TenantRouteHandler) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (req: NextRequest, routeContext?: any) => {
    try {
      // 1. Extract tenant subdomain from the secure header set by our middleware
      const subdomain = req.headers.get("x-tenant-subdomain");

      if (!subdomain) {
        return NextResponse.json({ error: "Missing tenant context" }, { status: 400 });
      }

      // 2. Extract IP address for rate limiting or tracking
      const ip = req.headers.get("x-forwarded-for")?.split(',')[0].trim() || "unknown";

      // 3. Extract authenticated user if available
      let authUser = null;
      try {
        const { createClient: createServerSupabase } = await import('@/lib/supabase/server');
        const supabaseServer = await createServerSupabase();
        const { data: { user } } = await supabaseServer.auth.getUser();
        authUser = user;
      } catch {
        // Ignore auth extraction errors
      }

      // 4. Fetch strictly isolated tenant data by subdomain
      if (!subdomain) {
        return NextResponse.json({ error: "Missing tenant context" }, { status: 400 });
      }

      const { data: store, error: storeError } = await supabaseAdmin
        .from('stores')
        .select('*')
        .eq('subdomain', subdomain)
        .maybeSingle();

      if (storeError || !store) {
        console.error(`Tenant fetch error for subdomain [${subdomain}]:`, storeError);
        return NextResponse.json({ error: "Invalid tenant store for this subdomain" }, { status: 404 });
      }

      const isAdminApi = req.nextUrl.pathname.startsWith('/api/store') ||
                         req.nextUrl.pathname.startsWith('/api/products') ||
                         req.nextUrl.pathname.startsWith('/api/orders') ||
                         req.nextUrl.pathname.startsWith('/api/staff') ||
                         req.nextUrl.pathname.startsWith('/api/customers') ||
                         req.nextUrl.pathname.startsWith('/api/upload');

      if (isAdminApi) {
        if (!authUser) {
          return NextResponse.json({ error: "Unauthorized: Authentication session required for admin operations." }, { status: 401 });
        }
        if (authUser.id !== store.user_id) {
          console.warn(`[SECURITY ALERT] Unauthorized tenant access! User [${authUser.id}] attempted to mutate/access store [${store.id}] owned by [${store.user_id}].`);
          return NextResponse.json({ error: "Forbidden: You do not own or have permission to access this store." }, { status: 403 });
        }
      }

      // 4. Build isolated context
      const tenantContext: TenantContext = {
        tenant: store,
        supabase: supabaseAdmin, // Note: In complex RLS scenarios, you'd impersonate the tenant here.
        ip
      };

      // 5. Execute handler with verified context
      return await handler(req, tenantContext, routeContext);
      
    } catch (error) {
      console.error("Critical Tenant Isolation Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}
