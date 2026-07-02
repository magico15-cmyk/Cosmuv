"use client";

import { useEffect } from "react";
import { getAccountsUrl } from "@/lib/domain";

export default function LegacyLoginPage() {
  useEffect(() => {
    window.location.href = getAccountsUrl("/login");
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-sm text-gray-500 font-medium">
      Redirecting to Cosmuv Accounts...
    </div>
  );
}
