import React from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="header">
      <button className="menu-btn" aria-label="Menu"><Menu size={26} /></button>
      <Link href="/" className="logo"><div className="logo-circle">Yu.</div></Link>
      <button className="cart-btn" aria-label="Cart" style={{ position: 'relative' }}>
        <ShoppingBag size={26} />
      </button>
    </header>
  );
};
