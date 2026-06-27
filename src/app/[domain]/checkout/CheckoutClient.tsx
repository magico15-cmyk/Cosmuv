"use client";

import React, { useState } from 'react';
import { X, CheckCircle, CheckCircle2, User, Phone, MapPin, Menu, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';

const CHECKOUT_TRANSLATIONS: Record<string, { subtotal: string; shipping: string; free: string; total: string }> = {
  en: { subtotal: 'Subtotal', shipping: 'Shipping', free: 'Free', total: 'Total' },
  ar: { subtotal: 'المجموع الفرعي', shipping: 'الشحن', free: 'مجاني', total: 'الإجمالي' },
  fr: { subtotal: 'Sous-total', shipping: 'Livraison', free: 'Gratuit', total: 'Total' },
};

export default function CheckoutClient({ product, selectedPkg, storeId, store }: { product: any, selectedPkg: any, storeId: string, store: any }) {
  const t = CHECKOUT_TRANSLATIONS[store?.checkout_language || 'en'] || CHECKOUT_TRANSLATIONS.en;
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const primaryColor = store?.primary_color || '#f899a2';
  const checkoutColor = store?.checkout_color || primaryColor;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderPayload = {
        store_id: storeId,
        customer_name: formData.fullName,
        customer_phone: formData.phoneNumber,
        customer_address: `${formData.address}, ${formData.city}`,
        total_amount: parseFloat(selectedPkg.price.replace(/[^0-9.]/g, '')),
        status: 'pending',
        items: [{
          product_id: product.id,
          product_name: product.name,
          package: selectedPkg.title,
          price: selectedPkg.price,
          image: selectedPkg.image
        }]
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit order");
      }
      
      const params = new URLSearchParams({
        name: formData.fullName,
        item: selectedPkg.title
      });
      router.push(`/thank-you?${params.toString()}`);
    } catch (err: any) {
      alert(err.message || "Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir={store?.checkout_language === 'ar' || store?.store_rtl ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50 flex flex-col">
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --primary-pink: ${primaryColor};
        }
      `}} />

      <main className="flex-grow flex items-start justify-center p-4 pt-8 sm:pt-12">
      <div className="w-full rounded-xl overflow-hidden relative border border-gray-300" style={{ maxWidth: '480px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #d1d5db' }}>
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200" style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <h1 className="text-lg font-bold text-gray-900 tracking-wide" style={{ fontSize: '18px', margin: 0 }}>{store?.checkout_main_title || 'CASH ON DELIVERY'}</h1>
          <Link href={`/product/${product.id}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} color="#9ca3af" />
          </Link>
        </div>

        {/* Product Row */}
        <div className="flex items-center justify-between" style={{ padding: '20px' }}>
          <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="relative">
              <div className="bg-white rounded-md border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm" style={{ width: '65px', height: '65px', padding: '4px', border: '1px solid #e5e7eb' }}>
                {selectedPkg.image ? (
                  <img 
                    src={selectedPkg.image} 
                    alt={selectedPkg.title} 
                    className="w-full h-full object-contain"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-sm" />
                )}
              </div>
              <div className="absolute -top-2 -right-2 bg-gray-600 text-white font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm" style={{ width: '20px', height: '20px', fontSize: '10px', top: '-8px', right: '-8px', backgroundColor: '#4b5563' }}>
                1
              </div>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-0.5 underline decoration-gray-300 underline-offset-2" style={{ fontSize: '15px', margin: '0 0 2px 0' }}>{product.name}</h2>
              <p className="text-gray-500" style={{ fontSize: '13px', margin: 0 }}>{selectedPkg.title}</p>
            </div>
          </div>
          <div className="font-extrabold text-gray-900" style={{ fontSize: '15px' }}>
            {selectedPkg.price}
          </div>
        </div>

        {/* Order Summary Box */}
        <div style={{ padding: '0 20px 20px 20px' }}>
          <div className="rounded-lg space-y-2" style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px' }}>
            <div className="flex justify-between items-center text-gray-600 font-medium" style={{ fontSize: '14px', marginBottom: '8px' }}>
              <span>{t.subtotal}</span>
              <span className="font-bold text-gray-900" style={{ color: '#111827' }}>{selectedPkg.price}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 font-medium" style={{ fontSize: '14px' }}>
              <span>{t.shipping}</span>
              <span className="font-bold text-gray-900" style={{ color: '#111827' }}>{t.free}</span>
            </div>
            <div className="border-t border-gray-300 flex justify-between items-center" style={{ borderTop: '1px solid #d1d5db', marginTop: '12px', paddingTop: '12px' }}>
              <span className="font-extrabold text-gray-900" style={{ fontSize: '16px', color: '#111827' }}>{t.total}</span>
              <span className="font-extrabold text-gray-900" style={{ fontSize: '16px', color: '#111827' }}>{selectedPkg.price}</span>
            </div>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="border-t border-gray-100" style={{ padding: '8px 20px 24px 20px', borderTop: '1px solid #f3f4f6' }}>
          <div className="text-center" style={{ marginBottom: '24px' }}>
            <h2 className="font-bold text-gray-900" style={{ fontSize: '19px', marginBottom: '4px', marginTop: '12px' }}>
              {store?.checkout_address_title || 'Enter your shipping address'}
            </h2>
            <p className="text-gray-500 mx-auto leading-relaxed" style={{ fontSize: '13px', maxWidth: '300px' }}>
              {store?.checkout_address_desc || 'You will be contacted by one of our operators to confirm your order before shipping.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} suppressHydrationWarning>
            
            {(store?.field_name_enabled ?? true) && (
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '45px', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRight: '1px solid #d1d5db' }}>
                  <User size={18} color="#4b5563" />
                </div>
                <input 
                  type="text" 
                  name="fullName" 
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={{ flex: 1, padding: '12px 14px', fontSize: '16px', border: 'none', outline: 'none' }}
                  placeholder={store?.field_name_label || 'Full name'}
                  suppressHydrationWarning
                />
              </div>
            )}

            {(store?.field_phone_enabled ?? true) && (
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '45px', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRight: '1px solid #d1d5db' }}>
                  <Phone size={18} color="#4b5563" />
                </div>
                <input 
                  type="tel" 
                  name="phoneNumber" 
                  required
                  dir="auto"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  style={{ flex: 1, padding: '12px 14px', fontSize: '16px', border: 'none', outline: 'none', direction: 'inherit' }}
                  placeholder={store?.field_phone_label || 'Phone number'}
                  suppressHydrationWarning
                />
              </div>
            )}

            {(store?.field_city_enabled ?? true) && (
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '45px', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRight: '1px solid #d1d5db' }}>
                  <MapPin size={18} color="#4b5563" />
                </div>
                <input 
                  type="text" 
                  name="city" 
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  style={{ flex: 1, padding: '12px 14px', fontSize: '16px', border: 'none', outline: 'none' }}
                  placeholder={store?.field_city_label || 'City'}
                  suppressHydrationWarning
                />
              </div>
            )}

            {(store?.field_address_enabled ?? true) && (
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: '45px', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRight: '1px solid #d1d5db' }}>
                  <MapPin size={18} color="#4b5563" />
                </div>
                <input 
                  type="text" 
                  name="address" 
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  style={{ flex: 1, padding: '12px 14px', fontSize: '16px', border: 'none', outline: 'none' }}
                  placeholder={store?.field_address_label || 'Address (Road, House number)'}
                  suppressHydrationWarning
                />
              </div>
            )}

            <div style={{ paddingTop: '8px' }}>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full font-bold transition-all shadow-sm flex items-center justify-center gap-2 relative overflow-hidden"
                style={{ backgroundColor: checkoutColor, color: 'white', padding: '16px', borderRadius: '8px', fontSize: '16px', border: 'none', letterSpacing: '0.5px' }}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle size={20} style={{ opacity: 0.9 }} />
                    {store?.checkout_button_text || 'COMPLETE ORDER'}
                  </>
                )}
              </button>
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
