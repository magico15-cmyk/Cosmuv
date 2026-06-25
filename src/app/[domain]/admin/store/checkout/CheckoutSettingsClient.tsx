"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/ToastProvider";
import { supabase } from "@/lib/supabase";
import { Bars3Icon } from "@heroicons/react/24/outline";

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

const TextInputRow = ({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) => (
  <div className="flex flex-col py-4 border-b border-gray-100 last:border-0">
    <label className="text-[14px] text-gray-700 font-medium mb-2">{label}</label>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-shadow"
    />
  </div>
);

const ToggleRow = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-gray-700 font-medium">{label}</span>
    <button 
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-brand-500' : 'bg-gray-200'}`}
    >
      <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  </div>
);

export default function CheckoutSettingsClient({ store }: { store: any }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const [checkoutColor, setCheckoutColor] = useState(store?.checkout_color || store?.primary_color || '#f899a2');
  const [mainTitle, setMainTitle] = useState(store?.checkout_main_title || 'CASH ON DELIVERY');
  const [addressTitle, setAddressTitle] = useState(store?.checkout_address_title || 'Enter your shipping address');
  const [addressDesc, setAddressDesc] = useState(store?.checkout_address_desc || 'You will be contacted by one of our operators to confirm your order before shipping.');
  const [buttonText, setButtonText] = useState(store?.checkout_button_text || 'COMPLETE ORDER');

  const [fieldNameEnabled, setFieldNameEnabled] = useState(store?.field_name_enabled ?? true);
  const [fieldNameLabel, setFieldNameLabel] = useState(store?.field_name_label || 'Full name');
  const [fieldPhoneEnabled, setFieldPhoneEnabled] = useState(store?.field_phone_enabled ?? true);
  const [fieldPhoneLabel, setFieldPhoneLabel] = useState(store?.field_phone_label || 'Phone number');
  const [fieldCityEnabled, setFieldCityEnabled] = useState(store?.field_city_enabled ?? true);
  const [fieldCityLabel, setFieldCityLabel] = useState(store?.field_city_label || 'City');

  const [fieldAddressEnabled, setFieldAddressEnabled] = useState(store?.field_address_enabled ?? true);
  const [fieldAddressLabel, setFieldAddressLabel] = useState(store?.field_address_label || 'Address (Road, House number)');

  const [fieldOrder, setFieldOrder] = useState<string[]>(
    store?.checkout_field_order || ['name', 'phone', 'city', 'address']
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragEnabledId, setDragEnabledId] = useState<string | null>(null);

  const fieldsData: Record<string, any> = {
    name: {
      id: 'name',
      label: 'Enable Name Field',
      enabled: fieldNameEnabled,
      setEnabled: setFieldNameEnabled,
      fieldLabel: fieldNameLabel,
      setFieldLabel: setFieldNameLabel,
      placeholder: 'Label (e.g. Full name)',
    },
    phone: {
      id: 'phone',
      label: 'Enable Phone Field',
      enabled: fieldPhoneEnabled,
      setEnabled: setFieldPhoneEnabled,
      fieldLabel: fieldPhoneLabel,
      setFieldLabel: setFieldPhoneLabel,
      placeholder: 'Label (e.g. Phone number)',
    },
    city: {
      id: 'city',
      label: 'Enable City Field',
      enabled: fieldCityEnabled,
      setEnabled: setFieldCityEnabled,
      fieldLabel: fieldCityLabel,
      setFieldLabel: setFieldCityLabel,
      placeholder: 'Label (e.g. City)',
    },
    address: {
      id: 'address',
      label: 'Enable Address Field',
      enabled: fieldAddressEnabled,
      setEnabled: setFieldAddressEnabled,
      fieldLabel: fieldAddressLabel,
      setFieldLabel: setFieldAddressLabel,
      placeholder: 'Label (e.g. Address)',
    },
  };


  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('stores')
        .update({ 
          checkout_color: checkoutColor,
          checkout_main_title: mainTitle,
          checkout_address_title: addressTitle,
          checkout_address_desc: addressDesc,
          checkout_button_text: buttonText,
          field_name_enabled: fieldNameEnabled,
          field_name_label: fieldNameLabel,
          field_phone_enabled: fieldPhoneEnabled,
          field_phone_label: fieldPhoneLabel,
          field_city_enabled: fieldCityEnabled,
          field_city_label: fieldCityLabel,
          field_address_enabled: fieldAddressEnabled,
          field_address_label: fieldAddressLabel,
          checkout_field_order: fieldOrder
        })
        .eq('id', store.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("No rows were updated. Check if RLS is blocking the update or the Store ID is incorrect.");
      }

      showToast("Checkout settings saved successfully!", "success");
      router.refresh();
    } catch (err: any) {
      console.error("Error updating settings:", err);
      showToast(err.message || "Failed to save settings", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1000px] pb-20">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Text Settings</h3>
            <p className="text-sm text-gray-500 mt-1">Customize the messaging on your checkout page</p>
          </div>
        </div>
        <div className="p-6 pt-2">
          <TextInputRow label="Main Title" value={mainTitle} onChange={setMainTitle} placeholder="e.g., CASH ON DELIVERY" />
          <TextInputRow label="Address Section Title" value={addressTitle} onChange={setAddressTitle} placeholder="e.g., Enter your shipping address" />
          <TextInputRow label="Address Description" value={addressDesc} onChange={setAddressDesc} placeholder="e.g., You will be contacted..." />
          <TextInputRow label="Checkout Button Text" value={buttonText} onChange={setButtonText} placeholder="e.g., COMPLETE ORDER" />
        </div>

        <div className="px-6 py-5 border-t border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Color Settings</h3>
            <p className="text-sm text-gray-500 mt-1">Customize the visual style of your checkout</p>
          </div>
        </div>
        <div className="p-6 pt-2">
          <ColorInputRow label="Checkout Button Color" value={checkoutColor} onChange={setCheckoutColor} />
        </div>

        <div className="px-6 py-5 border-t border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Form Fields</h3>
            <p className="text-sm text-gray-500 mt-1">Enable/disable fields and customize their labels</p>
          </div>
        </div>
        <div className="p-6 pt-2">
          <div className="flex flex-col gap-4">
            {fieldOrder.map((fieldId, index) => {
              const field = fieldsData[fieldId];
              if (!field) return null;
              return (
                <div 
                  key={field.id}
                  draggable={dragEnabledId === field.id}
                  onDragStart={(e) => {
                    setDraggedIndex(index);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index) return;
                    const newOrder = [...fieldOrder];
                    const draggedItem = newOrder[draggedIndex];
                    newOrder.splice(draggedIndex, 1);
                    newOrder.splice(index, 0, draggedItem);
                    setFieldOrder(newOrder);
                    setDraggedIndex(null);
                    setDragEnabledId(null);
                  }}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragEnabledId(null);
                  }}
                  className={`border border-gray-100 p-4 rounded-lg transition-colors ${draggedIndex === index ? 'opacity-50 border-dashed border-2 border-brand-500 bg-gray-50' : 'bg-white hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="cursor-move p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      onMouseDown={() => setDragEnabledId(field.id)}
                      onMouseUp={() => setDragEnabledId(null)}
                      onMouseLeave={() => setDragEnabledId(null)}
                    >
                      <Bars3Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <ToggleRow label={field.label} checked={field.enabled} onChange={field.setEnabled} />
                    </div>
                  </div>
                  {field.enabled && (
                    <div className="mt-3 pl-9">
                      <input type="text" value={field.fieldLabel} onChange={(e) => field.setFieldLabel(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-shadow" placeholder={field.placeholder} />
                    </div>
                  )}
                </div>
              );
            })}
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
  );
}
