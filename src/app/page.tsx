"use client";

import React, { useState } from 'react';
import { Menu, ShoppingBag, ChevronLeft, ChevronRight, Smile, Activity, Wind, ShieldCheck, Star, Flame } from 'lucide-react';

const CustomCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="26" height="26" className={className}>
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
  </svg>
);

export default function ProductPage() {
  const [selectedPackage, setSelectedPackage] = useState(2);
  const [purchaseType, setPurchaseType] = useState('subscribe');

  const packages = [
    { id: 1, title: 'Single', price: '$45,00', originalPrice: '$55,00', sub: '$45,00/Bottle', img: '/assets/bottle.png', badge: null },
    { id: 2, title: '2 Bottles', price: '$79,00', originalPrice: '$90,00', sub: '$39,50/Bottle', img: '/assets/bundle.png', badge: 'Most Popular' },
    { id: 3, title: 'Bundle', price: '$106,00', originalPrice: '$135,00', sub: 'Turmeric/ Trimfit', img: '/assets/bundle.png', badge: 'Best Value' },
  ];

  return (
    <>
      <div className="top-scroll-bar">
        <div className="scroll-text">
          <div className="scroll-track">
            <div className="scroll-content">
              <div className="scroll-item">
                <Flame size={22} className="icon-fire" />
                Be among the lucky ones to get it!
              </div>
              <div className="scroll-item">
                <Flame size={22} className="icon-fire" />
                The favorite choice of thousands of customers!
              </div>
              <div className="scroll-item">
                <Flame size={22} className="icon-fire" />
                Be among the lucky ones to get it!
              </div>
              <div className="scroll-item">
                <Flame size={22} className="icon-fire" />
                The favorite choice of thousands of customers!
              </div>
            </div>
            
            <div className="scroll-content" aria-hidden="true">
              <div className="scroll-item">
                <Flame size={22} className="icon-fire" />
                Be among the lucky ones to get it!
              </div>
              <div className="scroll-item">
                <Flame size={22} className="icon-fire" />
                The favorite choice of thousands of customers!
              </div>
              <div className="scroll-item">
                <Flame size={22} className="icon-fire" />
                Be among the lucky ones to get it!
              </div>
              <div className="scroll-item">
                <Flame size={22} className="icon-fire" />
                The favorite choice of thousands of customers!
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="header">
        <button className="menu-btn"><Menu size={24} /></button>
        <div className="logo">
          <div className="logo-circle">Yū</div>
        </div>
        <button className="cart-btn"><ShoppingBag size={24} /></button>
      </header>

      <main className="product-container">
        <div className="product-grid">
          <div className="desktop-gallery-column">
            {/* Hero Section */}
            <div className="hero-section">
              <button className="nav-arrow left"><ChevronLeft size={20} /></button>
              <div className="hero-image-clean">
                <img src="/assets/bottle.png" alt="Yu Turmeric Bottle" />
              </div>
              <button className="nav-arrow right"><ChevronRight size={20} /></button>
            </div>

            {/* Thumbnails */}
            <div className="thumbnails">
              <div className="thumbnail active">
                <img src="/assets/bottle.png" alt="Thumbnail 1" />
              </div>
              <div className="thumbnail">
                <img src="/assets/bundle.png" alt="Thumbnail 2" />
              </div>
            </div>
          </div>

          <div className="desktop-details-column">
            {/* Product Info */}
            <div className="product-info">
              <div className="rating">
                <div className="stars">
                  <Star size={20} fill="var(--primary-pink)" color="var(--primary-pink)" className="inline" />
                  <Star size={20} fill="var(--primary-pink)" color="var(--primary-pink)" className="inline" />
                  <Star size={20} fill="var(--primary-pink)" color="var(--primary-pink)" className="inline" />
                  <Star size={20} fill="var(--primary-pink)" color="var(--primary-pink)" className="inline" />
                  <Star size={20} fill="var(--primary-pink)" color="var(--primary-pink)" className="inline" />
                </div>
                <span className="reviews">Excellent 4.8 | 88,552 Reviews</span>
              </div>
              
              <h1 className="product-title">Enhanced Bioactive Turmeric</h1>
              <div className="product-price-container">
                <span className="product-price">
                  {packages.find(p => p.id === selectedPackage)?.price}
                </span>
                <span className="product-original-price">
                  {packages.find(p => p.id === selectedPackage)?.originalPrice}
                </span>
              </div>
            </div>

            {/* Benefits List */}
            <ul className="benefits-list">
              <li><CustomCheck className="check-icon" /> Helps combat inflammation</li>
              <li><CustomCheck className="check-icon" /> Use for better sleep or daytime stress relief</li>
              <li><CustomCheck className="check-icon" /> Organic fermented turmeric boosts curcumin absorption by 17x</li>
            </ul>

            {/* Package Options */}
            <div className="package-options">
              {packages.map((pkg) => (
                <label key={pkg.id} className={`package-card ${selectedPackage === pkg.id ? 'active' : ''}`}>
                  {pkg.badge && <div className="badge">{pkg.badge}</div>}
                  <input 
                    type="radio" 
                    name="package" 
                    checked={selectedPackage === pkg.id} 
                    onChange={() => setSelectedPackage(pkg.id)}
                  />
                  <div className="card-content">
                    <div className="radio-wrapper">
                      <div className="radio-circle"></div>
                    </div>
                    <div className="pkg-title">{pkg.title}</div>
                    <div className="pkg-price-container">
                      {pkg.originalPrice && (
                        <div className="pkg-original-price">{pkg.originalPrice}</div>
                      )}
                      <div className="pkg-price">{pkg.price}</div>
                    </div>
                    <div className="pkg-sub">{pkg.sub}</div>
                    <img src={pkg.img} alt={pkg.title} className="pkg-img" />
                  </div>
                </label>
              ))}
            </div>

            {/* Action Area */}
            <div className="action-area">
              <div className="add-to-cart-container">
                <button className="add-to-cart">
                  ADD TO CART ({packages.find(p => p.id === selectedPackage)?.price})
                </button>
                <div className="returns-info">
                  <ShieldCheck size={14} className="shield-icon" />
                  Free 30 Day Returns
                </div>
              </div>
              
              <div className="payment-methods">
                <span style={{fontWeight: 600, color: 'var(--text-muted)'}}>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
