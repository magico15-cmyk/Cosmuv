import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { checkRateLimit, recordFailedAttempt, resetAttempts } from "@/lib/security/rateLimiter";
import { loginSchema, sanitizeText } from "@/lib/security/validation";
import { getStoreUrl, getAccountsUrl } from "@/lib/domain";

export async function POST(req: NextRequest) {
  try {
    // 1. Resolve client IP for brute-force rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: rateCheck.error,
          remainingAttempts: 0,
          resetTime: rateCheck.resetTime,
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    // 2. Parse & Validate input schema using Zod
    const body = await req.json().catch(() => ({}));
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues?.[0]?.message || parseResult.error.message || "Invalid input parameters.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email: rawEmail, password, captchaToken } = parseResult.data;
    const email = sanitizeText(rawEmail).toLowerCase();

    // 3. Conditional Turnstile / Captcha Verification Check
    const requireCaptcha = process.env.NEXT_PUBLIC_REQUIRE_CAPTCHA === "true";
    if (requireCaptcha && !captchaToken) {
      return NextResponse.json(
        { error: "Please complete the human verification (Turnstile / Captcha) before proceeding." },
        { status: 400 }
      );
    }

    // If Captcha secret key is present in backend, verify token with Cloudflare / Google API
    if (requireCaptcha && captchaToken && process.env.CAPTCHA_SECRET_KEY) {
      try {
        // Ready for Turnstile / reCAPTCHA siteverify call
        const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.CAPTCHA_SECRET_KEY,
            response: captchaToken,
            remoteip: ip,
          }),
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          return NextResponse.json(
            { error: "Human verification failed. Please refresh and try again." },
            { status: 403 }
          );
        }
      } catch (captchaErr) {
        console.error("Captcha verification network error:", captchaErr);
      }
    }

    // 4. Authenticate against Supabase with secure server client (automatically sets HttpOnly, Secure, SameSite cookies)
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData?.user) {
      const attemptResult = recordFailedAttempt(ip);
      const errMsg = authError?.message || "Invalid email or password.";
      
      if (attemptResult.blocked) {
        return NextResponse.json(
          {
            error: `Too many failed login attempts. Your IP has been temporarily blocked for 15 minutes.`,
            remainingAttempts: 0,
            rateLimited: true,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: errMsg,
          remainingAttempts: attemptResult.remainingAttempts,
          warning: `Warning: ${attemptResult.remainingAttempts} attempt(s) remaining before temporary IP block.`,
        },
        { status: 401 }
      );
    }

    // 5. Success! Reset brute-force counter for this IP
    resetAttempts(ip);

    // 6. Resolve store context via service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";
    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { data: stores } = await supabaseAdmin
      .from("stores")
      .select("subdomain, status")
      .eq("user_id", authData.user.id);

    const store = stores && stores.length > 0 ? stores[0] : null;

    if (!store) {
      return NextResponse.json({
        success: true,
        redirectUrl: getAccountsUrl("/signup"),
        noStore: true,
      });
    }

    if (store.status === "pending") {
      await supabase.auth.signOut();
      return NextResponse.json(
        {
          error: "Your store is currently under review. We will notify you once it's approved.",
        },
        { status: 403 }
      );
    }

    const session = authData.session;
    const tokenQuery = session
      ? `?access_token=${encodeURIComponent(session.access_token)}&refresh_token=${encodeURIComponent(session.refresh_token)}`
      : "";

    const redirectUrl = `${getStoreUrl(store.subdomain, "/admin")}${tokenQuery}`;

    return NextResponse.json({
      success: true,
      redirectUrl,
      store,
    });
  } catch (error: any) {
    console.error("Login API route error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
