"use client";

import React, { useState } from 'react';
import { Menu, ShoppingBag, Search, User, X } from 'lucide-react';
import Link from 'next/link';

export const Header = ({ store }: { store?: any }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const mainMenu = store?.menus?.find((m: any) => m.slug === 'main-menu');

  const defaultDesktop = ["menu", "logo", "search", "account", "cart"];
  const defaultMobile = ["menu", "logo", "cart"];

  const desktopLayout = store?.header_desktop_layout || defaultDesktop;
  const mobileLayout = store?.header_mobile_layout || defaultMobile;

  const mobileBgColor = store?.header_bg_color || '#FFFFFF';
  const mobileButtonColor = store?.header_button_color || '#171717';
  const mobileBorderEnabled = store?.header_border_enabled ?? true;
  const mobileBorderColor = store?.header_border_color || '#F0F0F0';

  const desktopBgColor = store?.header_desktop_bg_color || '#FFFFFF';
  const desktopButtonColor = store?.header_desktop_button_color || '#171717';
  const desktopBorderEnabled = store?.header_desktop_border_enabled ?? true;
  const desktopBorderColor = store?.header_desktop_border_color || '#F0F0F0';

  const renderDesktopItem = (type: string, i: number) => {
    switch (type) {
      case 'menu':
        return (
          <nav key={`d-${i}`} className="hidden md:flex items-center gap-8 font-semibold text-[13px] tracking-[0.1em] uppercase text-gray-600">
            {mainMenu ? (
              mainMenu.items.map((item: any, idx: number) => (
                <Link key={idx} href={item.url} className="group relative py-1 hover:text-[var(--primary-pink)] transition-colors duration-200">
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--primary-pink)] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"></span>
                </Link>
              ))
            ) : (
              <>
                <Link href="/" className="group relative py-1 hover:text-[var(--primary-pink)] transition-colors duration-200">Home</Link>
                <Link href="/pages/about-us" className="group relative py-1 hover:text-[var(--primary-pink)] transition-colors duration-200">About Us</Link>
                <Link href="/pages/shipping" className="group relative py-1 hover:text-[var(--primary-pink)] transition-colors duration-200">Shipping</Link>
                <Link href="/pages/faq" className="group relative py-1 hover:text-[var(--primary-pink)] transition-colors duration-200">FAQ</Link>
              </>
            )}
          </nav>
        );
      case 'logo':
        return (
          <Link key={`d-${i}`} href={store?.domain ? `/${store.domain}` : '/'} className="logo flex-shrink-0 flex-grow text-center md:flex-grow-0 md:text-left flex justify-center">
            {store?.logo_url ? (
              <img src={store.logo_url} alt={store?.store_name || "Store Logo"} className="max-h-8 w-auto max-w-[220px] object-contain" />
            ) : (
              <div className="text-[28px] font-bold tracking-tight header-item-desktop">{store?.header_logo_text || 'Sello.'}</div>
            )}
          </Link>
        );
      case 'search':
        return (
          <button key={`d-${i}`} className="hidden md:block hover:opacity-70 transition-opacity header-item-desktop" aria-label="Search">
            <Search size={22} />
          </button>
        );
      case 'account':
        return (
          <Link key={`d-${i}`} href="/account" className="hidden md:block hover:opacity-70 transition-opacity header-item-desktop" aria-label="Account">
            <User size={22} />
          </Link>
        );
      case 'cart':
        return (
          <button key={`d-${i}`} onClick={() => setIsCartOpen(true)} className="hidden md:block cart-btn hover:opacity-70 transition-opacity relative header-item-desktop" aria-label="Cart">
            <ShoppingBag size={22} />
          </button>
        );
      default:
        return null;
    }
  };

  const renderMobileItem = (type: string, i: number) => {
    switch (type) {
      case 'menu':
        return (
          <button key={`m-${i}`} onClick={() => setIsMobileMenuOpen(true)} className="md:hidden hover:opacity-70 transition-opacity header-item-mobile" aria-label="Menu">
            <Menu size={26} />
          </button>
        );
      case 'logo':
        return (
          <Link key={`m-${i}`} href={store?.domain ? `/${store.domain}` : '/'} className="md:hidden logo flex-shrink-0 flex-grow flex justify-center">
            {store?.logo_url ? (
              <img src={store.logo_url} alt={store?.store_name || "Store Logo"} className="max-h-8 w-auto max-w-[220px] object-contain" />
            ) : (
              <div className="text-[28px] font-bold tracking-tight header-item-mobile">{store?.header_logo_text || 'Sello.'}</div>
            )}
          </Link>
        );
      case 'search':
        return (
          <button key={`m-${i}`} className="md:hidden hover:opacity-70 transition-opacity header-item-mobile" aria-label="Search">
            <Search size={22} />
          </button>
        );
      case 'account':
        return (
          <Link key={`m-${i}`} href="/account" className="md:hidden hover:opacity-70 transition-opacity header-item-mobile" aria-label="Account">
            <User size={22} />
          </Link>
        );
      case 'cart':
        return (
          <button key={`m-${i}`} onClick={() => setIsCartOpen(true)} className="md:hidden cart-btn hover:opacity-70 transition-opacity relative header-item-mobile" aria-label="Cart">
            <ShoppingBag size={22} />
          </button>
        );
      default:
        return null;
    }
  };

  // Group items to maintain a nice flex layout. 
  // Let's assume:
  // - everything before 'logo' goes to the left group
  // - 'logo' is in the center group
  // - everything after 'logo' goes to the right group
  // This allows the logo to easily stay centered or flex-positioned.
  const desktopLogoIndex = desktopLayout.indexOf('logo');
  const dLeft = desktopLogoIndex !== -1 ? desktopLayout.slice(0, desktopLogoIndex) : desktopLayout;
  const dRight = desktopLogoIndex !== -1 ? desktopLayout.slice(desktopLogoIndex + 1) : [];

  const mobileLogoIndex = mobileLayout.indexOf('logo');
  const mLeft = mobileLogoIndex !== -1 ? mobileLayout.slice(0, mobileLogoIndex) : mobileLayout;
  const mRight = mobileLogoIndex !== -1 ? mobileLayout.slice(mobileLogoIndex + 1) : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .header-responsive {
          background-color: ${mobileBgColor};
          border-bottom: ${mobileBorderEnabled ? `1px solid ${mobileBorderColor}` : 'none'};
        }
        .header-item-mobile { color: ${mobileButtonColor} !important; }
        
        @media (min-width: 768px) {
          .header-responsive {
            background-color: ${desktopBgColor};
            border-bottom: ${desktopBorderEnabled ? `1px solid ${desktopBorderColor}` : 'none'};
          }
          .header-item-desktop { color: ${desktopButtonColor} !important; }
        }
      `}} />
      <header className="header header-responsive relative w-full">
      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex items-center justify-between h-12 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-8 flex-1">
          {dLeft.map((item: string, i: number) => renderDesktopItem(item, i))}
        </div>
        
        {desktopLogoIndex !== -1 && (
          <div className="flex justify-center flex-shrink-0">
            {renderDesktopItem('logo', desktopLogoIndex)}
          </div>
        )}

        <div className="flex items-center gap-6 justify-end flex-1">
          {dRight.map((item: string, i: number) => renderDesktopItem(item, i))}
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="flex md:hidden items-center justify-between h-10 px-4 w-full">
        <div className="flex items-center gap-4 flex-1">
          {mLeft.map((item: string, i: number) => renderMobileItem(item, i))}
        </div>
        
        {mobileLogoIndex !== -1 && (
          <div className="flex justify-center flex-shrink-0">
            {renderMobileItem('logo', mobileLogoIndex)}
          </div>
        )}

        <div className="flex items-center gap-4 justify-end flex-1">
          {mRight.map((item: string, i: number) => renderMobileItem(item, i))}
        </div>
      </div>
    </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Slide-out Menu */}
          <div className="relative flex flex-col w-4/5 max-w-sm h-full bg-white shadow-xl animate-in slide-in-from-left">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-xl font-bold font-menu">{store?.header_logo_text || 'Sello.'}</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-6 flex flex-col font-menu">
              {mainMenu ? (
                mainMenu.items.map((item: any, idx: number) => (
                  <Link 
                    key={idx} 
                    href={item.url} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg text-gray-800 hover:text-[var(--primary-pink)] py-5 border-b border-gray-200 last:border-0 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))
              ) : (
                <>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-800 hover:text-[var(--primary-pink)] py-5 border-b border-gray-200 transition-colors">Home</Link>
                  <Link href="/pages/about-us" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-800 hover:text-[var(--primary-pink)] py-5 border-b border-gray-200 transition-colors">About Us</Link>
                  <Link href="/pages/shipping" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-800 hover:text-[var(--primary-pink)] py-5 border-b border-gray-200 transition-colors">Shipping</Link>
                  <Link href="/pages/faq" onClick={() => setIsMobileMenuOpen(false)} className="text-lg text-gray-800 hover:text-[var(--primary-pink)] py-5 border-b border-gray-200 transition-colors">FAQ</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity" 
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Slide-out Cart Panel (Right side) */}
          <div className="relative flex flex-col w-4/5 max-w-sm h-full bg-white shadow-xl animate-in slide-in-from-right ml-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-xl font-bold font-menu flex items-center gap-2">
                <ShoppingBag size={20} />
                Your Cart
              </span>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-2">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Your cart is empty</h3>
              <p className="text-gray-500 max-w-[250px]">Looks like you haven't added anything to your cart yet.</p>
              
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-8 py-3 bg-[var(--primary-pink)] text-white font-medium rounded-full hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
