import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosmuv Accounts - Authentication & Onboarding",
  description: "Centralized authentication and multi-step onboarding for Cosmuv merchants.",
};

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] antialiased text-gray-900">
      {children}
    </div>
  );
}
