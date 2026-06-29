"use client";

import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import Image from 'next/image';
import { Menu, ShoppingBag, ChevronLeft, ChevronRight, Smile, Activity, Wind, ShieldCheck, Star, HandCoins, ChevronDown, ChevronUp, Check, X, User, Phone, MapPin, CheckCircle, MessageCircle, Send, RotateCcw, Heart, Zap, Leaf, Truck, Sparkles, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';

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
              <div key={idx} className="testimonial-card">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mb-3">
                  {t.avatar && <Image src={t.avatar} alt={t.author} fill sizes="48px" className="object-cover" />}
                </div>
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
          {data?.afterImage && <Image fill sizes="400px" className="object-cover block" src={data.afterImage} alt="After" />}
        </div>
        
        {/* Before Image (Foreground, clipped) */}
        <div className="absolute inset-0 w-full h-full z-20 pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
          {data?.beforeImage && <Image fill sizes="400px" className="object-cover block" src={data.beforeImage} alt="Before" />}
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

export default function ProductClient({ initialProduct, store }: { initialProduct: any, store?: any }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(initialProduct);
  const [purchaseType, setPurchaseType] = useState('subscribe');
  const [selectedPackage, setSelectedPackage] = useState(2);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Express Checkout state
  const expressBlock = product?.content_blocks?.find((b: any) => b.type === 'express_checkout');
  const standardBlock = product?.content_blocks?.find((b: any) => b.type === 'checkout_button');
  
  const hasExpressBlock = !!expressBlock;
  const hasStandardBlock = !!standardBlock;
  const hasCheckoutBlock = hasExpressBlock || hasStandardBlock;
  
  const expressButtonText = expressBlock?.content?.buttonText || "COMPLETE ORDER";
  const standardButtonText = standardBlock?.content?.buttonText || "ORDER NOW";

  const expressShowGuarantee = expressBlock?.content?.showGuarantee ?? true;
  const expressGuaranteeText = expressBlock?.content?.guaranteeText || "Free 30 Day Returns";
  
  const standardShowGuarantee = standardBlock?.content?.showGuarantee ?? true;
  const standardGuaranteeText = standardBlock?.content?.guaranteeText || "Free 30 Day Returns";

  const [expressForm, setExpressForm] = useState({ fullName: '', phoneNumber: '', city: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const expressFormRef = useRef<HTMLDivElement>(null);
  
  const primaryColor = store?.primary_color || '#111111';
  const guaranteeColor = store?.guarantee_color || '#1fb6ff';
  const currencySymbol = store?.currency || '$';

  const isOutOfStock = product?.inventory === "Tracked" && Number(product?.stock || 0) <= 0;

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
        // Only show sticky bar when scrolled past the form/button
        if (!entry.isIntersecting && window.scrollY > 500) {
          setShowStickyBar(true);
        } else {
          setShowStickyBar(false);
        }
      },
      { threshold: 0 }
    );

    if (addToCartRef.current) {
      observer.observe(addToCartRef.current);
    }
    if (expressFormRef.current) {
      observer.observe(expressFormRef.current);
    }

    return () => observer.disconnect();
  }, [product, hasCheckoutBlock]);

  const renderExpressForm = () => (
    <div ref={expressFormRef} className="express-checkout-form" style={{ marginTop: '8px' }}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (isSubmitting || isOutOfStock) return;
          setIsSubmitting(true);
          try {
            const storeId = store?.id;
            const orderPayload = {
              store_id: storeId,
              product_id: product.id,
              customer_name: expressForm.fullName,
              customer_phone: expressForm.phoneNumber,
              customer_address: `${expressForm.address}, ${expressForm.city}`,
              total_amount: parseFloat((currentPrice || '0').replace(/[^0-9.]/g, '')),
              status: 'pending',
              items: [{
                product_id: product.id,
                product_name: product.name,
                package: currentPkg?.title,
                price: currentPrice,
                image: currentPkg?.img || currentPkg?.image
              }]
            };
            const res = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(orderPayload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to submit order');
            const params = new URLSearchParams({ name: expressForm.fullName, item: currentPkg?.title || '' });
            router.push(`/thank-you?${params.toString()}`);
          } catch (err: any) {
            alert(err.message || 'Failed to submit order. Please try again.');
          } finally {
            setIsSubmitting(false);
          }
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {(store?.field_name_enabled ?? true) && (
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
            <div style={{ width: '45px', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRight: '1px solid #d1d5db' }}>
              <User size={18} color="#4b5563" />
            </div>
            <input
              type="text"
              name="fullName"
              required
              value={expressForm.fullName}
              onChange={(e) => setExpressForm({ ...expressForm, fullName: e.target.value })}
              style={{ flex: 1, padding: '13px 14px', fontSize: '15px', border: 'none', outline: 'none', fontFamily: 'inherit' }}
              placeholder={store?.field_name_label || 'Full name'}
            />
          </div>
        )}

        {(store?.field_phone_enabled ?? true) && (
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
            <div style={{ width: '45px', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRight: '1px solid #d1d5db' }}>
              <Phone size={18} color="#4b5563" />
            </div>
            <input
              type="tel"
              name="phoneNumber"
              required
              dir="auto"
              value={expressForm.phoneNumber}
              onChange={(e) => setExpressForm({ ...expressForm, phoneNumber: e.target.value })}
              style={{ flex: 1, padding: '13px 14px', fontSize: '15px', border: 'none', outline: 'none', fontFamily: 'inherit' }}
              placeholder={store?.field_phone_label || 'Phone number'}
            />
          </div>
        )}

        {(store?.field_city_enabled ?? true) && (
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
            <div style={{ width: '45px', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRight: '1px solid #d1d5db' }}>
              <MapPin size={18} color="#4b5563" />
            </div>
            <input
              type="text"
              name="city"
              required
              value={expressForm.city}
              onChange={(e) => setExpressForm({ ...expressForm, city: e.target.value })}
              style={{ flex: 1, padding: '13px 14px', fontSize: '15px', border: 'none', outline: 'none', fontFamily: 'inherit' }}
              placeholder={store?.field_city_label || 'City'}
            />
          </div>
        )}

        {(store?.field_address_enabled ?? true) && (
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
            <div style={{ width: '45px', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', borderRight: '1px solid #d1d5db' }}>
              <MapPin size={18} color="#4b5563" />
            </div>
            <input
              type="text"
              name="address"
              required
              value={expressForm.address}
              onChange={(e) => setExpressForm({ ...expressForm, address: e.target.value })}
              style={{ flex: 1, padding: '13px 14px', fontSize: '15px', border: 'none', outline: 'none', fontFamily: 'inherit' }}
              placeholder={store?.field_address_label || 'Address (Road, House number)'}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isOutOfStock}
          className="w-full font-bold transition-all flex items-center justify-center gap-2 relative overflow-hidden btn-shine"
          style={{
            backgroundColor: isOutOfStock ? '#9ca3af' : primaryColor,
            color: 'white',
            padding: '16px',
            borderRadius: '10px',
            fontSize: '18px',
            border: 'none',
            letterSpacing: '0.5px',
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            marginTop: '4px',
            boxShadow: `0 4px 14px ${primaryColor}4D`,
          }}
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CheckCircle size={20} style={{ opacity: 0.9 }} />
              {isOutOfStock ? 'OUT OF STOCK' : expressButtonText}
            </>
          )}
        </button>
      </form>
      {expressShowGuarantee && (
        <div className="returns-info" style={{ textAlign: 'center', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#888', fontSize: '13px' }}>
          <ShieldCheck size={16} className="shield-icon" />
          {expressGuaranteeText}
        </div>
      )}
    </div>
  );

  const renderStandardButton = (attachRef: boolean = false) => (
    <div 
      ref={attachRef ? addToCartRef : undefined}
      className={`add-to-cart-container ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'btn-shine'}`} 
      onClick={() => {
        if (product?.id && !isOutOfStock) {
          router.push(`/checkout?productId=${product.id}&package=${selectedPackage}`);
        }
      }}
    >
      <button 
        className="add-to-cart text-[28px] sm:text-[32px]"
        disabled={isOutOfStock}
      >
        {isOutOfStock ? "OUT OF STOCK" : standardButtonText}
      </button>
      {standardShowGuarantee && (
        <div className="returns-info">
          <ShieldCheck size={16} className="shield-icon" />
          {standardGuaranteeText}
        </div>
      )}
    </div>
  );

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
    return `${str}\u00A0${currencySymbol}`;
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
    <>
    <div dir={store?.language === 'ar' || store?.store_rtl ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col bg-gray-50">

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
                      <Image
                        key={img}
                        src={img}
                        alt={`Product image ${idx + 1}`}
                        width={1000}
                        height={1000}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={idx === 0}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          position: idx === 0 ? 'relative' : 'absolute',
                          top: 0,
                          left: 0,
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
                    className={`thumbnail ${mainImage === img ? 'active' : ''} relative overflow-hidden`}
                    onClick={() => changeImage(img)}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill sizes="80px" className="object-cover" />
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
              {packages.map((pkg: any) => (
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
                    <div className="pkg-img-wrapper">
                      <Image src={pkg.img || pkg.image} alt={pkg.title} width={60} height={50} className="pkg-img" />
                    </div>) : (
                      <div className="pkg-img" style={{ backgroundColor: '#f3f4f6' }} />
                    )}
                  </div>
                </label>
              ))}
            </div>



            {/* Action Area */}
            {!hasCheckoutBlock && (
              <div className="action-area" ref={addToCartRef}>
                {renderStandardButton(false)}
              </div>
            )}



            {/* Dynamic Content Blocks */}
            <div className="dynamic-blocks-container mb-20 flex flex-col gap-5">
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
                    return (
                      <div key={idx} className="w-[92%] mx-auto rounded-2xl overflow-hidden mb-6">
                        <Image src={block.content} alt="Product content" width={800} height={800} sizes="92vw" className="w-full h-auto object-contain rounded-2xl" />
                      </div>
                    );
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
                                <th className="store-col-header text-white font-bold py-2.5 px-4 rounded-tl-xl rtl:rounded-tr-xl rtl:rounded-tl-none" style={{ backgroundColor: primaryColor }}>
                                  {block.content.storeName || store?.store_name}
                                </th>
                                <th className="others-col-header text-black font-bold py-2.5 px-4 bg-white rounded-tr-xl rtl:rounded-tl-xl rtl:rounded-tr-none border-t border-r rtl:border-l rtl:border-r-0 border-b border-gray-200">
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
                                    <td className={`feature-col text-white font-bold py-2.5 px-4 ${isFirst ? 'rounded-tl-xl rtl:rounded-tr-xl rtl:rounded-tl-none' : ''} ${isLast ? 'rounded-bl-xl rtl:rounded-br-xl rtl:rounded-bl-none' : ''}`} style={{ backgroundColor: primaryColor, borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.2)' }}>
                                      {row.feature}
                                    </td>
                                    <td className={`store-col text-center py-2.5 bg-white border-b border-r rtl:border-l rtl:border-r-0 border-gray-200`}>
                                      {row.store ? (
                                        <Check size={24} color="#22c55e" className="mx-auto" />
                                      ) : (
                                        <X size={24} color="#111827" className="mx-auto" />
                                      )}
                                    </td>
                                    <td className={`others-col text-center py-2.5 bg-white border-b border-r rtl:border-l rtl:border-r-0 border-gray-200 ${isLast ? 'rounded-br-xl rtl:rounded-bl-xl rtl:rounded-br-none' : ''}`}>
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
                  case 'accordion_icons':
                    return (
                      <div className="product-accordions !mt-0" key={idx}>
                        {block.content.map((acc: any, accIdx: number) => {
                          const IconComponent = (() => {
                            switch(acc.icon) {
                              case 'star': return Star;
                              case 'chat-bubble': return MessageCircle;
                              case 'paper-airplane': return Send;
                              case 'arrow-uturn-left': return RotateCcw;
                              case 'heart': return Heart;
                              case 'bolt': return Zap;
                              case 'leaf': return Leaf;
                              case 'truck': return Truck;
                              case 'shield-check': return ShieldCheck;
                              case 'check-circle': return CheckCircle;
                              case 'shopping-bag': return ShoppingBag;
                              case 'sparkles': return Sparkles;
                              case 'gift': return Gift;
                              default: return Star;
                            }
                          })();
                          return (
                            <div className="accordion-item" key={accIdx} style={{ marginBottom: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                              <button 
                                className="accordion-header flex items-center justify-between w-full p-4" 
                                onClick={() => setOpenAccordion(openAccordion === `${idx}-${accIdx}` ? null : `${idx}-${accIdx}`)}
                                style={{ background: '#fff' }}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="p-2 rounded-full border border-gray-200 text-gray-700" style={{ borderColor: primaryColor, color: primaryColor }}>
                                    <IconComponent size={20} strokeWidth={1.5} />
                                  </div>
                                  <span className="font-semibold text-lg">{acc.title}</span>
                                </div>
                                {openAccordion === `${idx}-${accIdx}` ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                              </button>
                              {openAccordion === `${idx}-${accIdx}` && (
                                <div className="accordion-body text-gray-600 p-4 border-t border-gray-100 bg-white">
                                  <div 
                                    className="prose prose-sm max-w-none"
                                    style={{ textAlign: acc.align || 'left' }}
                                    dangerouslySetInnerHTML={{ __html: acc.content }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  case 'before_after':
                    return <BeforeAfterSlider key={idx} data={block.content} />;
                  case 'stats':
                    return <StatisticsSection key={idx} data={block.content} />;
                  case 'express_checkout':
                    return (
                      <div key={idx} className="w-full">
                        {renderExpressForm()}
                      </div>
                    );
                  case 'checkout_button':
                    return (
                      <div key={idx} className="w-full">
                        {renderStandardButton(true)}
                      </div>
                    );
                  case 'guarantee':
                    return (
                      <div key={idx} className="w-full bg-[#FFF8E7] border border-[#F5A623] rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <div className="font-bold text-sm tracking-wider text-[#F5A623] mb-1 uppercase">
                          {block.content?.title || '30-DAY MONEY BACK GUARANTEE'}
                        </div>
                        <div className="text-sm text-gray-900 flex items-center gap-2 justify-center">
                          <HandCoins className="w-5 h-5 text-[#F5A623]" />
                          <span dangerouslySetInnerHTML={{ __html: block.content?.text || '100% Risk Free. Love it or your money back.' }} />
                        </div>
                      </div>
                    );
                }
              })}
            </div>

          </div>
        </div>

      </main>
      
      {/* Spacer to prevent sticky bar from covering footer */}
      <div className="h-[80px] w-full" />
      
      {/* Sticky Bottom Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_25px_rgba(0,0,0,0.1)] border-t border-gray-100 z-50 transition-transform duration-300 transform ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="w-full flex items-center justify-between" style={{ height: '80px', paddingLeft: 'max(20px, calc(50vw - 580px))', paddingRight: 'max(20px, calc(50vw - 580px))', boxSizing: 'border-box' }}>
          <div className="flex flex-col pr-2 sm:pr-3 min-w-0 flex-1 justify-center">
            <span className="font-bold text-[13px] sm:text-[16px] text-[#222] leading-tight truncate">{product?.name}</span>
            <div className="flex items-baseline mt-0.5 gap-2 sm:gap-3 overflow-hidden">
              <span className="text-[16px] sm:text-[22px] font-extrabold whitespace-nowrap" style={{ color: primaryColor }}>{currentPrice}</span>
              {currentPkg?.originalPrice && currentPrice !== currentPkg.originalPrice && (
                <span className="text-[12px] sm:text-[15px] text-[#999] line-through font-medium whitespace-nowrap truncate">{currentPkg.originalPrice}</span>
              )}
            </div>
          </div>
          <button 
            className={`text-white font-extrabold rounded-[30px] text-[16px] sm:text-[20px] px-4 sm:px-[18px] h-[46px] sm:h-[48px] transition-all shadow-sm whitespace-nowrap ml-1 sm:ml-2 flex-shrink-0 flex items-center justify-center tracking-wide ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'btn-shine'}`}
            style={{ backgroundColor: isOutOfStock ? '#9ca3af' : primaryColor }}
            onMouseEnter={(e) => { if(!isOutOfStock) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { if(!isOutOfStock) e.currentTarget.style.opacity = '1'; }}
            disabled={isOutOfStock}
            onClick={() => {
              if (hasExpressBlock && expressFormRef.current) {
                expressFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } else if (product?.id && !isOutOfStock) {
                router.push(`/checkout?productId=${product.id}&package=${selectedPackage}`);
              }
            }}
          >
            {isOutOfStock ? "OUT OF STOCK" : (hasExpressBlock ? expressButtonText : standardButtonText)}
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
    </>
  );
}