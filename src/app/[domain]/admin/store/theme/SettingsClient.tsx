"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SettingsClient({ store }: { store: any }) {
  const router = useRouter();
  
  const [currency, setCurrency] = useState(store?.currency || 'USD');
  const [country, setCountry] = useState(store?.country || 'US');
  const [primaryColor, setPrimaryColor] = useState(store?.primary_color || '#f899a2');
  
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const presetColors = [
    { label: 'Pink', hex: '#f899a2' },
    { label: 'Blue', hex: '#3b82f6' },
    { label: 'Green', hex: '#10b981' },
    { label: 'Dark', hex: '#111827' },
    { label: 'Purple', hex: '#8b5cf6' },
  ];

  const handleSave = async () => {
    if (!store?.id) {
      showToast("Store ID missing. Cannot save.", "error");
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('stores')
        .update({
          currency,
          country,
          primary_color: primaryColor,
        })
        .eq('id', store.id);

      if (error) throw error;

      showToast("Settings saved successfully!", "success");
      router.refresh();
    } catch (err: any) {
      console.error("Error updating settings:", err);
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in-right max-w-sm w-full ${toast.type === 'success' ? 'bg-white border-green-100 text-gray-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          {toast.type === 'success' ? (
            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          ) : (
            <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h4 className="text-sm font-semibold">{toast.type === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-sm mt-0.5 opacity-90">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <XMarkIcon className="w-4 h-4 opacity-50" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Currency Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
            <p className="text-sm text-gray-500 mb-3">Choose the default currency symbol displayed to customers.</p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full max-w-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
            >
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="MAD ">MAD (DH)</option>
              <option value="SAR ">SAR (SR)</option>
              <option value="AED ">AED</option>
            </select>
          </div>

          <hr className="border-gray-100" />

          {/* Country Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Store Country</label>
            <p className="text-sm text-gray-500 mb-3">Primary operating country for your store.</p>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full max-w-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
            >
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="FR">France</option>
              <option value="MA">Morocco</option>
              <option value="SA">Saudi Arabia</option>
              <option value="AE">United Arab Emirates</option>
            </select>
          </div>

          <hr className="border-gray-100" />

          {/* Theme Color Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Brand Color</label>
            <p className="text-sm text-gray-500 mb-4">This color is used for buttons, badges, and accents across your storefront.</p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Color Input */}
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full border border-gray-200 shadow-inner"
                  style={{ backgroundColor: primaryColor }}
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-32 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none font-mono text-sm"
                  placeholder="#000000"
                />
              </div>

              {/* Preset Badges */}
              <div className="flex flex-wrap items-center gap-3 border-l border-gray-100 pl-0 sm:pl-6">
                {presetColors.map(preset => (
                  <button
                    key={preset.hex}
                    onClick={() => setPrimaryColor(preset.hex)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${primaryColor === preset.hex ? 'border-gray-900 scale-110 shadow-sm' : 'border-transparent'}`}
                    style={{ backgroundColor: preset.hex }}
                    title={preset.label}
                    aria-label={`Select ${preset.label}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-sm transition-all flex items-center justify-center min-w-[140px] ${
              isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
