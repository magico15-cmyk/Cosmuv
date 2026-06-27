"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { 
  StarIcon, HeartIcon, BoltIcon, SunIcon, TruckIcon, ShieldCheckIcon, 
  CheckCircleIcon, ShoppingBagIcon, SparklesIcon, GiftIcon, GlobeAltIcon, 
  FaceSmileIcon, ClockIcon, CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

const iconMap: Record<string, React.ElementType> = {
  'star': StarIcon,
  'heart': HeartIcon,
  'bolt': BoltIcon,
  'leaf': SunIcon,
  'truck': TruckIcon,
  'shield-check': ShieldCheckIcon,
  'check-circle': CheckCircleIcon,
  'shopping-bag': ShoppingBagIcon,
  'sparkles': SparklesIcon,
  'gift': GiftIcon,
  'globe-alt': GlobeAltIcon,
  'face-smile': FaceSmileIcon,
  'clock': ClockIcon,
  'currency-dollar': CurrencyDollarIcon,
};

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
  
  const features = Array.isArray(store?.homepage_features) 
    ? store.homepage_features 
    : (typeof store?.homepage_features === 'string' ? JSON.parse(store.homepage_features || '[]') : []);
  const featuresEnabled = store?.homepage_features_enabled ?? true;
  const featuresViewType = store?.homepage_features_view_type || 'Grid (2x2)';
  
  const defaultLayout = ["ticker", "features", "products"];
  const layoutOrder = Array.isArray(store?.homepage_layout_order) 
    ? store.homepage_layout_order 
    : (typeof store?.homepage_layout_order === 'string' ? JSON.parse(store.homepage_layout_order || '["ticker", "features", "products"]') : defaultLayout);

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [displayedLimit, setDisplayedLimit] = React.useState(store?.homepage_products_limit || 8);

  const featuresSliderRef = React.useRef<HTMLDivElement>(null);
  const [currentFeatureSlide, setCurrentFeatureSlide] = React.useState(0);

  React.useEffect(() => {
    if (hasSlider && sliderImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [hasSlider, sliderImages?.length]);

  React.useEffect(() => {
    if (featuresViewType === 'Slider' && featuresEnabled && features.length > 1) {
      const timer = setInterval(() => {
        setCurrentFeatureSlide((prev) => {
          const nextSlide = (prev + 1) % features.length;
          if (featuresSliderRef.current) {
            const container = featuresSliderRef.current;
            const slideWidth = container.scrollWidth / features.length;
            container.scrollTo({
              left: (store?.language === 'ar' || store?.store_rtl) ? -(slideWidth * nextSlide) : slideWidth * nextSlide,
              behavior: 'smooth'
            });
          }
          return nextSlide;
        });
      }, 2500); // Fast interval
      return () => clearInterval(timer);
    }
  }, [featuresViewType, featuresEnabled, features.length, store?.language, store?.store_rtl]);

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
          {(store.homepage_hero_text_enabled ?? true) && (
            <div className="w-full bg-white text-center flex flex-col items-center" style={{ padding: '32px 16px' }}>
              <p className="text-[#4b5563] text-[15px] sm:text-[16px] font-medium max-w-sm mx-auto leading-relaxed" style={{ marginBottom: '24px' }}>
                {store.homepage_hero_text || 'Profitez des meilleures offres de la semaine avec des réductions incroyables !'}
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
                {store.homepage_hero_button_text || 'Offres du jour'}
              </button>
            </div>
          )}
        </section>

        {/* Dynamic Sections */}
        {layoutOrder.map((sectionId: string, idx: number) => {
          if (sectionId === 'ticker') {
            if (!(store?.homepage_ticker_enabled ?? true)) return null;
            
            let tickerLogos: string[] = [];
            if (Array.isArray(store?.homepage_ticker_items)) {
              tickerLogos = store.homepage_ticker_items;
            } else if (typeof store?.homepage_ticker_items === 'string') {
              try {
                tickerLogos = JSON.parse(store.homepage_ticker_items);
              } catch (e) {
                tickerLogos = [];
              }
            }
            tickerLogos = tickerLogos.filter((t: string) => t && t.trim());
            
            if (tickerLogos.length === 0) return null;
            
            return (
              <div key={idx} className="w-full flex items-center overflow-hidden whitespace-nowrap border-b border-gray-100" style={{ padding: '14px 0', backgroundColor: primaryColor }}>
                <div className="scroll-track items-center" style={{ gap: '80px', paddingRight: '80px', animationDuration: '20s' }}>
                  {[...Array(8)].map((_, repeatIdx) => (
                    <div key={repeatIdx} className="flex items-center" style={{ gap: '80px' }}>
                      {tickerLogos.map((url: string, logoIdx: number) => (
                        <div key={logoIdx} className="flex items-center justify-center h-8">
                          <img 
                            src={url} 
                            alt={`Brand ${logoIdx + 1}`} 
                            className="h-full w-auto object-contain max-w-[150px]"
                            onError={(e) => {
                              // If image fails to load, hide it
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          
          if (sectionId === 'features') {
            return featuresEnabled && features.length > 0 ? (
          <section key={idx} className="w-full bg-white px-4" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
            {/* Features Section Header */}
            <div className="w-full text-center max-w-2xl mx-auto" style={{ marginBottom: '40px' }}>
              <h2 className="text-[30px] sm:text-[40px] font-extrabold text-[#1a1a2e]" style={{ letterSpacing: '-0.02em', lineHeight: '1.15' }}>
                {store?.homepage_features_title || "Why Choose Us"}
              </h2>
              <p className="text-[14px] sm:text-[16px] text-gray-500 leading-relaxed mt-4 mx-auto max-w-lg">
                {store?.homepage_features_subtitle || "Discover the benefits that make our products stand out from the rest."}
              </p>
            </div>
            <div 
              ref={featuresViewType === 'Slider' ? featuresSliderRef : null}
              onScroll={(e) => {
                if (featuresViewType !== 'Slider') return;
                const container = e.currentTarget;
                const slideWidth = container.scrollWidth / features.length;
                const newSlide = Math.round(Math.abs(container.scrollLeft) / slideWidth);
                if (newSlide !== currentFeatureSlide && newSlide >= 0 && newSlide < features.length) {
                  setCurrentFeatureSlide(newSlide);
                }
              }}
              className={
              featuresViewType === 'Slider' 
                ? "flex overflow-x-auto snap-x snap-mandatory pb-4 pt-4 px-[10vw] sm:px-10 gap-4"
                : `max-w-5xl mx-auto grid gap-4 sm:gap-6 ${
                    featuresViewType === 'Grid (4x1)' 
                      ? 'grid-cols-2 md:grid-cols-4' 
                      : featuresViewType === 'List (Vertical)'
                        ? 'grid-cols-1 max-w-2xl'
                        : 'grid-cols-1 sm:grid-cols-2' // Default Grid (2x2)
                  }`
            }
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {features.map((feature: any, idx: number) => {
                const IconComponent = iconMap[feature.icon] || StarIcon;
                return (
                  <div 
                    key={idx} 
                    className={`bg-[#f8f8fb] rounded-2xl p-6 sm:py-10 sm:px-8 flex flex-col items-center text-center ${featuresViewType === 'Slider' ? 'min-w-[280px] snap-center' : ''}`}
                  >
                    <div className="mb-3" style={{ color: primaryColor }}>
                      <IconComponent className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#111] mb-2">{feature.title}</h3>
                    <p className="text-[13px] sm:text-[14px] text-gray-500 leading-relaxed max-w-[280px]">{feature.description}</p>
                  </div>
                );
              })}
            </div>
            {featuresViewType === 'Slider' && features.length > 1 && (
              <div className="flex justify-center gap-2 mt-2">
                {features.map((_, idx) => (
                  <div 
                    key={idx}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: currentFeatureSlide === idx ? '24px' : '6px',
                      backgroundColor: currentFeatureSlide === idx ? primaryColor : '#e5e7eb'
                    }}
                  />
                ))}
              </div>
            )}
          </section>
            ) : null;
          }

          if (sectionId === 'products') {
            return (store?.homepage_products_enabled ?? true) ? (
          <section key={idx} className="w-full" style={{ background: '#ffffff', padding: '56px 16px 64px' }}>
            
            {/* Section Header */}
            <div className="w-full text-center" style={{ marginBottom: '40px' }}>
              <p className="text-[12px] font-bold tracking-[0.3em] uppercase" style={{ marginBottom: '8px', color: primaryColor }}>
                {store?.homepage_products_subtitle || "✦ CURATED FOR YOU ✦"}
              </p>
              <h2 className="text-[28px] sm:text-[36px] font-black text-[#111]" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                {store?.homepage_products_title || "Featured Products"}
              </h2>
              <div style={{ width: '60px', height: '3px', background: primaryColor, borderRadius: '2px', margin: '16px auto 0' }}></div>
            </div>

            {/* Products Grid */}
            {/* Products Grid */}
            <div 
              className={
                store?.homepage_products_view_type === 'Slider' 
                  ? "flex overflow-x-auto snap-x snap-mandatory pb-10 pt-4 px-[10vw] sm:px-10 gap-6" 
                  : store?.homepage_products_view_type === 'Style 1'
                  ? "mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  : store?.homepage_products_view_type === 'Style 2'
                  ? "mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6"
                  : "mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" // Default Grid
              } 
              style={{ 
                maxWidth: store?.homepage_products_view_type === 'Slider' ? '100vw' : '1000px',
                margin: store?.homepage_products_view_type === 'Slider' ? '0 -16px' : '0 auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {products.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500 w-full">
                  No products found in this store yet.
                </div>
              )}
              {products.slice(0, displayedLimit).map((product, idx) => {
                const isOutOfStock = product.inventory === "Tracked" && Number(product.stock || 0) <= 0;
                const isStyle2 = store?.homepage_products_view_type === 'Style 2';
                const isSlider = store?.homepage_products_view_type === 'Slider';
                
                if (isStyle2) {
                  return (
                    <div 
                      key={idx} 
                      className="group cursor-pointer w-full flex flex-col"
                      onClick={() => { if (product.link !== '#' && !isOutOfStock) router.push(`/product/${product.id}`); }}
                    >
                      {/* Minimalist Image Container */}
                      <div 
                        className="w-full relative overflow-hidden rounded-[12px] bg-gray-50 border border-gray-200 transition-all duration-500 group-hover:bg-gray-100 group-hover:border-gray-300" 
                        style={{ aspectRatio: '1/1', opacity: isOutOfStock ? 0.6 : 1 }}
                      >
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
                          className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 p-2"
                          style={{ mixBlendMode: 'multiply' }}
                        />
                        {/* Minimal Discount Badge */}
                        {product.oldPrice > product.price && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                            -{product.save || Math.round((1 - (product.price / product.oldPrice)) * 100)}%
                          </div>
                        )}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Sold Out</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Minimalist Info */}
                      <div className="pt-4 text-center">
                        {/* Stars */}
                        <div className="flex justify-center items-center gap-0.5 mb-1.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3 h-3" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <h3 className="text-[14px] font-medium text-gray-900 leading-tight mb-1.5 line-clamp-1 transition-colors group-hover:text-gray-600">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <span className="text-[14px] font-bold" style={{ color: primaryColor }}>
                            {product.price} {currencySymbol}
                          </span>
                          {product.oldPrice > product.price && (
                            <span className="text-[12px] font-medium text-gray-400 line-through">
                              {product.oldPrice} {currencySymbol}
                            </span>
                          )}
                        </div>
                        <button 
                          className={`w-full font-bold transition-all duration-300 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                          style={{ 
                            background: isOutOfStock ? '#9ca3af' : primaryColor, color: '#ffffff', border: 'none', 
                            padding: '8px 0', borderRadius: '8px', fontSize: '12px',
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
                  );
                }

                return (
              <div 
                key={idx} 
                className={`group cursor-pointer ${isSlider ? "snap-center flex-none w-[75vw] sm:w-[320px]" : "w-full"}`}
                onClick={() => { if (product.link !== '#' && !isOutOfStock) router.push(`/product/${product.id}`); }}
                style={{ perspective: '1000px' }}
              >
                <div 
                  className="rounded-[16px] overflow-hidden flex flex-col relative bg-white transition-all duration-400 h-full"
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
                    {product.oldPrice > product.price && (
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
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex flex-col flex-grow text-left" style={{ padding: '20px 16px' }}>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5" style={{ color: primaryColor }} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-[11px] text-gray-400 ml-1 font-medium">(4.9)</span>
                    </div>
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
                      {product.oldPrice > product.price && (
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#a0a0a0', textDecoration: 'line-through' }}>
                          {product.oldPrice} {currencySymbol}
                        </span>
                      )}
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
            
            {/* Trailing space for slider so the last item isn't flush with the right edge */}
            {store?.homepage_products_view_type === 'Slider' && (
              <div className="w-1 flex-shrink-0 sm:hidden"></div>
            )}
          </div>

          {/* Load More Button */}
          {store?.homepage_products_load_more && products.length > displayedLimit && (
            <div className="w-full flex justify-center mt-12 px-4">
              <button 
                className="font-semibold transition-all duration-300 px-8 py-2.5 bg-white border shadow-sm rounded-lg"
                style={{ 
                  color: primaryColor,
                  borderColor: primaryColor,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onClick={() => {
                  setDisplayedLimit((prev: number) => prev + (store?.homepage_products_limit || 8));
                }}
              >
                Load More
              </button>
            </div>
          )}
        </section>
            ) : null;
          }
          
          return null;
        })}

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
