"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  GlobeAltIcon,
  ClipboardIcon,
  ArrowPathIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// ─── Configuration ──────────────────────────────────────────────────
const PLATFORM_DOMAIN = "domains.cosmuv.ma"; // Change to your actual infrastructure domain
const A_RECORD_IP = "76.76.21.21";
// ────────────────────────────────────────────────────────────────────

export default function DomainsClient({ store }: { store: any }) {
  const router = useRouter();

  const [customDomain, setCustomDomain] = useState(store?.custom_domain || "");
  const [activeTab, setActiveTab] = useState<"root" | "subdomain">("root");
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async () => {
    if (!store?.id) {
      showToast("Store ID missing. Cannot save.", "error");
      return;
    }

    const trimmed = customDomain.trim().toLowerCase();

    // Basic domain validation
    if (trimmed && !/^([a-z0-9-]+\.)+[a-z]{2,}$/.test(trimmed)) {
      showToast(
        "Please enter a valid domain (e.g. example.com or shop.example.com)",
        "error"
      );
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("stores")
        .update({ custom_domain: trimmed || null })
        .eq("id", store.id);

      if (error) throw error;

      showToast("Domain saved successfully!", "success");
      router.refresh();
    } catch (err: any) {
      console.error("Error saving domain:", err);
      showToast("Failed to save domain. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerify = async () => {
    if (!customDomain.trim()) {
      showToast("Please enter a domain first.", "error");
      return;
    }

    setIsVerifying(true);
    setVerificationStatus("idle");
    try {
      // Simple DNS lookup via a public API
      const res = await fetch(
        `https://dns.google/resolve?name=${customDomain.trim()}&type=A`
      );
      const data = await res.json();

      if (data?.Answer?.some((a: any) => a.data === A_RECORD_IP)) {
        setVerificationStatus("success");
        showToast("Domain verified! DNS is pointing correctly.", "success");
      } else {
        // Check CNAME for subdomain setup
        const cnameRes = await fetch(
          `https://dns.google/resolve?name=${customDomain.trim()}&type=CNAME`
        );
        const cnameData = await cnameRes.json();

        if (
          cnameData?.Answer?.some(
            (a: any) =>
              a.data === PLATFORM_DOMAIN || a.data === `${PLATFORM_DOMAIN}.`
          )
        ) {
          setVerificationStatus("success");
          showToast("Domain verified! DNS is pointing correctly.", "success");
        } else {
          setVerificationStatus("error");
          showToast(
            "DNS records not detected yet. Changes can take up to 48 hours to propagate.",
            "error"
          );
        }
      }
    } catch {
      setVerificationStatus("error");
      showToast("Could not verify domain. Please try again later.", "error");
    } finally {
      setIsVerifying(false);
    }
  };

  // Extract parts for display
  const domainParts = customDomain.trim().split(".");
  const isSubdomain = domainParts.length > 2;
  const subdomainPrefix = isSubdomain ? domainParts[0] : "";

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          ) : (
            <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
          )}
          {toast.message}
          <button onClick={() => setToast(null)}>
            <XMarkIcon className="w-4 h-4 opacity-50 hover:opacity-100" />
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Current Domain Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-1">
            <GlobeAltIcon className="w-5 h-5 text-gray-400" />
            <h3 className="text-base font-bold text-gray-900">
              Your Custom Domain
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-5 ml-8">
            Enter the domain you want to connect to your store.
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              value={customDomain}
              onChange={(e) => {
                setCustomDomain(e.target.value);
                setVerificationStatus("idle");
              }}
              placeholder="e.g. mystore.com or shop.mystore.com"
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none text-sm"
            />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>

          {/* Current status */}
          {store?.custom_domain && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gray-600">
                Currently connected:{" "}
                <span className="font-medium text-gray-900">
                  {store.custom_domain}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* DNS Instructions Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            DNS Configuration
          </h3>
          <p className="text-sm text-gray-500 mb-5">
            Follow these instructions to point your domain to your store.
          </p>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("root")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
                activeTab === "root"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Root Domain (Preferred)
            </button>
            <button
              onClick={() => setActiveTab("subdomain")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-[1px] ${
                activeTab === "subdomain"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              Subdomain
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "root" ? (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-sm text-gray-700 mb-4">
                  To connect your root domain (e.g.{" "}
                  <span className="font-mono font-medium">mystore.com</span>),
                  create an <strong>A Record</strong> in your domain provider's
                  DNS settings:
                </p>

                {/* DNS Record Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                    <div className="px-4 py-3">Type</div>
                    <div className="px-4 py-3">Host / Name</div>
                    <div className="px-4 py-3">Value / Points to</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div className="px-4 py-3.5 font-mono font-medium text-gray-900">
                      A
                    </div>
                    <div className="px-4 py-3.5 flex items-center gap-2">
                      <span className="font-mono text-gray-900">@</span>
                      <button
                        onClick={() => copyToClipboard("@", "host")}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy"
                      >
                        {copiedField === "host" ? (
                          <CheckIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <ClipboardIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="px-4 py-3.5 flex items-center gap-2">
                      <span className="font-mono text-gray-900">
                        {A_RECORD_IP}
                      </span>
                      <button
                        onClick={() => copyToClipboard(A_RECORD_IP, "value")}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy"
                      >
                        {copiedField === "value" ? (
                          <CheckIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <ClipboardIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-500">
                    <strong>Note:</strong> DNS changes can take up to 48 hours to
                    fully propagate, though most updates complete within a few
                    minutes.
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Setup Steps
                </h4>
                <ol className="space-y-2.5 text-sm text-gray-600 list-none">
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      1
                    </span>
                    <span>
                      Log in to your domain registrar (GoDaddy, Namecheap,
                      Google Domains, etc.)
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      2
                    </span>
                    <span>Navigate to the DNS management section</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      3
                    </span>
                    <span>
                      Add a new <strong>A Record</strong> with Host{" "}
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                        @
                      </code>{" "}
                      and Value{" "}
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                        {A_RECORD_IP}
                      </code>
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      4
                    </span>
                    <span>
                      Save changes, then come back here and click{" "}
                      <strong>"Verify Domain"</strong>
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-5">
                <p className="text-sm text-gray-700 mb-4">
                  To connect a subdomain (e.g.{" "}
                  <span className="font-mono font-medium">
                    shop.mystore.com
                  </span>
                  ), create a <strong>CNAME Record</strong> in your domain
                  provider's DNS settings:
                </p>

                {/* DNS Record Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-3 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                    <div className="px-4 py-3">Type</div>
                    <div className="px-4 py-3">Host / Name</div>
                    <div className="px-4 py-3">Value / Points to</div>
                  </div>
                  <div className="grid grid-cols-3 text-sm">
                    <div className="px-4 py-3.5 font-mono font-medium text-gray-900">
                      CNAME
                    </div>
                    <div className="px-4 py-3.5 flex items-center gap-2">
                      <span className="font-mono text-gray-900">
                        {subdomainPrefix || "shop"}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            subdomainPrefix || "shop",
                            "sub-host"
                          )
                        }
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy"
                      >
                        {copiedField === "sub-host" ? (
                          <CheckIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <ClipboardIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="px-4 py-3.5 flex items-center gap-2">
                      <span className="font-mono text-gray-900 text-xs">
                        {PLATFORM_DOMAIN}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(PLATFORM_DOMAIN, "sub-value")
                        }
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy"
                      >
                        {copiedField === "sub-value" ? (
                          <CheckIcon className="w-4 h-4 text-green-500" />
                        ) : (
                          <ClipboardIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-500">
                    <strong>Note:</strong> Replace{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                      shop
                    </code>{" "}
                    with your desired subdomain prefix. DNS changes can take up
                    to 48 hours to fully propagate.
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Setup Steps
                </h4>
                <ol className="space-y-2.5 text-sm text-gray-600 list-none">
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      1
                    </span>
                    <span>
                      Log in to your domain registrar (GoDaddy, Namecheap,
                      Google Domains, etc.)
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      2
                    </span>
                    <span>Navigate to the DNS management section</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      3
                    </span>
                    <span>
                      Add a new <strong>CNAME Record</strong> with Host{" "}
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                        {subdomainPrefix || "shop"}
                      </code>{" "}
                      and Value{" "}
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                        {PLATFORM_DOMAIN}
                      </code>
                    </span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      4
                    </span>
                    <span>
                      Save changes, then come back here and click{" "}
                      <strong>"Verify Domain"</strong>
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Verify Button */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleVerify}
              disabled={isVerifying || !customDomain.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isVerifying || !customDomain.trim()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              <ArrowPathIcon
                className={`w-4 h-4 ${isVerifying ? "animate-spin" : ""}`}
              />
              {isVerifying ? "Verifying..." : "Verify Domain"}
            </button>

            {verificationStatus === "success" && (
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <CheckCircleIcon className="w-5 h-5" />
                Domain verified
              </div>
            )}
            {verificationStatus === "error" && (
              <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
                <ExclamationCircleIcon className="w-5 h-5" />
                Not detected yet
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 Good to know
          </h4>
          <ul className="text-sm text-blue-700 space-y-1.5">
            <li>
              • SSL certificates are automatically provisioned for your custom
              domain.
            </li>
            <li>
              • Your store will remain accessible on its default subdomain as a
              fallback.
            </li>
            <li>
              • If you switch domains, simply update the value here and
              re-configure DNS.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
