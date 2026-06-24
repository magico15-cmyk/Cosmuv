"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

export default function GeneralSettingsClient({ store }: { store: any }) {
  const router = useRouter();
  
  const [storeName, setStoreName] = useState(store?.store_name || store?.name || '');
  const [storeEmail, setStoreEmail] = useState(store?.store_email || '');
  const [currency, setCurrency] = useState(store?.currency || 'USD');
  const [country, setCountry] = useState(store?.country || 'US');
  const [language, setLanguage] = useState(store?.language || 'en');
  const [logoUrl, setLogoUrl] = useState(store?.logo_url || '');
  const [faviconUrl, setFaviconUrl] = useState(store?.favicon_url || '');
  
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const uploadImage = async (file: File, type: 'logo' | 'favicon'): Promise<string | null> => {
    try {
      if (type === 'logo') setUploadingLogo(true);
      else setUploadingFavicon(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `store-assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      showToast('Error uploading image: ' + error.message, 'error');
      return null;
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingFavicon(false);
    }
  };
  
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
          store_name: storeName,
          store_email: storeEmail,
          currency,
          country,
          language,
          logo_url: logoUrl,
          favicon_url: faviconUrl,
          // Update store_rtl automatically if language is Arabic
          store_rtl: language === 'ar'
        })
        .eq('id', store.id);

      if (error) throw error;

      showToast("General settings saved successfully!", "success");
      
      // Update local storage for Sidebar if name changed
      if (storeName) {
        localStorage.setItem('sello_store_name', storeName);
      }
      
      router.refresh();
    } catch (err: any) {
      console.error("Error updating settings:", err);
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
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

      <div className="w-full pb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
          
          {/* Store Identity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Store Identity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                  placeholder="e.g. My Awesome Store"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                <input
                  type="email"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                  placeholder="contact@mystore.com"
                />
              </div>
            </div>
          </div>

          {/* Localization */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Localization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                >
                  <option value="en">English (LTR)</option>
                  <option value="ar">Arabic (RTL)</option>
                  <option value="fr">French (LTR)</option>
                  <option value="es">Spanish (LTR)</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">Selecting Arabic automatically enables Right-to-Left (RTL) layout.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                >
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="FR">France</option>
                  <option value="MA">Morocco</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="AE">United Arab Emirates</option>
                </select>
              </div>
            </div>
          </div>

          {/* Currency Settings */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Currency Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency Symbol</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all outline-none"
                >
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="DH">MAD (DH)</option>
                  <option value="SR">SAR (SR)</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Logos & Icons</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
                <div className="flex items-start gap-4 mt-2">
                  {logoUrl ? (
                    <div className="relative group w-32 h-32 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain p-2" />
                      <button 
                        onClick={() => setLogoUrl('')}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <XMarkIcon className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-900 hover:bg-gray-50 transition-colors bg-white">
                      <PhotoIcon className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs font-medium text-gray-600 px-2 text-center">
                        {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        disabled={uploadingLogo}
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = await uploadImage(e.target.files[0], 'logo');
                            if (url) setLogoUrl(url);
                          }
                        }}
                      />
                    </label>
                  )}
                  <div className="flex-1 mt-2">
                    <p className="text-xs text-gray-500 leading-relaxed">Upload your store's logo.<br/>Recommended: PNG or SVG with a transparent background.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                <div className="flex items-start gap-4 mt-2">
                  {faviconUrl ? (
                    <div className="relative group w-32 h-32 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img src={faviconUrl} alt="Favicon Preview" className="max-w-full max-h-full object-contain p-4" />
                      <button 
                        onClick={() => setFaviconUrl('')}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <XMarkIcon className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-900 hover:bg-gray-50 transition-colors bg-white">
                      <PhotoIcon className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs font-medium text-gray-600 px-2 text-center">
                        {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        disabled={uploadingFavicon}
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = await uploadImage(e.target.files[0], 'favicon');
                            if (url) setFaviconUrl(url);
                          }
                        }}
                      />
                    </label>
                  )}
                  <div className="flex-1 mt-2">
                    <p className="text-xs text-gray-500 leading-relaxed">Upload your store's favicon.<br/>Recommended: 32x32px or 64x64px ICO or PNG.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </div>
        </div>

        {/* Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 md:left-56 bg-white border-t border-gray-200 p-4 flex justify-end z-40">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-8 py-2.5 rounded-md font-bold text-white shadow-sm transition-all flex items-center justify-center min-w-[140px] ${
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
    </>
  );
}
