"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const FedExLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 45.67 160.003 44.33" className={className}>
    <path d="M169.018 84.244c0-2.465-1.748-4.27-4.156-4.27-2.404 0-4.154 1.805-4.154 4.27 0 2.461 1.75 4.263 4.154 4.263 2.408 0 4.156-1.805 4.156-4.263zm-5.248.219v2.789h-.901v-6.15h2.239c1.312 0 1.914.573 1.914 1.69 0 .688-.465 1.233-1.064 1.312v.026c.52.083.711.547.818 1.396.082.55.191 1.504.387 1.728h-1.066c-.248-.578-.223-1.396-.414-2.081-.158-.521-.436-.711-1.033-.711h-.875v.003l-.005-.002zm1.117-.795c.875 0 1.125-.466 1.125-.877 0-.486-.25-.87-1.125-.87h-1.117v1.749h1.117v-.002zm-5.17.576c0-3.037 2.411-5.09 5.141-5.09 2.738 0 5.146 2.053 5.146 5.09 0 3.031-2.407 5.086-5.146 5.086-2.73 0-5.141-2.055-5.141-5.086z" fill="currentColor"/><g fill="currentColor"><path d="M141.9 88.443l-5.927-6.647-5.875 6.647h-12.362l12.082-13.574-12.082-13.578h12.748l5.987 6.596 5.761-6.596h12.302l-12.022 13.521 12.189 13.631zM93.998 88.443V45.67h23.738v9.534h-13.683v6.087h13.683v9.174h-13.683v8.42h13.683v9.558z"/></g><path d="M83.98 45.67v17.505h-.111c-2.217-2.548-4.988-3.436-8.201-3.436-6.584 0-11.544 4.479-13.285 10.396-1.986-6.521-7.107-10.518-14.699-10.518-6.167 0-11.035 2.767-13.578 7.277V61.29H21.361v-6.085h13.91v-9.533H10v42.771h11.361V70.465h11.324a17.082 17.082 0 0 0-.519 4.229c0 8.918 6.815 15.185 15.516 15.185 7.314 0 12.138-3.437 14.687-9.694h-9.737c-1.316 1.883-2.316 2.439-4.949 2.439-3.052 0-5.686-2.664-5.686-5.818h19.826C62.683 83.891 68.203 90 75.779 90c3.268 0 6.26-1.607 8.089-4.322h.11v2.771h10.017V45.672H83.98v-.002zM42.313 70.593c.633-2.718 2.74-4.494 5.37-4.494 2.896 0 4.896 1.721 5.421 4.494H42.313zm35.588 11.341c-3.691 0-5.985-3.439-5.985-7.031 0-3.84 1.996-7.529 5.985-7.529 4.139 0 5.788 3.691 5.788 7.529 0 3.638-1.746 7.031-5.788 7.031z" fill="currentColor"/>
  </svg>
);

