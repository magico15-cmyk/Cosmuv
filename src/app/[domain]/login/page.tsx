"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Session Isolation: Wipe out any previously stored session cookies or local tenant storage keys upon rendering
    try {
      const keysToRemove = [
        'cosmuv_store_name',
        'cosmuv_store_id',
        'cosmuv_store_currency',
        'cosmuv_dash_orders',
        'cosmuv_dash_earnings',
        'sello_store_name',
        'sello_store_id',
        'sello_store_currency',
        'sello_dash_orders',
        'sello_dash_earnings'
      ];
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      Object.keys(localStorage).forEach(key => {
        if (key.includes('store') || key.includes('dash_') || key.includes('order') || key.includes('earning')) {
          localStorage.removeItem(key);
        }
      });
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('store') || key.includes('dash_') || key.includes('order') || key.includes('earning')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (e) {}
  }, []);

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
      // Fetch the merchant's store strictly by user_id
      const { data: stores, error: storeError } = await supabase
        .from('stores')
        .select('subdomain, status')
        .eq('user_id', authData.user.id)
        .limit(1);

      const store = stores?.[0];

      if (storeError || !store) {
        window.location.href = '/admin';
        return;
      }

      const isLocalHost = window.location.hostname.includes('localhost') || window.location.hostname === '127.0.0.1';
      const isVercelApp = window.location.hostname.endsWith('.vercel.app');
      const rawRoot = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'cosmuv.com')
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '')
        .trim();
      const isMainLandingDomain = window.location.hostname === rawRoot || window.location.hostname === `www.${rawRoot}`;

      if (store.status === 'pending') {
        if (!isMainLandingDomain || isVercelApp) {
          window.location.href = '/holding-page';
          return;
        }
        const holdingUrl = isLocalHost 
          ? `http://localhost:3000/holding-page`
          : `https://${rawRoot}/holding-page`;
        window.location.href = holdingUrl;
        return;
      }

      // If approved or other status, go to their admin dashboard
      // If they are already on their store's domain or subdomain (or vercel preview), stay on this domain!
      const isOnStoreSubdomain = window.location.hostname.startsWith(`${store.subdomain}.`) || window.location.hostname === store.subdomain;
      if (isOnStoreSubdomain || isVercelApp) {
        window.location.href = '/admin';
        return;
      }

      const dashboardUrl = isLocalHost 
        ? `http://${store.subdomain}.localhost:3000/admin`
        : `https://${store.subdomain}.${rawRoot}/admin`;
      
      window.location.href = dashboardUrl;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[440px]">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-sm border border-gray-100 rounded-2xl">
          <div className="mb-8">
            <img src="/cosmuv-logo.png" alt="Cosmuv" className="h-10 w-auto mb-6 object-contain" />
            <h2 className="text-[22px] font-semibold text-gray-900">
              Log in to your account
            </h2>
            <p className="mt-1.5 text-[13px] text-gray-500 font-medium">
              Use your shared Cosmuv credentials
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
          </form>
        </div>
      </div>
    </div>
  );
}
