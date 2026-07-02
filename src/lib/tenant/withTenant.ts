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
    [key: string]: any;
  };
  supabase: SupabaseClient;
  ip: string;
}

type TenantRouteHandler = (
  req: NextRequest,
  context: TenantContext,
  routeContext?: any
) => Promise<NextResponse> | NextResponse;

/**
 * Standard route handler wrapper that strictly isolates tenants.
 * It dynamically extracts the subdomain, looks up the tenant in the database,
 * and passes the verified tenant object to the underlying API route.
 */
export function withTenant(handler: TenantRouteHandler) {
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
      } catch (e) {}

      // 4. Fetch strictly isolated tenant data
      let storeQuery = supabaseAdmin.from('stores').select('*');
      
      const isAdminApi = req.nextUrl.pathname.startsWith('/api/store') ||
                         req.nextUrl.pathname.startsWith('/api/products') ||
                         req.nextUrl.pathname.startsWith('/api/orders') ||
                         req.nextUrl.pathname.startsWith('/api/staff') ||
                         req.nextUrl.pathname.startsWith('/api/customers') ||
                         req.nextUrl.pathname.startsWith('/api/upload');

      if (authUser && isAdminApi) {
        // STRICT USER-TO-STORE MAPPING: Filter strictly by the authenticated user's ID
        storeQuery = storeQuery.eq('user_id', authUser.id);
      } else if (subdomain) {
        storeQuery = storeQuery.eq('subdomain', subdomain);
      } else {
        return NextResponse.json({ error: "Missing tenant context" }, { status: 400 });
      }

      const { data: store, error: storeError } = await storeQuery.maybeSingle();

      if (storeError || !store) {
        console.error(`Tenant fetch error for subdomain [${subdomain}]:`, storeError);
        return NextResponse.json({ error: "Invalid tenant" }, { status: 404 });
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
