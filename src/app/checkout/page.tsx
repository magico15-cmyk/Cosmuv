"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { X, CheckCircle2, User, Phone, MapPin, Menu, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const packages = [
  { id: 1, title: "1 Bottle", originalPrice: "$50.00", price: "$45.00", image: "/assets/bottle.png" },
  { id: 2, title: "2 Bottles", originalPrice: "$100.00", price: "$79.00", image: "/assets/bundle.png" },
  { id: 3, title: "Bundle", originalPrice: "$150.00", price: "$106.00", image: "/assets/bundle.png" }
];

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const packageId = parseInt(searchParams.get('package') || '2');
  
  const selectedPkg = packages.find(p => p.id === packageId) || packages[1];
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: '',
    address: ''
  });

  const [orderComplete, setOrderComplete] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order Submitted:", { package: selectedPkg, ...formData });
    setOrderComplete(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#e8f0ed] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center" style={{ maxWidth: '448px' }}>
          <div className="w-20 h-20 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(248, 153, 162, 0.2)' }}>
            <CheckCircle2 size={40} color="#f899a2" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4" style={{ fontSize: '30px' }}>Order Confirmed!</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you, <strong>{formData.fullName}</strong>. Your order for <strong>{selectedPkg.title}</strong> has been received and will be shipped to your address via Cash on Delivery.
          </p>
          <a href="/" className="inline-block text-white font-bold px-8 py-4 rounded-lg text-lg shadow-sm transition-colors w-full" style={{ backgroundColor: '#f899a2', padding: '16px 32px' }}>
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="header">
        <button className="menu-btn" aria-label="Menu"><Menu size={26} /></button>
        <Link href="/" className="logo"><div className="logo-circle">Yu.</div></Link>
        <button className="cart-btn" aria-label="Cart" style={{ position: 'relative' }}>
          <ShoppingBag size={26} />
          <span style={{ position: 'absolute', top: '-4px', right: '-6px', backgroundColor: '#f899a2', color: 'white', fontSize: '11px', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
        </button>
      </header>

      <div className="min-h-screen bg-white font-sans py-10 px-4 flex justify-center items-start" style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '40px 16px' }}>
      <div className="w-full rounded-xl overflow-hidden relative border border-gray-300" style={{ maxWidth: '480px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #d1d5db' }}>
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200" style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <h1 className="text-lg font-bold text-gray-900 tracking-wide" style={{ fontSize: '18px', margin: 0 }}>CASH ON DELIVERY</h1>
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} color="#9ca3af" />
          </Link>
        </div>

        {/* Product Row */}
        <div className="flex items-center justify-between" style={{ padding: '20px' }}>
          <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="relative">
              <div className="bg-white rounded-md border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm" style={{ width: '65px', height: '65px', padding: '4px', border: '1px solid #e5e7eb' }}>
                <img 
                  src={selectedPkg.image} 
                  alt={selectedPkg.title} 
                  className="w-full h-full object-contain"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div className="absolute -top-2 -right-2 bg-gray-600 text-white font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm" style={{ width: '20px', height: '20px', fontSize: '10px', top: '-8px', right: '-8px', backgroundColor: '#4b5563' }}>
                1
              </div>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-0.5 underline decoration-gray-300 underline-offset-2" style={{ fontSize: '15px', margin: '0 0 2px 0' }}>Enhanced Bioactive Turmeric</h2>
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
              <span>Subtotal</span>
              <span className="font-bold text-gray-900" style={{ color: '#111827' }}>{selectedPkg.price}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 font-medium" style={{ fontSize: '14px' }}>
              <span>Shipping</span>
              <span className="font-bold text-gray-900" style={{ color: '#111827' }}>Free</span>
            </div>
            <div className="border-t border-gray-300 flex justify-between items-center" style={{ borderTop: '1px solid #d1d5db', marginTop: '12px', paddingTop: '12px' }}>
              <span className="font-extrabold text-gray-900" style={{ fontSize: '16px', color: '#111827' }}>Total</span>
              <span className="font-extrabold text-gray-900" style={{ fontSize: '16px', color: '#111827' }}>{selectedPkg.price}</span>
            </div>
          </div>
        </div>

        {/* Shipping Form */}
        <div className="border-t border-gray-100" style={{ padding: '8px 20px 24px 20px', borderTop: '1px solid #f3f4f6' }}>
          <div className="text-center" style={{ marginBottom: '24px' }}>
            <h2 className="font-bold text-gray-900" style={{ fontSize: '19px', marginBottom: '4px', marginTop: '12px' }}>Enter your shipping address</h2>
            <p className="text-gray-500 mx-auto leading-relaxed" style={{ fontSize: '13px', maxWidth: '300px' }}>
              You will be contacted by one of our operators to confirm your order before shipping.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
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
                style={{ flex: 1, padding: '12px 14px', fontSize: '15px', border: 'none', outline: 'none' }}
                placeholder="Full name"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: '45px', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRight: '1px solid #d1d5db' }}>
                <Phone size={18} color="#4b5563" />
              </div>
              <input 
                type="tel" 
                name="phoneNumber" 
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
                style={{ flex: 1, padding: '12px 14px', fontSize: '15px', border: 'none', outline: 'none' }}
                placeholder="Phone number"
              />
            </div>

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
                style={{ flex: 1, padding: '12px 14px', fontSize: '15px', border: 'none', outline: 'none' }}
                placeholder="City"
              />
            </div>

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
                style={{ flex: 1, padding: '12px 14px', fontSize: '15px', border: 'none', outline: 'none' }}
                placeholder="Address (Road, House number)"
              />
            </div>

            <div style={{ paddingTop: '8px' }}>
              <button 
                type="submit"
                className="w-full text-white font-bold rounded-md transition-colors shadow-sm flex items-center justify-center tracking-wide"
                style={{ backgroundColor: '#f899a2', padding: '16px 0', fontSize: '17px', width: '100%', cursor: 'pointer', border: 'none' }}
              >
                COMPLETE ORDER - {selectedPkg.price}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
    </>
  );
}
