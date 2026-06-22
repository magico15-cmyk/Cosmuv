"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '../components/TopBar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function HomeStorePage() {
  const router = useRouter();

  const products = [
    {
      id: 'turmeric',
      title: 'Enhanced Bioactive Turmeric',
      brand: 'YU.',
      price: '45.00',
      oldPrice: '50.00',
      save: '10',
      image: '/assets/bottle.png',
      link: '/product/turmeric'
    },
    {
      id: 'vitamin-c',
      title: 'Daily Vitamin C Gummies',
      brand: 'YU.',
      price: '25.00',
      oldPrice: '35.00',
      save: '28',
      image: '/assets/bundle.png',
      link: '#'
    },
    {
      id: 'omega',
      title: 'Omega-3 Fish Oil',
      brand: 'YU.',
      price: '30.00',
      oldPrice: '50.00',
      save: '40',
      image: '/assets/bottle.png',
      link: '#'
    },
    {
      id: 'sleep',
      title: 'Sleep Support Blend',
      brand: 'YU.',
      price: '28.00',
      oldPrice: '45.00',
      save: '37',
      image: '/assets/bundle.png',
      link: '#'
    }
  ];

  return (
    <>
      <TopBar />
      <Header />

      <main className="min-h-screen bg-gray-50 pb-12">
        
        {/* Hero Banner Area */}
        <section className="w-full flex flex-col">
          {/* Top Hero Image */}
          <div className="w-full relative bg-gray-100">
            <img 
              src="/assets/turmeric_hero_banner.png" 
              alt="Hero Banner" 
              className="w-full h-auto object-cover sm:max-h-[500px]"
            />
          </div>
          
          {/* White Info Section with Button */}
          <div className="w-full bg-white text-center flex flex-col items-center" style={{ padding: '32px 16px' }}>
            <p className="text-[#4b5563] text-[15px] sm:text-[16px] font-medium max-w-sm mx-auto mb-6 leading-relaxed">
              Profitez des meilleures offres de la semaine avec des réductions incroyables !
            </p>
            <button 
              className="bg-[#0f4a22] hover:bg-[#0b381a] text-white font-bold rounded-md text-[16px] transition-all shadow-sm"
              style={{ padding: '14px 48px' }}
              onClick={() => {
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
            >
              Offres du jour
            </button>
          </div>
        </section>

        {/* Brand/Shipping Ticker */}
        <div className="w-full bg-[#0b381a] text-white flex items-center justify-between text-lg sm:text-xl font-bold uppercase tracking-widest overflow-hidden whitespace-nowrap" style={{ padding: '12px 16px' }}>
          <div className="flex animate-marquee gap-8 items-center min-w-full justify-around">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/FedEx_logo.svg" alt="FedEx" className="h-5 brightness-0 invert" />
            <span className="font-serif tracking-normal text-2xl lowercase flex items-center gap-2">
              <span className="text-white">❈</span> Yu.
            </span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/FedEx_logo.svg" alt="FedEx" className="h-5 brightness-0 invert" />
            <span className="font-serif tracking-normal text-2xl lowercase flex items-center gap-2 hidden sm:flex">
              <span className="text-white">❈</span> Yu.
            </span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/FedEx_logo.svg" alt="FedEx" className="h-5 brightness-0 invert hidden sm:block" />
          </div>
        </div>

        {/* Product Grid Section */}
        <section className="w-full max-w-5xl mx-auto px-4 pt-10 pb-16" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-8">
            Best Selling Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {products.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow relative"
                onClick={() => {
                  if (product.link !== '#') router.push(product.link);
                }}
              >
                {/* Product Image Box */}
                <div className="aspect-square w-full bg-gray-50 relative overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  
                  {/* Save Badge */}
                  <div className="absolute bottom-2 left-2 bg-[#f899a2] text-white text-xs sm:text-sm font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                    <span className="text-white">🏷</span> SAVE {product.save}%
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 flex flex-col flex-grow items-center text-center">
                  <h3 className="text-[13px] sm:text-[15px] font-bold text-gray-900 leading-tight mb-1 flex-grow">
                    {product.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">
                    {product.brand}
                  </p>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-[#f899a2] font-black text-[17px] sm:text-[20px]">
                      ${product.price}
                    </span>
                    <span className="text-gray-400 text-[12px] sm:text-[14px] line-through font-medium">
                      ${product.oldPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
      
      {/* Simple style for marquee */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}} />
    </>
  );
}