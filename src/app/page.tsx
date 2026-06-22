"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, ShoppingBag, ChevronLeft, ChevronRight, Smile, Activity, Wind, ShieldCheck, Star, Flame, HandCoins, ChevronDown, ChevronUp } from 'lucide-react';

const CustomCheck = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BeforeAfterSlider = () => {
  const [sliderPos, setSliderPos] = useState(50);
  
  return (
    <div className="ba-section">
      <h2 className="ba-title">Real Results</h2>
      <p className="ba-desc">See the difference our product makes.</p>
      
      <div className="relative w-full max-w-[400px] aspect-square rounded-full overflow-hidden bg-gray-200 mx-auto">
        
        {/* After Image (Background) */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          <img className="w-full h-full object-cover block" src="/assets/vulcare.png" alt="After" />
        </div>
        
        {/* Before Image (Foreground, clipped) */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
          <img className="w-full h-full object-cover block" src="/assets/bottle.png" alt="Before" />
        </div>

        {/* Invisible Range Slider for logic */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderPos} 
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 z-40 cursor-ew-resize m-0"
          style={{ WebkitAppearance: 'none', appearance: 'none' }}
        />

        {/* Visual Line and Handle */}
        <div className="absolute top-0 bottom-0 w-[3px] bg-white z-30 pointer-events-none -translate-x-1/2" style={{ left: `${sliderPos}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] bg-white rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.3)] text-[#333] gap-[2px]">
            <ChevronLeft size={16} />
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatisticsSection = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const stats = [
    { percent: 94, title: "of participants", desc: "noticed a positive difference in their wellbeing within weeks." },
    { percent: 89, title: "of users", desc: "reported fewer digestive issues when taking daily." },
    { percent: 97, title: "said they", desc: "would recommend Yu Turmeric to a friend or family member." }
  ];

  return (
    <section className="stats-section" ref={sectionRef}>
      <h2 className="stats-title">Backed by <span className="highlight-text">Real Results</span></h2>
      <div className="stats-list">
        {stats.map((stat, idx) => {
          const circumference = 2 * Math.PI * 34;
          const strokeDashoffset = inView ? circumference - (stat.percent / 100) * circumference : circumference;
          
          return (
            <div className="stat-item" key={idx}>
              <div className="stat-circle-container">
                <svg className="stat-svg" width="80" height="80" viewBox="0 0 80 80">
                  <circle className="stat-circle-bg" cx="40" cy="40" r="34" strokeWidth="2.5" />
                  <circle 
                    className="stat-circle-progress" 
                    cx="40" cy="40" r="34" 
                    strokeWidth="7" 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                  />
                </svg>
                <div className="stat-number">{stat.percent}%</div>
              </div>
              <div className="stat-text">
                <strong>{stat.title}</strong> {stat.desc}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-wave">
        <svg className="wave-layer wave-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,40 C120,80 240,0 360,40 C480,80 600,0 720,40 C840,80 960,0 1080,40 C1200,80 1320,0 1440,40 L1440,100 L0,100 Z"/>
        </svg>
        <svg className="wave-layer wave-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,60 C120,20 240,100 360,60 C480,20 600,100 720,60 C840,20 960,100 1080,60 C1200,20 1320,100 1440,60 L1440,100 L0,100 Z"/>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-subscribe">
          <h2>Subscribe to our emails</h2>
          <p>Join our email list for exclusive offers and the latest news.</p>
          <div className="subscribe-form">
            <input type="email" placeholder="Email" />
            <button aria-label="Subscribe">→</button>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom-grid">
          <div className="footer-logo">
            <span className="logo-box">Yu.</span>
          </div>
          
          <div className="footer-links">
            <h3>Products</h3>
            <ul>
              <li><a href="#">Shop All</a></li>
              <li><a href="#">Turmeric Gummies</a></li>
              <li><a href="#">Bundles</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function ProductPage() {
  const [selectedPackage, setSelectedPackage] = useState(2);
  const [purchaseType, setPurchaseType] = useState('subscribe');
  const [openAccordion, setOpenAccordion] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  
  const addToCartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the add-to-cart area is NOT intersecting (visible), show sticky bar
        setShowStickyBar(!entry.isIntersecting);
      },
      { root: null, threshold: 0 }
    );
    
    if (addToCartRef.current) {
      observer.observe(addToCartRef.current);
    }
    
    return () => {
      if (addToCartRef.current) {
        observer.unobserve(addToCartRef.current);
      }
    };
  }, []);

  const [mainImage, setMainImage] = useState('/assets/bottle.png');
  const [isFading, setIsFading] = useState(false);

  const images = ['/assets/bottle.png', '/assets/bundle.png', '/assets/vulcare.png'];

  const changeImage = useCallback((newImg: string) => {
    if (newImg === mainImage) return;
    setIsFading(true);
    setTimeout(() => {
      setMainImage(newImg);
      setIsFading(false);
    }, 200);
  }, [mainImage]);

  const handlePrevImage = useCallback(() => {
    const currentIndex = images.indexOf(mainImage);
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    changeImage(images[newIndex]);
  }, [mainImage, images, changeImage]);

  const handleNextImage = useCallback(() => {
    const currentIndex = images.indexOf(mainImage);
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    changeImage(images[newIndex]);
  }, [mainImage, images, changeImage]);

  const packages = [
    { id: 1, title: 'Single', price: '$45,00', originalPrice: '$50,00', sub: '$45,00/Bottle', img: '/assets/bottle.png', badge: null },
    { id: 2, title: '2 Bottles', price: '$79,00', originalPrice: '$100,00', sub: '$39,50/Bottle', img: '/assets/bundle.png', badge: 'Most Popular' },
    { id: 3, title: 'Bundle', price: '$106,00', originalPrice: '$150,00', sub: 'Turmeric/ Trimfit', img: '/assets/bundle.png', badge: 'Best Value' },
  ];

  const accordions = [
    { title: "Description", content: "Our organic turmeric gummies are formulated to provide maximum absorption. Blended with black pepper extract, these tasty gummies make it easy to get your daily dose of curcumin to support a healthy inflammatory response, joint health, and overall wellbeing." },
    { title: "How to Use", content: "Take 2 gummies daily, preferably with a meal. For best results, use consistently for at least 30 days." },
    { title: "Ingredients", content: "Organic Turmeric Root Extract (Curcuma longa), Black Pepper Extract (Piper nigrum), Organic Tapioca Syrup, Organic Cane Sugar, Water, Pectin, Citric Acid, Natural Flavors." }
  ];

  const currentPrice = purchaseType === 'subscribe' 
    ? packages.find(p => p.id === selectedPackage)?.price 
    : packages.find(p => p.id === selectedPackage)?.originalPrice;

  return (
    <>
      {/* Top Banner */}
      <div className="top-scroll-bar">
        <div className="scroll-track">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="scroll-content">
              <span className="scroll-item"><Flame size={20} className="icon-fire" /> HIGH DEMAND: SELLING OUT FAST</span>
              <span className="scroll-item"><Flame size={20} className="icon-fire" /> HIGH DEMAND: SELLING OUT FAST</span>
              <span className="scroll-item"><Flame size={20} className="icon-fire" /> HIGH DEMAND: SELLING OUT FAST</span>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <button className="menu-btn" aria-label="Menu"><Menu size={26} /></button>
        <div className="logo"><div className="logo-circle">Yu.</div></div>
        <button className="cart-btn" aria-label="Cart"><ShoppingBag size={26} /></button>
      </header>

      {/* Main Content */}
      <main className="product-container">
        <div className="product-grid">
          
          {/* Gallery Column */}
          <div className="desktop-gallery-column">
            {/* Hero Section */}
            <div className="hero-section">
              <button className="nav-arrow left" onClick={handlePrevImage}><ChevronLeft size={20} /></button>
              <div className="hero-image-clean">
                <img 
                  src={mainImage} 
                  alt="Yu Turmeric Bottle" 
                  style={{ opacity: isFading ? 0 : 1, transition: 'opacity 0.2s ease-in-out' }}
                />
              </div>
              <button className="nav-arrow right" onClick={handleNextImage}><ChevronRight size={20} /></button>
            </div>

            {/* Thumbnails */}
            <div className="thumbnails">
              {images.map((img, idx) => (
                <div 
                  key={idx}
                  className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                  onClick={() => changeImage(img)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Info Column */}
          <div className="desktop-info-column">
            
            {/* Product Info */}
            <div className="product-info">
              <div className="rating">
                <div className="stars">★★★★★</div>
                <div className="reviews">4.8 (8,300 Reviews)</div>
              </div>
              <h1 className="product-title">Enhanced Bioactive Turmeric</h1>
              
              <div className="product-price-container">
                <span className="product-price">{currentPrice}</span>
                <span className="product-original-price">{packages.find(p => p.id === selectedPackage)?.originalPrice}</span>
                <span className="main-save-badge">SAVE 10%</span>
              </div>
              
              <ul className="benefits-list">
                <li><CustomCheck className="check-icon" /> Promotes overall wellbeing and vitality</li>
                <li><CustomCheck className="check-icon" /> Supports a healthy immune system</li>
                <li><CustomCheck className="check-icon" /> Aids with digestion and gut health</li>
              </ul>
            </div>

            {/* Package Selection */}
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
                      <span className="pkg-original-price">{pkg.originalPrice}</span>
                      <div className="pkg-price-row">
                        <span className="pkg-price">{pkg.price}</span>
                      </div>
                    </div>
                    <img src={pkg.img} alt={pkg.title} className="pkg-img" />
                  </div>
                </label>
              ))}
            </div>



            {/* Guarantee Box */}
            <div className="guarantee-box">
              <div className="guarantee-title">30-DAY MONEY BACK GUARANTEE</div>
              <div className="guarantee-text">
                <HandCoins size={18} className="guarantee-icon" />
                <span><strong>100% Risk Free.</strong> Love it or your money back.</span>
              </div>
            </div>

            {/* Action Area */}
            <div className="action-area" ref={addToCartRef}>
              <div className="add-to-cart-container" onClick={() => {
                // Trigger ADD TO CART action
                console.log("Added to cart");
              }}>
                <button className="add-to-cart text-[28px] sm:text-[32px] py-4">
                  ADD TO CART
                </button>
                <div className="returns-info">
                  <ShieldCheck size={16} className="shield-icon" />
                  Free 30 Day Returns
                </div>
              </div>            </div>

            {/* Testimonial Box */}
            <div className="testimonial-box">
              <div className="testimonial-content">
                <img src="/assets/vulcare.png" alt="Sarah T." className="testimonial-avatar" />
                <div className="testimonial-text">
                  "I've been taking this turmeric for a month and the difference in my joints is incredible. I can finally garden without pain!"
                </div>
              </div>
              <div className="testimonial-footer">
                <div className="stars">★★★★★</div>
                <div className="testimonial-author">Sarah T. - Verified Buyer</div>
              </div>
            </div>

            {/* Accordions */}
            <div className="product-accordions">
              {accordions.map((acc, idx) => (
                <div className="accordion-item" key={idx}>
                  <button className="accordion-header" onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)}>
                    <span>{acc.title}</span>
                    {openAccordion === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  {openAccordion === idx && (
                    <div className="accordion-body">
                      <p>{acc.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <BeforeAfterSlider />
            <StatisticsSection />

          </div>
        </div>
      </main>
      <Footer />

      {/* Sticky Bottom Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.08)] border-t border-gray-100 z-50 transition-transform duration-300 transform ${showStickyBar ? 'translate-y-0' : 'translate-y-[120%]'}`}
      >
        <div className="max-w-[1200px] mx-auto px-4 py-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-extrabold text-[14px] sm:text-[16px] text-[#222]">
              Enhanced Bioactive Turmeric - {packages.find(p => p.id === selectedPackage)?.title}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[20px] sm:text-[24px] text-[#0a2e5c]">
                {packages.find(p => p.id === selectedPackage)?.price}
              </span>
              <span className="text-[14px] sm:text-[16px] text-gray-500 line-through">
                {packages.find(p => p.id === selectedPackage)?.originalPrice}
              </span>
            </div>
          </div>
          <button 
            className="bg-[#0a2e5c] text-white font-bold text-[18px] sm:text-[20px] px-8 py-4 rounded-full hover:bg-[#072145] transition-colors whitespace-nowrap ml-4"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Add to cart
          </button>
        </div>
      </div>
    </>
  );
}