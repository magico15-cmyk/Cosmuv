import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { checkRateLimit, recordFailedAttempt, resetAttempts } from "@/lib/security/rateLimiter";
import { signupSchema, sanitizeText } from "@/lib/security/validation";
import { getAccountsUrl } from "@/lib/domain";

const RESERVED_HOSTNAMES = [
  "www", "admin", "api", "support", "portal", "cosmuv", "app", 
  "login", "signup", "dashboard", "billing", "settings", "store",
  "auth", "mail", "ftp", "cpanel", "webmail", "blog", "shop", "accounts"
];

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

    // 2. Parse & Validate input schema using Zod (enforces strong password & Google email)
    const body = await req.json().catch(() => ({}));
    const parseResult = signupSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues?.[0]?.message || parseResult.error.message || "Invalid input parameters.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name: rawName, email: rawEmail, password, storeName: rawStoreName, subdomain: rawSubdomain, captchaToken } = parseResult.data;
    const name = sanitizeText(rawName);
    const email = sanitizeText(rawEmail).toLowerCase();
    const storeName = sanitizeText(rawStoreName);
    const subdomain = sanitizeText(rawSubdomain).toLowerCase();

    // 3. Conditional Turnstile / Captcha Verification Check
    const requireCaptcha = process.env.NEXT_PUBLIC_REQUIRE_CAPTCHA === "true";
    if (requireCaptcha && !captchaToken) {
      return NextResponse.json(
        { error: "Please complete the human verification (Turnstile / Captcha) before proceeding." },
        { status: 400 }
      );
    }

    if (requireCaptcha && captchaToken && process.env.CAPTCHA_SECRET_KEY) {
      try {
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

    // 4. Subdomain & Reserved Hostname Checks
    if (RESERVED_HOSTNAMES.includes(subdomain)) {
      return NextResponse.json({ error: "This subdomain name is reserved." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";
    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const { data: existingStore } = await supabaseAdmin
      .from("stores")
      .select("id")
      .eq("subdomain", subdomain)
      .maybeSingle();

    if (existingStore) {
      return NextResponse.json({ error: "This subdomain is already taken." }, { status: 409 });
    }

    // 5. Authenticate / Create User against Supabase with server client (sets secure cookies)
    const supabase = await createClient();
    const callbackUrl = `${getAccountsUrl("/auth/callback")}?next=/login`;

    let userId: string | undefined = undefined;
    let session = null;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: callbackUrl,
      },
    });

    const isAlreadyRegistered =
      (authData?.user?.identities && authData.user.identities.length === 0) ||
      authError?.message?.toLowerCase().includes("already registered") ||
      authError?.message?.toLowerCase().includes("user already exists") ||
      authError?.status === 422 ||
      authError?.code === "user_already_exists";

    if (isAlreadyRegistered) {
      // Try signing in existing user to complete store setup
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData?.user) {
        const attemptResult = recordFailedAttempt(ip);
        return NextResponse.json(
          {
            error: "This email is already registered. Please enter your correct password or log in first.",
            remainingAttempts: attemptResult.remainingAttempts,
          },
          { status: 401 }
        );
      }
      userId = signInData.user.id;
      session = signInData.session;
    } else {
      if (authError || !authData.user) {
        const attemptResult = recordFailedAttempt(ip);
        const errMsg = authError?.message || "Failed to create user account.";
        return NextResponse.json(
          { error: errMsg, remainingAttempts: attemptResult.remainingAttempts },
          { status: 400 }
        );
      }
      userId = authData.user.id;
      session = authData.session;
    }

    // 6. Success! Reset brute-force counter for this IP
    resetAttempts(ip);

    // 7. Execute Database Insert via internal store creation API
    const createStoreRes = await fetch(new URL("/api/store/create", req.url).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        subdomain: subdomain,
        storeName: storeName,
        status: "pending",
      }),
    });

    const createStoreData = await createStoreRes.json().catch(() => ({}));
    if (!createStoreRes.ok || !createStoreData.success) {
      return NextResponse.json(
        { error: createStoreData.error || "Failed to create store entry." },
        { status: 500 }
      );
    }

    // 8. Handle pending review status
    await supabase.auth.signOut();
    const redirectUrl = getAccountsUrl(
      "/login?error=Your+store+is+currently+under+review.+We+will+notify+you+once+it%27s+approved."
    );

    return NextResponse.json({
      success: true,
      redirectUrl,
    });
  } catch (error: any) {
    console.error("Signup API route error:", error);
    let msg = error.message || "An unexpected error occurred during signup.";
    if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("over_email_send_rate_limit")) {
      msg = "Supabase email rate limit exceeded! Please try using a different test email.";
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
