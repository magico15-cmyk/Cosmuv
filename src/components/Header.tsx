import React from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const Header = ({ store }: { store?: any }) => {
  return (
    <header className="header relative grid grid-cols-3 items-center">
      <div className="flex items-center justify-start gap-6">
        <button className="menu-btn md:hidden" aria-label="Menu">
          <Menu size={26} />
        </button>
        <nav className="hidden md:flex items-center gap-6 font-medium text-[15px]">
          <Link href="/about" className="hover:text-brand-500 transition-colors">About Us</Link>
          <Link href="/shipping" className="hover:text-brand-500 transition-colors">Shipping</Link>
          <Link href="/faq" className="hover:text-brand-500 transition-colors">FAQ</Link>
        </nav>
      </div>

      <div className="flex justify-center">
        <Link href={store?.domain ? `/${store.domain}` : '/'} className="logo">
          {store?.logo_url ? (
            <img src={store.logo_url} alt={store?.store_name || "Store Logo"} className="max-h-8 w-auto max-w-[220px] object-contain" />
          ) : (
            <div className="logo-circle">Yu.</div>
          )}
        </Link>
      </div>

      <div className="flex items-center justify-end">
        <button className="cart-btn" aria-label="Cart" style={{ position: 'relative' }}>
          <ShoppingBag size={26} />
        </button>
      </div>
    </header>
  );
};
