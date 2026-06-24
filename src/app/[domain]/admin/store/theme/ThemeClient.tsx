"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import CustomSelect from "@/components/admin/CustomSelect";
import { useToast } from "@/components/admin/ToastProvider";

const ColorInputRow = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <span className="text-[14px] text-gray-700 font-medium">{label}</span>
    <div className="flex items-center gap-2">
      <label className="relative flex items-center gap-3 border border-gray-200 rounded-full py-1.5 pl-1.5 pr-4 cursor-pointer hover:border-gray-300 transition-colors bg-white">
        <div className="w-8 h-8 rounded-md border border-black/5 overflow-hidden relative shadow-inner">
          <div className="absolute inset-0" style={{ backgroundColor: value }} />
          <input 
            type="color" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-[-10px] w-20 h-20 opacity-0 cursor-pointer"
          />
        </div>
        <span className="text-[13px] text-gray-600 uppercase font-mono tracking-wide">{value}</span>
      </label>
    </div>
  </div>
);

const ToggleRow = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
    <span className="text-sm text-gray-700">{label}</span>
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-brand-500' : 'bg-gray-200'}`}
    >
      <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  </div>
);

export default function ThemeClient({ store }: { store: any }) {
  const router = useRouter();
  
  // Existing state that maps to DB
  const [primaryColor, setPrimaryColor] = useState(store?.primary_color || '#F77C94');
  
  // New UI state (now saved in DB)
  const [lightPrimary, setLightPrimary] = useState(store?.light_primary || '#F77C94');
  const [darkPrimary, setDarkPrimary] = useState(store?.dark_primary || '#D0021B');
  const [secondary, setSecondary] = useState(store?.secondary_color || '#DEC435');
  const [bodyBg, setBodyBg] = useState(store?.body_bg || '#F77C94');
  const [successColor, setSuccessColor] = useState(store?.success_color || '#00C853');
  const [infoColor, setInfoColor] = useState(store?.info_color || '#40C4FF');
  const [warningColor, setWarningColor] = useState(store?.warning_color || '#FFAB00');
  const [dangerColor, setDangerColor] = useState(store?.danger_color || '#F44336');
  const [guaranteeColor, setGuaranteeColor] = useState(store?.guarantee_color || '#fef3c7');

  const [menuFont, setMenuFont] = useState('Cairo');
  const [bodyFont, setBodyFont] = useState('Cairo');
  
  const [globalBreadcrumbs, setGlobalBreadcrumbs] = useState(false);
  const [checkoutBreadcrumbs, setCheckoutBreadcrumbs] = useState(false);
  const [doublePrecision, setDoublePrecision] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    if (!store?.id) {
      showToast("Store ID missing. Cannot save.", "error");
      return;
    }
    
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('stores')
        .update({
          primary_color: primaryColor,
          light_primary: lightPrimary,
          dark_primary: darkPrimary,
          secondary_color: secondary,
          body_bg: bodyBg,
          success_color: successColor,
          info_color: infoColor,
          warning_color: warningColor,
          danger_color: dangerColor,
          guarantee_color: guaranteeColor
        })
        .eq('id', store.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("No rows were updated. Check if RLS is blocking the update or the Store ID is incorrect.");
      }

      showToast("Theme settings saved successfully!", "success");
      router.refresh();
    } catch (err: any) {
      console.error("Error updating settings:", err);
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <div className="w-full pb-20">
      <div className="space-y-6">
        
        {/* Logo & Favicon Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-[15px] font-bold text-gray-900">Logo & favicon</h3>
          </div>
          <div className="px-5 py-4 bg-gray-50/30">
            <p className="text-[13px] text-gray-600">
              Looking for the logo and favicon settings? They were moved to the settings page. Click <a href="#" className="text-red-500 hover:underline">here</a> to modify them.
            </p>
          </div>
        </div>

        {/* Recommended Fonts Accordion Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-[14px] font-medium text-gray-800">Recommended fonts</span>
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </div>

        {/* Fonts Section */}
        <div className="space-y-6 mt-6">
          {/* Menu Font */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-2">Menu section font</label>
            <CustomSelect 
              value={menuFont}
              onChange={setMenuFont}
              options={[
                { value: "Cairo", label: "Cairo" },
                { value: "Inter", label: "Inter" },
                { value: "Roboto", label: "Roboto" },
              ]}
            />
            <label className="block text-[13px] text-gray-600 mt-4 mb-2">Preview</label>
            <div className="w-full min-h-[100px] p-4 bg-white border border-gray-200 rounded-md text-sm text-gray-700 leading-relaxed" style={{ fontFamily: menuFont }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </div>
          </div>

          {/* Body Font */}
          <div>
            <label className="block text-[13px] text-gray-600 mb-2">Body section font</label>
            <CustomSelect 
              value={bodyFont}
              onChange={setBodyFont}
              options={[
                { value: "Cairo", label: "Cairo" },
                { value: "Inter", label: "Inter" },
                { value: "Roboto", label: "Roboto" },
              ]}
            />
            <label className="block text-[13px] text-gray-600 mt-4 mb-2">Preview</label>
            <div className="w-full min-h-[100px] p-4 bg-white border border-gray-200 rounded-md text-sm text-gray-700 leading-relaxed" style={{ fontFamily: bodyFont }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </div>
          </div>
        </div>

        {/* Theme Colors Section */}
        <div className="bg-white border border-gray-200 rounded-lg mt-8">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-[15px] font-bold text-gray-900">Theme colors</h3>
          </div>
          <div className="px-6 py-2">
            <ColorInputRow label="Primary" value={primaryColor} onChange={setPrimaryColor} />
            <ColorInputRow label="Light primary" value={lightPrimary} onChange={setLightPrimary} />
            <ColorInputRow label="Dark primary" value={darkPrimary} onChange={setDarkPrimary} />
            <ColorInputRow label="Secondary" value={secondary} onChange={setSecondary} />
            <ColorInputRow label="Body background" value={bodyBg} onChange={setBodyBg} />
            <ColorInputRow label="Success" value={successColor} onChange={setSuccessColor} />
            <ColorInputRow label="Info" value={infoColor} onChange={setInfoColor} />
            <ColorInputRow label="Warning" value={warningColor} onChange={setWarningColor} />
            <ColorInputRow label="Danger" value={dangerColor} onChange={setDangerColor} />
            <ColorInputRow label="Guarantee box" value={guaranteeColor} onChange={setGuaranteeColor} />
          </div>
        </div>

        {/* Bottom Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <ToggleRow label="Global breadcrumbs" checked={globalBreadcrumbs} onChange={setGlobalBreadcrumbs} />
          <ToggleRow label="Checkout breadcrumbs" checked={checkoutBreadcrumbs} onChange={setCheckoutBreadcrumbs} />
          <ToggleRow label="Double precision" checked={doublePrecision} onChange={setDoublePrecision} />
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
  );
}
