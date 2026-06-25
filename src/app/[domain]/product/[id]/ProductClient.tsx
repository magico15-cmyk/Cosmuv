"use client";

import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import { Menu, ShoppingBag, ChevronLeft, ChevronRight, Smile, Activity, Wind, ShieldCheck, Star, Flame, HandCoins, ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const CustomCheck = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
  </svg>
);

const testimonialsData = [
  {
    text: "I've been taking this turmeric for a month and the difference in my joints is incredible. I can finally garden without pain!",
    author: "Sarah T. - Verified Buyer",
    img: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    text: "My digestion has never been better. I started seeing results in just a few weeks. Highly recommended to anyone looking for a natural boost.",
    author: "James M. - Verified Buyer",
    img: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    text: "I love the fact that these are organic. My energy levels are up, and my morning stiffness is completely gone. Will be ordering more!",
    author: "Emily R. - Verified Buyer",
    img: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const TestimonialCarousel = ({ data, primaryColor }: { data: { quote: string, author: string, avatar: string }[], primaryColor: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (data && data.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % data.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [data]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    if (touchStartX.current - touchEndX.current > 50 && data?.length) {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }
    if (touchEndX.current - touchStartX.current > 50 && data?.length) {
      setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
    }
  };

  return (
    <div className="testimonial-box relative overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="grid">
        {data?.map((t, idx) => (
          <div 
            key={idx} 
            className="col-start-1 row-start-1 w-full transition-transform duration-500 ease-in-out pb-1"
            style={{ 
              transform: `translateX(${(idx - currentIndex) * 100}%)`,
              opacity: currentIndex === idx ? 1 : 0,
              pointerEvents: currentIndex === idx ? 'auto' : 'none'
            }}
          >
            <div className="flex flex-col justify-between h-full">
              <div className="testimonial-content">
                {t.avatar && <img src={t.avatar} alt={t.author} className="testimonial-avatar object-cover" />}
                <div className="testimonial-text">"{t.quote}"</div>
              </div>
              <div className="testimonial-footer">
                <div className="stars">★★★★★</div>
                <div className="testimonial-author">{t.author}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {data?.map((_, idx) => (
          <button 
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors`}
            style={{ backgroundColor: currentIndex === idx ? primaryColor : '#d1d5db' }}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const BeforeAfterSlider = ({ data }: { data: { title: string, subtitle: string, titleAlign?: any, subtitleAlign?: any, beforeImage: string, afterImage: string } }) => {
    const [sliderPos, setSliderPos] = useState(50);
    
    return (
      <div className="ba-section">
        <div className="ba-title" style={{ textAlign: data?.titleAlign || 'center' }} dangerouslySetInnerHTML={{ __html: data?.title || 'Real Results' }} />
        <div className="ba-desc" style={{ textAlign: data?.subtitleAlign || 'center' }} dangerouslySetInnerHTML={{ __html: data?.subtitle || 'See the difference our product makes.' }} />
      
      <div className="relative w-full max-w-[400px] aspect-square rounded-full overflow-hidden bg-gray-200 mx-auto">
        
        {/* After Image (Background) */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {data?.afterImage && <img className="w-full h-full object-cover block" src={data.afterImage} alt="After" />}
        </div>
        
        {/* Before Image (Foreground, clipped) */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
          {data?.beforeImage && <img className="w-full h-full object-cover block" src={data.beforeImage} alt="Before" />}
        </div>

        {/* Invisible Range Slider for logic */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={sliderPos} 
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 z-40 cursor-grab active:cursor-grabbing m-0"
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

const StatisticsSection = ({ data }: { data: { title: string, items: { percentage: string, label: string, description: string }[] } }) => {
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

  return (
    <section className="stats-section" ref={sectionRef}>
      <h2 className="stats-title">{data?.title || "Backed by Real Results"}</h2>
      <div className="stats-list">
        {data?.items?.map((stat, idx) => {
          const percentVal = parseFloat(stat.percentage) || 0;
          const circumference = 2 * Math.PI * 34;
          const strokeDashoffset = inView ? circumference - (percentVal / 100) * circumference : circumference;
          
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
                <div className="stat-number">{stat.percentage}%</div>
              </div>
              <div className="stat-text">
                <strong>{stat.label}</strong> {stat.description}
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
        <svg className="wave-layer wave-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,50 C120,90 240,10 360,50 C480,90 600,10 720,50 C840,90 960,10 1080,50 C1200,90 1320,10 1440,50 L1440,100 L0,100 Z"/>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-subscribe">
          <h2>Subscribe to our emails</h2>
          <p>Join our email list for exclusive offers and the latest news.</p>
          <div className="subscribe-form">
            <input type="email" placeholder="Email" suppressHydrationWarning />
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

export default function ProductClient({ initialProduct, store }: { initialProduct: any, store?: any }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(initialProduct);
  const [purchaseType, setPurchaseType] = useState('subscribe');
  const [selectedPackage, setSelectedPackage] = useState(2);
  const [showStickyBar, setShowStickyBar] = useState(false);
  
  const primaryColor = store?.primary_color || '#f899a2';
  const guaranteeColor = store?.guarantee_color || '#1fb6ff';
  const currencySymbol = store?.currency || '$';

  const [mainImage, setMainImage] = useState<string>(() => {
    if (initialProduct?.image) {
      try {
        const imgs = JSON.parse(initialProduct.image);
        if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
      } catch (e) {}
    }
    return '';
  });

  const [openAccordion, setOpenAccordion] = useState<string | number | null>(() => {
    if (initialProduct?.content_blocks) {
      const firstAccordionIdx = initialProduct.content_blocks.findIndex((b: any) => b.type === 'accordion');
      if (firstAccordionIdx !== -1) return `${firstAccordionIdx}-0`;
    }
    return 0;
  });

  const [isFading, setIsFading] = useState(false);
  
  const addToCartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar ONLY if the add-to-cart area is scrolled past (exited top of screen)
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
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
  }, [product]);

  let images: string[] = [];
  try {
    if (product?.image) {
      const parsed = JSON.parse(product.image);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter((i: any) => i && typeof i === 'string' && i.trim() !== '');
        if (valid.length > 0) images = valid;
      } else if (typeof parsed === 'string' && parsed.trim() !== '') {
        images = [parsed];
      }
    } else if (typeof product?.image === 'string' && product.image.trim() !== '') {
      images = [product.image];
    }
  } catch (e) {
    if (typeof product?.image === 'string' && product.image.trim() !== '') {
      images = [product.image];
    }
  }

  const changeImage = useCallback((newImg: string) => {
    if (newImg === mainImage) return;
    setMainImage(newImg);
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

  const ratingBlock = product?.content_blocks?.find((b: any) => b.type === 'rating');
  const featuresBlock = product?.content_blocks?.find((b: any) => b.type === 'features');
  const bundlesBlock = product?.content_blocks?.find((b: any) => b.type === 'bundles');

  const formatPrice = (p: string) => {
    if (!p) return p;
    let str = String(p).trim().replace('$', '');
    if (!str.includes('.')) {
      str = str + '.00';
    }
    return `${str} ${currencySymbol}`;
  };

  const packages = (bundlesBlock ? bundlesBlock.content : [
    { title: 'Single', price: `$${product?.price || '45.00'}`, originalPrice: `$${product?.originalPrice || '50.00'}`, sub: `$${product?.price || '45.00'}/Bottle`, img: images[0] || '/assets/bottle.png', badge: null },
    { title: '2 Bottles', price: `$${(product?.price * 2 * 0.9).toFixed(2) || '79.00'}`, originalPrice: `$${(product?.originalPrice * 2).toFixed(2) || '100.00'}`, sub: `$${(product?.price * 0.9).toFixed(2) || '39.50'}/Bottle`, img: images[1] || '/assets/bundle.png', badge: 'Most Popular' },
    { title: 'Bundle', price: `$${(product?.price * 3 * 0.8).toFixed(2) || '106.00'}`, originalPrice: `$${(product?.originalPrice * 3).toFixed(2) || '150.00'}`, sub: 'Best Value Deal', img: images[2] || '/assets/bundle.png', badge: 'Best Value' },
  ]).map((pkg: any, idx: number) => ({ 
    ...pkg, 
    id: idx + 1,
    price: formatPrice(pkg.price),
    originalPrice: formatPrice(pkg.originalPrice)
  }));



  const currentPkg = packages.find((p: any) => p.id === selectedPackage);
  const currentPrice = purchaseType === 'subscribe' 
    ? currentPkg?.price 
    : currentPkg?.originalPrice;

  let savingsPct = 0;
  if (currentPkg && currentPrice) {
    const priceNum = parseFloat(currentPrice.replace(/[^0-9,]/g, '').replace(',', '.'));
    const origNum = parseFloat(currentPkg.originalPrice.replace(/[^0-9,]/g, '').replace(',', '.'));
    if (origNum && priceNum && origNum > priceNum) {
      savingsPct = Math.round((1 - priceNum / origNum) * 100);
    }
  }



  return (
    <div dir={store?.store_rtl ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col bg-gray-50">
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
      <header className="header bg-white">
        <button className="menu-btn" aria-label="Menu" onClick={() => router.push('/')}><Menu size={26} /></button>
        <div className="logo" onClick={() => router.push('/')}>
          {store?.logo_url ? (
            <img src={store.logo_url} alt={store?.store_name || "Store Logo"} className="max-h-8 w-auto max-w-[220px] object-contain cursor-pointer" />
          ) : (
            <div className="logo-circle cursor-pointer">Yu.</div>
          )}
        </div>
        <button className="cart-btn" aria-label="Cart" style={{ position: 'relative' }}>
          <ShoppingBag size={26} />
        </button>
      </header>

      {/* Main Content */}
      <main className="product-container">
        <div className="product-grid">
          
          {/* Gallery Column */}
          <div className="desktop-gallery-column">
            {/* Hero Section */}
            <div className="hero-section">
              {images.length > 1 && (
                <button className="nav-arrow left" onClick={handlePrevImage}><ChevronLeft size={20} /></button>
              )}
              <div className="hero-image-clean">
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  {images.length > 0 ? (
                    images.map((img, idx) => (
                      <img
                        key={img}
                        src={img}
                        alt={`Product image ${idx + 1}`}
                        style={{
                          position: idx === 0 ? 'relative' : 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          opacity: mainImage === img ? 1 : 0,
                          transition: 'opacity 0.3s ease-in-out',
                          pointerEvents: mainImage === img ? 'auto' : 'none',
                        }}
                      />
                    ))
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <span>No image available</span>
                    </div>
                  )}
                </div>
              </div>
              {images.length > 1 && (
                <button className="nav-arrow right" onClick={handleNextImage}><ChevronRight size={20} /></button>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
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
            )}
          </div>

          {/* Info Column */}
          <div className="desktop-info-column">
            
            {/* Product Info */}
            <div className="product-info">
              {ratingBlock && (
                <div className="rating">
                  <div className="stars">★★★★★</div>
                  <div className="reviews">{ratingBlock.content.score} ({ratingBlock.content.reviews} Reviews)</div>
                </div>
              )}
              <h1 className="product-title">{product?.name}</h1>
              
              <div className="product-price-container">
                <span className="product-price">{currentPrice}</span>
                <span className="product-original-price">{currentPkg?.originalPrice}</span>
                {savingsPct > 0 && <span className="main-save-badge">SAVE {savingsPct}%</span>}
              </div>
              
              {featuresBlock && (
                <ul className="benefits-list">
                  {featuresBlock.content.map((feature: string, fIdx: number) => (
                    <li key={fIdx}><CustomCheck className="check-icon" /> {feature}</li>
                  ))}
                </ul>
              )}
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
                    {(pkg.img || pkg.image) ? (
                      <img src={pkg.img || pkg.image} alt={pkg.title} className="pkg-img" />
                    ) : (
                      <div className="pkg-img" style={{ backgroundColor: '#f3f4f6' }} />
                    )}
                  </div>
                </label>
              ))}
            </div>



            {/* Guarantee Box */}
            <div className="guarantee-box">
              <div className="guarantee-title">30-DAY MONEY BACK GUARANTEE</div>
              <div className="guarantee-text">
                <HandCoins size={22} className="guarantee-icon" />
                <span><strong>100% Risk Free.</strong> Love it or your money back.</span>
              </div>
            </div>

            {/* Action Area */}
            <div className="action-area" ref={addToCartRef}>
              <div className="add-to-cart-container btn-shine" onClick={() => {
                if (product?.id) {
                  router.push(`/checkout?productId=${product.id}&package=${selectedPackage}`);
                }
              }}>
                <button className="add-to-cart text-[28px] sm:text-[32px]">
                  ORDER NOW
                </button>
                <div className="returns-info">
                  <ShieldCheck size={16} className="shield-icon" />
                  Free 30 Day Returns
                </div>
              </div>
            </div>



            {/* Dynamic Content Blocks */}
            <div className="dynamic-blocks-container mb-20 flex flex-col gap-10">
              {product?.content_blocks?.map((block: any, idx: number) => {
                switch (block.type) {
                    case 'text': {
                      const content = typeof block.content === 'string' 
                        ? { text: block.content, align: 'left', color: '#4B5563' }
                        : block.content || { text: '', align: 'left', color: '#4B5563' };
                      
                      return (
                        <div 
                          key={idx} 
                          className="leading-relaxed whitespace-pre-wrap"
                          style={{ textAlign: content.align, color: content.color || '#4B5563' }}
                          dangerouslySetInnerHTML={{ __html: content.text }}
                        />
                      );
                    }
                    case 'heading': {
                      const content = typeof block.content === 'string' 
                        ? { text: block.content, align: 'left', color: '#111827' }
                        : block.content || { text: '', align: 'left', color: '#111827' };
                      return (
                        <div 
                          key={idx} 
                          className="text-2xl font-bold mt-8 mb-4"
                          style={{ textAlign: content.align, color: content.color }}
                          dangerouslySetInnerHTML={{ __html: content.text }}
                        />
                      );
                    }
                  case 'image':
                  case 'gif':
                    return <img key={idx} src={block.content} alt="Product content" className="w-[92%] mx-auto block rounded-2xl object-cover" />;
                  case 'features':
                  case 'bundles':
                  case 'rating':
                  default:
                    // Handled in the fixed top section
                    return null;
                  case 'trust_marquee':
                    return (
                      <div key={idx} className="mb-8 relative overflow-hidden" style={{ height: '40px', marginLeft: '-20px', marginRight: '-20px', backgroundColor: primaryColor, color: '#fff' }}>
                        <div className="absolute top-0 left-0 h-full flex items-center scroll-track" style={{ animationDuration: '20s', width: 'max-content' }}>
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="scroll-content flex items-center h-full">
                              {(Array.isArray(block.content) ? block.content : []).map((item: string, itemIdx: number) => (
                                <span key={itemIdx} className="scroll-item whitespace-nowrap">{item}</span>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  case 'comparison': {
                    const highlightWord = block.content.highlightWord || '';
                    const titleParts = block.content.title?.split(highlightWord) || [block.content.title];
                    return (
                      <div key={idx} className="comparison-section my-8">
                        <h2 className="text-3xl font-bold text-center mb-4">
                          {titleParts[0]}
                          {highlightWord && <span style={{ color: primaryColor }}>{highlightWord}</span>}
                          {titleParts.slice(1).join(highlightWord)}
                        </h2>
                        {block.content.description && (
                          <p className="text-center text-gray-600 mb-8 max-w-[90%] mx-auto">
                            {block.content.description}
                          </p>
                        )}
                        <div className="comparison-table-container mx-auto max-w-[92%]">
                          <table className="comparison-table w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                            <thead>
                              <tr>
                                <th className="empty-corner border-none bg-transparent"></th>
                                <th className="store-col-header text-white font-bold py-2.5 px-4 rounded-tl-xl" style={{ backgroundColor: primaryColor }}>
                                  {block.content.storeName || store?.store_name}
                                </th>
                                <th className="others-col-header text-black font-bold py-2.5 px-4 bg-white rounded-tr-xl border-t border-r border-b border-gray-200">
                                  {block.content.competitorName || 'Others'}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {block.content.rows?.map((row: any, i: number) => {
                                const isFirst = i === 0;
                                const isLast = i === (block.content.rows?.length || 0) - 1;
                                return (
                                  <tr key={i}>
                                    <td className={`feature-col text-white font-bold py-2.5 px-4 ${isFirst ? 'rounded-tl-xl' : ''} ${isLast ? 'rounded-bl-xl' : ''}`} style={{ backgroundColor: primaryColor, borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>
                                      {row.feature}
                                    </td>
                                    <td className={`store-col text-center py-2.5 bg-white border-b border-r border-gray-200`}>
                                      {row.store ? (
                                        <Check size={24} color="#22c55e" className="mx-auto" />
                                      ) : (
                                        <X size={24} color="#111827" className="mx-auto" />
                                      )}
                                    </td>
                                    <td className={`others-col text-center py-2.5 bg-white border-b border-r border-gray-200 ${isLast ? 'rounded-br-xl' : ''}`}>
                                      {row.others ? (
                                        <Check size={24} color="#22c55e" className="mx-auto" />
                                      ) : (
                                        <X size={24} color="#111827" className="mx-auto" />
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  }
                  case 'testimonials':
                    return <TestimonialCarousel key={idx} data={block.content} primaryColor={primaryColor} />;
                  case 'accordion':
                    return (
                      <div className="product-accordions !mt-0" key={idx}>
                        {block.content.map((acc: any, accIdx: number) => (
                          <div className="accordion-item" key={accIdx}>
                            <button className="accordion-header" onClick={() => setOpenAccordion(openAccordion === `${idx}-${accIdx}` ? null : `${idx}-${accIdx}`)}>
                              <span>{acc.title}</span>
                              {openAccordion === `${idx}-${accIdx}` ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openAccordion === `${idx}-${accIdx}` && (
                              <div className="accordion-body text-gray-600 pb-4">
                                <div 
                                  className="prose prose-sm max-w-none"
                                  style={{ textAlign: acc.align || 'left' }}
                                  dangerouslySetInnerHTML={{ __html: acc.content }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  case 'before_after':
                    return <BeforeAfterSlider key={idx} data={block.content} />;
                  case 'stats':
                    return <StatisticsSection key={idx} data={block.content} />;
                }
              })}
            </div>

          </div>
        </div>

      </main>
      <Footer />
      
      {/* Spacer to prevent sticky bar from covering footer */}
      <div className="h-[80px] w-full" />
      
      {/* Sticky Bottom Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_25px_rgba(0,0,0,0.1)] border-t border-gray-100 z-50 transition-transform duration-300 transform ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="w-full flex items-center justify-between" style={{ height: '80px', paddingLeft: 'max(20px, calc(50vw - 580px))', paddingRight: 'max(20px, calc(50vw - 580px))', boxSizing: 'border-box' }}>
          <div className="flex flex-col pr-3 min-w-0 flex-1 justify-center">
            <span className="font-bold text-[14px] sm:text-[16px] text-[#222] leading-tight truncate">{product?.name}</span>
            <div className="flex items-baseline mt-0.5 gap-3">
              <span className="text-[19px] sm:text-[22px] font-extrabold" style={{ color: primaryColor }}>{currentPrice}</span>
              {currentPkg?.originalPrice && currentPrice !== currentPkg.originalPrice && (
                <span className="text-[13px] sm:text-[15px] text-[#999] line-through font-medium">{currentPkg.originalPrice}</span>
              )}
            </div>
          </div>
          <button 
            className="text-white font-extrabold rounded-[30px] text-[17px] sm:text-[20px] transition-all shadow-sm whitespace-nowrap ml-2 flex-shrink-0 flex items-center justify-center tracking-wide btn-shine"
            style={{ padding: '0 18px', height: '48px', backgroundColor: primaryColor }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            onClick={() => {
              if (product?.id) {
                router.push(`/checkout?productId=${product.id}&package=${selectedPackage}`);
              }
            }}
          >
            ORDER NOW
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --primary-pink: ${primaryColor};
          --star-pink: ${primaryColor};
          --guarantee-color: ${guaranteeColor};
        }
        
        .wave-1 path { fill: ${primaryColor}; opacity: 0.4; }
        .wave-2 path { fill: ${primaryColor}; opacity: 1; }
        .wave-3 path { fill: ${primaryColor}; opacity: 0.7; }
        
        .add-to-cart-container {
          box-shadow: 0 4px 10px ${primaryColor}4D; /* 30% opacity hex */
        }
        
        .btn-shine::after {
          box-shadow: 0 0 0 15px ${primaryColor}00;
        }
      `}} />
    </div>
  );
}