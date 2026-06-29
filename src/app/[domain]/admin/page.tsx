"use client";
import { useState, useEffect } from "react";
import { CubeIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const [storeName, setStoreName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [orderStats, setOrderStats] = useState([
    { label: "Today", value: "0" },
    { label: "Yesterday", value: "0" },
    { label: "This week", value: "0" },
    { label: "This month", value: "0" },
    { label: "This year", value: "0" },
    { label: "All time", value: "0" },
  ]);

  const [earningsStats, setEarningsStats] = useState([
    { label: "Today", value: "0.00" },
    { label: "Yesterday", value: "0.00" },
    { label: "This week", value: "0.00" },
    { label: "This month", value: "0.00" },
    { label: "This year", value: "0.00" },
    { label: "All time", value: "0.00" },
  ]);

  // Instantly show cached data while fresh data loads in background
  useEffect(() => {
    const cachedName = localStorage.getItem('cosmuv_store_name');
    if (cachedName) setStoreName(cachedName);
    
    try {
      const cachedOrders = localStorage.getItem('cosmuv_dash_orders');
      const cachedEarnings = localStorage.getItem('cosmuv_dash_earnings');
      if (cachedOrders && cachedEarnings) {
        setOrderStats(JSON.parse(cachedOrders));
        setEarningsStats(JSON.parse(cachedEarnings));
        setIsLoading(false); // Hide spinner immediately if we have cached data
      }
    } catch {}
  }, []);

  useEffect(() => {
    async function fetchStoreInfo() {
      try {
        const res = await fetch("/api/store");
        if (res.ok) {
          const { store } = await res.json();
          if (store) {
            setStoreName(store.store_name || "");
            if (store.store_name) localStorage.setItem('cosmuv_store_name', store.store_name);
            if (store.id) localStorage.setItem('cosmuv_store_id', store.id);
            if (store.currency) localStorage.setItem('cosmuv_store_currency', store.currency);
            return store;
          }
        }
      } catch (e) {
        console.error("Failed to load store info:", e);
      }
      return null;
    }

    async function fetchOrders(storeId: string, currency: string) {
      if (!storeId) return;
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('orders').select('created_at, total_amount').eq('store_id', storeId);
        
        if (error) throw error;

        // Calculate stats
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const day = now.getDay() || 7;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - day + 1);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const isSameDay = (d1: Date, d2: Date) => 
          d1.getDate() === d2.getDate() && 
          d1.getMonth() === d2.getMonth() && 
          d1.getFullYear() === d2.getFullYear();

        let counts = { today: 0, yesterday: 0, week: 0, month: 0, year: 0, all: 0 };
        let sums = { today: 0, yesterday: 0, week: 0, month: 0, year: 0, all: 0 };

        if (data) {
          data.forEach((o: any) => {
            const d = new Date(o.created_at);
            const val = parseFloat(o.total_amount) || 0;
            
            counts.all++;
            sums.all += val;

            if (isSameDay(d, today)) {
              counts.today++;
              sums.today += val;
            } else if (isSameDay(d, yesterday)) {
              counts.yesterday++;
              sums.yesterday += val;
            }
            
            if (d >= startOfWeek) { counts.week++; sums.week += val; }
            if (d >= startOfMonth) { counts.month++; sums.month += val; }
            if (d >= startOfYear) { counts.year++; sums.year += val; }
          });
        }

        const formatCurrency = (val: number) => `${currency} ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        const newOrderStats = [
          { label: "Today", value: counts.today.toString() },
          { label: "Yesterday", value: counts.yesterday.toString() },
          { label: "This week", value: counts.week.toString() },
          { label: "This month", value: counts.month.toString() },
          { label: "This year", value: counts.year.toString() },
          { label: "All time", value: counts.all.toString() },
        ];

        const newEarningsStats = [
          { label: "Today", value: formatCurrency(sums.today) },
          { label: "Yesterday", value: formatCurrency(sums.yesterday) },
          { label: "This week", value: formatCurrency(sums.week) },
          { label: "This month", value: formatCurrency(sums.month) },
          { label: "This year", value: formatCurrency(sums.year) },
          { label: "All time", value: formatCurrency(sums.all) },
        ];

        setOrderStats(newOrderStats);
        setEarningsStats(newEarningsStats);

        localStorage.setItem('cosmuv_dash_orders', JSON.stringify(newOrderStats));
        localStorage.setItem('cosmuv_dash_earnings', JSON.stringify(newEarningsStats));

      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    async function loadDashboard() {
      // Only show spinner if we don't have cached data
      if (!localStorage.getItem('cosmuv_dash_orders')) {
        setIsLoading(true);
      }
      
      const cachedStoreId = localStorage.getItem('cosmuv_store_id');
      const cachedCurrency = localStorage.getItem('cosmuv_store_currency') || "MAD";

      // 1. Kick off store info fetch
      const storePromise = fetchStoreInfo();

      // 2. Fetch orders IMMEDIATELY if we have the cached store ID
      if (cachedStoreId) {
        fetchOrders(cachedStoreId, cachedCurrency);
      } else {
        // If we don't have the cached ID, we must wait for the store fetch
        const store = await storePromise;
        if (store?.id) {
          fetchOrders(store.id, store.currency || "MAD");
        } else {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="p-4 md:p-8 w-full space-y-6 flex-1 min-w-0">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back, <span className="text-brand-500">{storeName}</span>
        </h1>
        <p className="text-gray-500 mt-1">Here is what's happening with your store today.</p>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30">
          <h2 className="text-lg font-bold text-gray-900">Overview dashboard</h2>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Orders Card */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100/80 shrink-0">
                <CubeIcon className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Orders</h3>
            </div>
            
            <ul className="divide-y divide-gray-100 -mb-2">
              {orderStats.map((stat) => (
                <li key={stat.label} className="flex justify-between items-center py-4 text-[15px]">
                  <span className="text-gray-500 font-medium">{stat.label}</span>
                  <span className="text-gray-900 font-bold">{stat.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Earnings Card */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100/80 shrink-0">
                <CurrencyDollarIcon className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Earnings</h3>
            </div>
            
            <ul className="divide-y divide-gray-100 -mb-2">
              {earningsStats.map((stat) => (
                <li key={stat.label} className="flex justify-between items-center py-4 text-[15px]">
                  <span className="text-gray-500 font-medium">{stat.label}</span>
                  <span className="text-gray-900 font-bold">{stat.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
