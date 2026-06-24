import React from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const Header = ({ store }: { store?: any }) => {
  return (
    <header className="header">
      <button className="menu-btn" aria-label="Menu"><Menu size={26} /></button>
      <Link href={store?.domain ? `/${store.domain}` : '/'} className="logo">
        {store?.logo_url ? (
          <img src={store.logo_url} alt={store?.store_name || "Store Logo"} className="max-h-8 w-auto max-w-[220px] object-contain" />
        ) : (
          <div className="logo-circle">Yu.</div>
        )}
      </Link>
      <button className="cart-btn" aria-label="Cart" style={{ position: 'relative' }}>
        <ShoppingBag size={26} />
      </button>
    </header>
  );
};
