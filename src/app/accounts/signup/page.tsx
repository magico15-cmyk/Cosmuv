"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStoreUrl, getAccountsUrl, getRootDomain } from "@/lib/domain";
import { ArrowRight, CheckCircle2, XCircle, Store, User, Mail, Lock, Loader2, Link as LinkIcon } from "lucide-react";

const RESERVED_HOSTNAMES = [
  "www", "admin", "api", "support", "portal", "cosmuv", "app", 
  "login", "signup", "dashboard", "billing", "settings", "store",
  "auth", "mail", "ftp", "cpanel", "webmail", "blog", "shop", "accounts"
];

export default function SignupPage() {
  const supabase = createClient();

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form Step 2
  const [storeName, setStoreName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");
  const [subdomainMessage, setSubdomainMessage] = useState("");

  const rootDomain = getRootDomain();

  // Subdomain Validation Effect
  useEffect(() => {
    if (step !== 2) return;
    
    if (!subdomain || subdomain.length < 3) {
      queueMicrotask(() => {
        setSubdomainStatus("idle");
        setSubdomainMessage("Must be at least 3 characters");
      });
      return;
    }

    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (cleanSubdomain !== subdomain) {
      queueMicrotask(() => {
        setSubdomain(cleanSubdomain);
      });
    }

    if (RESERVED_HOSTNAMES.includes(cleanSubdomain)) {
      queueMicrotask(() => {
        setSubdomainStatus("unavailable");
        setSubdomainMessage("This name is reserved.");
      });
      return;
    }

    queueMicrotask(() => {
      setSubdomainStatus("checking");
      setSubdomainMessage("Checking availability...");
    });

    const checkAvailability = async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('id')
        .eq('subdomain', cleanSubdomain)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking subdomain:", error);
      }

      if (data) {
        setSubdomainStatus("unavailable");
        setSubdomainMessage("This subdomain is already taken.");
      } else {
        setSubdomainStatus("available");
        setSubdomainMessage("Subdomain is available!");
      }
    };

    const timer = setTimeout(() => {
      checkAvailability();
    }, 500);

    return () => clearTimeout(timer);
  }, [subdomain, step, supabase]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail.endsWith("@gmail.com") && !normalizedEmail.endsWith("@googlemail.com")) {
      setError("We currently only accept Google email addresses (@gmail.com).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!storeName || !subdomain) {
      setError("Please fill in all fields.");
      return;
    }

    if (subdomainStatus !== "available") {
      setError("Please choose a valid and available subdomain.");
      return;
    }

    setIsLoading(true);

    try {
      const callbackUrl = `${getAccountsUrl('/auth/callback')}?next=/login`;

      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: callbackUrl,
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to create user account.");
      }

      if (authData.user.identities && authData.user.identities.length === 0) {
        setStep(1);
        throw new Error("This email is already registered. Please log in instead.");
      }

      // 2. Execute Database Insert into stores table via template cloning generator endpoint
      const exactStoreName = storeName.trim();
      const exactSubdomain = subdomain.trim().toLowerCase();

      const res = await fetch('/api/store/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authData.user.id,
          subdomain: exactSubdomain,
          storeName: exactStoreName,
          status: 'approved',
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to create store entry.");
      }

      // 3. Check if Supabase requires email verification
      if (!authData.session) {
        setIsLoading(false);
        setStep(3);
        return;
      }

      // 4. Navigate cleanly directly to their new admin path on store subdomain
      const redirectUrl = getStoreUrl(exactSubdomain, '/admin');
      window.location.href = redirectUrl;
    } catch (err: unknown) {
      console.error(err);
      let msg = (err instanceof Error ? err.message : null) || "An error occurred during signup.";
      if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("over_email_send_rate_limit")) {
        msg = "Supabase email rate limit exceeded! Please try using a different test email or temporarily turn off 'Confirm email' in your Supabase Auth dashboard.";
      }
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-slate-900 selection:text-white">
      <div className="mx-auto w-full max-w-[480px]">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-sm border border-gray-100 rounded-2xl">
          <div className="mb-8">
            <img src="/cosmuv-logo.png" alt="Cosmuv" className="h-10 w-auto mb-6 object-contain" />
            <h2 className="text-[22px] font-semibold text-gray-900">
              {step === 1 ? "Create your account" : step === 2 ? "Configure your store" : "Check your email"}
            </h2>
            <p className="mt-1.5 text-[13px] text-gray-500 font-medium">
              {step === 3 ? "One last step to launch your store" : "Join the Cosmuv platform"}
            </p>
          </div>
            
          {step !== 3 && (
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors duration-300 ${step === 1 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                1
              </div>
              <div className={`h-1 w-12 rounded-full transition-colors duration-300 ${step === 2 ? "bg-slate-900" : "bg-slate-100"}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors duration-300 ${step === 2 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}>
                2
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl font-medium flex items-center gap-2">
              <XCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-[15px] transition-all shadow-sm active:scale-[0.98]"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : step === 2 ? (
            <form onSubmit={handleStep2Submit} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 ml-1">Store Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium"
                    placeholder="My Awesome Brand"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 ml-1">Store URL</label>
                <div className="relative flex rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <LinkIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-l-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-medium ${
                      subdomainStatus === "available" ? "border-green-300 ring-green-100" :
                      subdomainStatus === "unavailable" ? "border-red-300 ring-red-100 text-red-900" : ""
                    }`}
                    placeholder="mybrand"
                  />
                  <div className="flex items-center px-4 bg-slate-100 border border-l-0 border-slate-200 rounded-r-xl text-slate-500 font-medium whitespace-nowrap">
                    .{rootDomain}
                  </div>
                </div>
                <div className="h-5 flex items-center mt-1.5 ml-1">
                  {subdomainStatus === "checking" && (
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> {subdomainMessage}
                    </div>
                  )}
                  {subdomainStatus === "available" && (
                    <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> {subdomainMessage}
                    </div>
                  )}
                  {subdomainStatus === "unavailable" && (
                    <div className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                      <XCircle className="w-4 h-4" /> {subdomainMessage}
                    </div>
                  )}
                  {subdomainStatus === "idle" && subdomain.length > 0 && subdomain.length < 3 && (
                    <div className="text-amber-600 text-sm font-medium">
                      {subdomainMessage}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-[15px] transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || subdomainStatus !== "available"}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-[15px] transition-all shadow-sm active:scale-[0.98]"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Creating Store...</>
                  ) : (
                    "Launch My Store"
                  )}
                </button>
              </div>
            </form>
          ) : null}

          {step === 3 && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Confirm Your Email Address</h3>
                <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                  We sent a confirmation link to <span className="font-semibold text-gray-900">{email}</span>. 
                  Please click the link inside to activate your account and access your dashboard for <span className="font-semibold text-gray-900">{storeName}</span>!
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-left text-xs text-amber-800 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  💡 Can&apos;t find the email?
                </p>
                <p>Be sure to check your Spam or Promotions folder. Once confirmed, you can log directly into your admin panel.</p>
              </div>
              <div className="pt-2">
                <a
                  href={getAccountsUrl('/login')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-[15px] transition-all shadow-sm active:scale-[0.98]"
                >
                  Go to Login <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
            
          {step !== 3 && (
            <div className="mt-6 text-center">
              <p className="text-[14px] text-gray-500 font-medium">
                Already have an account?{" "}
                <a href={getAccountsUrl('/login')} className="font-semibold text-gray-900 hover:text-slate-700 transition-colors">
                  Log in
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
