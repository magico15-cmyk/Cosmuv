"use client";

import React from "react";
import { Clock, ShieldCheck } from "lucide-react";

export default function HoldingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-slate-900 selection:text-white font-sans">
      <div className="max-w-md w-full bg-white py-12 px-8 shadow-sm border border-gray-100 rounded-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border border-amber-100 shadow-sm animate-pulse">
            <Clock className="h-8 w-8" />
          </div>
        </div>

        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight mb-2">
          Store Under Review
        </h1>

        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          This store is currently undergoing setup and verification by our moderation team. We are making sure everything is ready for launch!
        </p>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-3 text-left mb-6">
          <ShieldCheck className="h-5 w-5 text-slate-700 shrink-0" />
          <p className="text-[13px] text-slate-600 font-medium">
            Verified Cosmuv Merchant Platform
          </p>
        </div>

        <p className="text-xs text-gray-400">
          Check back soon for exciting updates and products.
        </p>
      </div>
    </div>
  );
}