export function StoreClient({ store, initialProducts = [] }: { store: any; initialProducts?: any[] }) {
  const router = useRouter();

  const products = initialProducts;

  const primaryColor = store?.primary_color || '#f899a2';
  const guaranteeColor = store?.guarantee_color || '#1fb6ff';
  const currencySymbol = store?.currency || '$';

  // Parse slider images
  const sliderImages = Array.isArray(store?.slider_images) 
    ? store.slider_images 
    : (typeof store?.slider_images === 'string' ? JSON.parse(store.slider_images || '[]') : []);
  const hasSlider = sliderImages && sliderImages.length > 0;
  
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    if (hasSlider && sliderImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [hasSlider, sliderImages?.length]);

  return (
    <>
      <div dir={store?.language === 'ar' || store?.store_rtl ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col">

      <main className="flex-1 bg-gray-50">
        
        {/* Hero Banner Area */}
        <section className="w-full flex flex-col">
          {/* Top Hero Image */}
          <div className="w-full relative bg-gray-100 overflow-hidden sm:max-h-[500px]">
            {hasSlider ? (
              <div 
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ 
                  transform: (store?.language === 'ar' || store?.store_rtl) 
                    ? `translateX(${currentSlide * 100}%)` 
                    : `translateX(-${currentSlide * 100}%)` 
                }}
              >
                {sliderImages.map((img: string, idx: number) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 relative">
                    <img 
                      src={img} 
                      alt={`Hero Banner ${idx + 1}`} 
                      className="w-full h-full object-cover sm:max-h-[500px]"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="w-full flex items-center justify-center relative overflow-hidden"
                style={{ 
                  minHeight: '340px',
                  background: `linear-gradient(135deg, ${primaryColor}18 0%, ${primaryColor}08 40%, #f8fafc 60%, ${primaryColor}12 100%)`,
                }}
              >
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.07]" style={{ background: primaryColor }} />
                <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-[0.05]" style={{ background: primaryColor }} />
                <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-[0.04]" style={{ background: primaryColor }} />

                <div className="relative z-10 text-center px-6 py-12">
                  <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-white/80 border border-gray-200/60 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-9 h-9 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
                    {store?.name || 'Welcome'}
                  </h1>
                  <p className="text-gray-500 text-base sm:text-lg font-medium max-w-md mx-auto">
                    Discover our latest collection
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-1.5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: primaryColor, opacity: 1 - i * 0.3 }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Slider Dots */}
            {hasSlider && sliderImages.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10" dir="ltr">
                {sliderImages.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === idx ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* White Info Section with Button */}
          <div className="w-full bg-white text-center flex flex-col items-center" style={{ padding: '32px 16px' }}>
            <p className="text-[#4b5563] text-[15px] sm:text-[16px] font-medium max-w-sm mx-auto leading-relaxed" style={{ marginBottom: '24px' }}>
              Profitez des meilleures offres de la semaine avec des réductions incroyables !
            </p>
            <button 
              className="text-white font-bold rounded-md text-[16px] transition-all shadow-sm"
              style={{ padding: '14px 48px', backgroundColor: primaryColor }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              onClick={() => {
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
            >
              Offres du jour
            </button>
          </div>
        </section>

        {/* Brand/Shipping Ticker */}
        <div className="w-full text-white flex items-center overflow-hidden whitespace-nowrap" style={{ padding: '12px 0', backgroundColor: primaryColor }}>
          <div className="flex animate-marquee items-center w-max" style={{ gap: '80px', paddingRight: '80px' }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex items-center" style={{ gap: '80px' }}>
                <FedExLogo className="h-5 w-auto" />
                <span className="font-serif tracking-normal text-2xl lowercase flex items-center gap-2">
                  <span className="text-white">❈</span> Yu.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        {(store?.homepage_products_enabled ?? true) && (
          <section className="w-full" style={{ background: '#ffffff', padding: '56px 16px 64px' }}>
            
            {/* Section Header */}
            <div className="w-full text-center" style={{ marginBottom: '40px' }}>
              <p className="text-[12px] font-bold tracking-[0.3em] uppercase" style={{ marginBottom: '8px', color: primaryColor }}>
                ✦ CURATED FOR YOU ✦
              </p>
              <h2 className="text-[28px] sm:text-[36px] font-black text-[#111]" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                {store?.homepage_products_title || "Featured Products"}
              </h2>
              <div style={{ width: '60px', height: '3px', background: primaryColor, borderRadius: '2px', margin: '16px auto 0' }}></div>
            </div>

            {/* Products Grid */}
            <div className="mx-auto grid grid-cols-2 md:grid-cols-4" style={{ gap: '24px', maxWidth: '1000px' }}>
              {products.length === 0 && (
                <div className="col-span-4 text-center py-10 text-gray-500">
                  No products found in this store yet.
                </div>
              )}
              {products.slice(0, store?.homepage_products_limit || 8).map((product, idx) => {
                const isOutOfStock = product.inventory === "Tracked" && Number(product.stock || 0) <= 0;
                return (
              <div 
                key={idx} 
                className="group cursor-pointer"
                onClick={() => { if (product.link !== '#' && !isOutOfStock) router.push(`/product/${product.id}`); }}
                style={{ perspective: '1000px' }}
              >
                <div 
                  className="rounded-[16px] overflow-hidden flex flex-col relative bg-white transition-all duration-400"
                  style={{ 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
                    border: '1px solid #e0e0e0',
                    opacity: isOutOfStock ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isOutOfStock) {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isOutOfStock) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                    }
                  }}
                >
                  {/* Image Container */}
                  <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4', backgroundColor: '#fcfcfc' }}>
                    <img 
                      src={(() => {
                        try {
                          const parsed = JSON.parse(product.image);
                          return Array.isArray(parsed) ? parsed[0] : product.image;
                        } catch {
                          return product.image;
                        }
                      })()} 
                      alt={product.title} 
                      className="w-full h-full object-contain transition-transform duration-700"
                      style={{ transition: 'transform 0.7s ease', backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                    
                    {/* Floating Discount Pill */}
                    <div 
                      className="absolute flex items-center"
                      style={{ 
                        top: '12px', left: '12px',
                        background: primaryColor,
                        color: 'white', fontSize: '11px', fontWeight: '800',
                        padding: '5px 10px', borderRadius: '4px',
                        letterSpacing: '0.02em'
                      }}
                    >
                      Save {product.save || Math.round((1 - (product.price / product.oldPrice)) * 100)}%
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex flex-col flex-grow text-left" style={{ padding: '20px 16px' }}>
                    <h3 style={{ 
                      fontSize: '15px', fontWeight: '600', color: '#111', 
                      lineHeight: '1.4', marginBottom: '8px',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center" style={{ gap: '8px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: primaryColor }}>
                        {product.price} {currencySymbol}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#a0a0a0', textDecoration: 'line-through' }}>
                        {product.oldPrice} {currencySymbol}
                      </span>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      <button 
                        className={`w-full font-bold transition-all duration-300 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ 
                          background: isOutOfStock ? '#9ca3af' : primaryColor, color: '#ffffff', border: 'none', 
                          padding: '10px 0', borderRadius: '8px', fontSize: '13px',
                          textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}
                        onMouseEnter={(e) => { 
                          if(!isOutOfStock) e.currentTarget.style.opacity = '0.85'; 
                        }}
                        onMouseLeave={(e) => { 
                          if(!isOutOfStock) e.currentTarget.style.opacity = '1'; 
                        }}
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.link !== '#' && !isOutOfStock) router.push(`/product/${product.id}`);
                        }}
                      >
                        {isOutOfStock ? "Out of Stock" : "Order Now"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </section>
        )}

      </main>

      
      {/* Dynamic Theme Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --primary-pink: ${primaryColor};
          --star-pink: ${primaryColor};
          --guarantee-color: ${guaranteeColor};
        }
        
        .add-to-cart-container {
          box-shadow: 0 4px 10px ${primaryColor}4D; /* 30% opacity hex */
        }
        
        .btn-shine::after {
          box-shadow: 0 0 0 15px ${primaryColor}00;
        }
        
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}} />
    </div>
    </>
  );
}
