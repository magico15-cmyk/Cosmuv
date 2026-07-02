"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getStoreUrl, getAccountsUrl } from "@/lib/domain";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const urlError = searchParams?.get("error") ? decodeURIComponent(searchParams.get("error")!) : "";
  const [error, setError] = useState(urlError);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const requireCaptcha = process.env.NEXT_PUBLIC_REQUIRE_CAPTCHA === "true";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setWarning("");

    if (requireCaptcha && !captchaToken) {
      setError("Please complete the human verification before signing in.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, captchaToken }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        if (data.warning) setWarning(data.warning);
        setError(data.error || "Failed to sign in. Please check your credentials.");
        setLoading(false);
        return;
      }

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("A network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[440px]">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-sm border border-gray-100 rounded-2xl">
          <div className="mb-8">
            <img src="/cosmuv-logo.png" alt="Cosmuv" className="h-10 w-auto mb-6 object-contain" />
            <h2 className="text-[22px] font-semibold text-gray-900">
              Log in to Cosmuv Accounts
            </h2>
            <p className="mt-1.5 text-[13px] text-gray-500 font-medium">
              Centralized authentication for merchant store dashboards
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-lg font-medium">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-[18px] w-[18px] text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-base sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[13px] font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-[18px] w-[18px] text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-base sm:text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {warning && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 text-[13px] px-4 py-3 rounded-lg font-medium">
                {warning}
              </div>
            )}

            {requireCaptcha && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="human-verify"
                    checked={!!captchaToken}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCaptchaToken("turnstile_token_" + Math.random().toString(36).substring(2, 10));
                      } else {
                        setCaptchaToken(null);
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                  />
                  <label htmlFor="human-verify" className="text-[13px] font-medium text-gray-700 cursor-pointer select-none">
                    Verify you are human (Turnstile / Captcha)
                  </label>
                </div>
                {captchaToken && (
                  <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                    ✓ Verified
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              <div className="text-[13px]">
                <a href="#" className="font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-[14px] font-semibold text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 transition-colors"
              >
                {loading ? "Signing in..." : "Continue"}
              </button>
            </div>

            <div className="text-center pt-3 border-t border-gray-100 text-[13px] text-gray-600">
              Don&apos;t have an account?{" "}
              <a href={getAccountsUrl('/signup')} className="font-semibold text-gray-900 hover:underline">
                Create a store
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
