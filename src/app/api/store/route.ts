import { NextRequest, NextResponse } from "next/server";
import { withTenant, TenantContext } from "@/lib/tenant/withTenant";
import { encryptStoreSettings, decryptStoreSettings } from "@/lib/security/encryption";
import { withApiRateLimit } from "@/lib/security/apiRateLimiter";

export const GET = withTenant(async (req: NextRequest, context: TenantContext) => {
  // Automatically decrypt any stored sensitive integration credentials at runtime
  const decryptedStore = decryptStoreSettings(context.tenant);
  return NextResponse.json({ store: decryptedStore });
});

export const PATCH = withApiRateLimit(
  withTenant(async (req: NextRequest, context: TenantContext) => {
    try {
      const body = await req.json();

      // Protect immutable identity & ownership columns
      const protectedKeys = ["id", "user_id", "subdomain", "created_at", "status", "stripe_account_id", "custom_domain"];
      const updates: Record<string, any> = {};

      for (const [key, value] of Object.entries(body)) {
        if (!protectedKeys.includes(key)) {
          updates[key] = value;
        }
      }

      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "No valid update fields provided" }, { status: 400 });
      }

      // Automatically encrypt any sensitive integration credentials (pixels, API keys, tracking tokens) before storing in DB
      const encryptedUpdates = encryptStoreSettings(updates);

      // 1. Extract Tenant & Enforce Strict Update Target matching resolved tenant id and subdomain
      // 2. Verified Session Authorization is handled by withTenant wrapper
      const { data, error } = await context.supabase
        .from("stores")
        .update(encryptedUpdates)
        .eq("id", context.tenant.id)
        .eq("subdomain", context.tenant.subdomain)
        .select()
        .single();

      if (error) throw error;

      // Decrypt for response so admin UI stays seamless
      const decryptedData = decryptStoreSettings(data);

      return NextResponse.json({ success: true, store: decryptedData });
    } catch (error: any) {
      console.error("Error updating store:", error);
      return NextResponse.json({ error: "Failed to update store: " + (error.message || error) }, { status: 500 });
    }
  }),
  { action: "store_settings_update", maxRequests: 30, windowMs: 60 * 1000 }
);
