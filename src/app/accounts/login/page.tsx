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
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData?.user) {
      // 1. Fetch merchant's store strictly by user_id via admin endpoint to bypass RLS and cookie races
      let store: { subdomain: string; status: string } | null = null;
      try {
        const res = await fetch('/api/auth/resolve-store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: authData.user.id }),
        });
        const resData = await res.json();
        if (res.ok && resData.success && resData.store) {
          store = resData.store;
        }
      } catch (err) {
        console.error("Error resolving store via admin endpoint:", err);
      }

      // If server resolve failed, fallback to client query with 500ms retry
      if (!store) {
        let { data: stores, error: storeError } = await supabase
          .from('stores')
          .select('subdomain, status')
          .eq('user_id', authData.user.id);

        if (!storeError && (!stores || stores.length === 0)) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const retryResult = await supabase
            .from('stores')
            .select('subdomain, status')
            .eq('user_id', authData.user.id);
          stores = retryResult.data;
          storeError = retryResult.error;
        }

        if (storeError) {
          console.error("Error fetching store:", storeError);
          setError("Unable to retrieve store information. Please try again.");
          setLoading(false);
          return;
        }

        store = stores && stores.length > 0 ? stores[0] : null;
      }

      // 3. Safe fallback: ONLY route to /signup if explicitly confirmed no store exists for this user_id
      if (!store) {
        window.location.href = getAccountsUrl('/signup');
        return;
      }

      const session = authData?.session;
      const tokenQuery = session
        ? `?access_token=${encodeURIComponent(session.access_token)}&refresh_token=${encodeURIComponent(session.refresh_token)}`
        : '';

      if (store.status === 'pending') {
        await supabase.auth.signOut();
        setError("Your store is currently under review. We will notify you once it's approved.");
        setLoading(false);
        return;
      }

      window.location.href = `${getStoreUrl(store.subdomain, '/admin')}${tokenQuery}`;
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
