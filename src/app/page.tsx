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
      image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=400&q=80',
      link: '#'
    },
    {
      id: 'omega',
      title: 'Omega-3 Fish Oil',
      brand: 'YU.',
      price: '30.00',
      oldPrice: '50.00',
      save: '40',
      image: 'https://images.unsplash.com/photo-1550572017-edb98bc91823?auto=format&fit=crop&w=400&q=80',
      link: '#'
    },
    {
      id: 'sleep',
      title: 'Sleep Support Blend',
      brand: 'YU.',
      price: '28.00',
      oldPrice: '45.00',
      save: '37',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a8b792?auto=format&fit=crop&w=400&q=80',
      link: '#'
    }
  ];

  return (
    <>
      <TopBar />
      <Header />

      <main className="min-h-screen bg-gray-50 pb-12">
        
        {/* Hero Banner Area */}
        <section className="relative w-full overflow-hidden bg-[#f899a2]">
          {/* Background image overlay */}
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1611241893603-3c359704e0df?auto=format&fit=crop&w=1200&q=80" 
              alt="Background" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
              Wellness & <span className="text-[#ffe0e3]">Vitality</span>
            </h1>
            <p className="text-lg sm:text-xl text-white mb-8 font-medium drop-shadow-md">
              LES RÉDUCTIONS DE PRIX VOUS ATTENDENT
            </p>
            <div className="text-center mt-6">
              <p className="text-white text-sm sm:text-base mb-4 font-medium">Profitez des meilleures offres de la semaine avec des réductions incroyables !</p>
              <button 
                className="bg-white text-[#f899a2] hover:bg-gray-50 font-bold py-3 px-8 rounded-md uppercase tracking-wide transition-all shadow-md"
                onClick={() => {
                  window.scrollTo({ top: 500, behavior: 'smooth' });
                }}
              >
                Offres du jour
              </button>
            </div>
          </div>
        </section>

        {/* Brand/Shipping Ticker */}
        <div className="w-full bg-[#f6808b] text-white py-3 flex items-center justify-between px-4 sm:px-12 text-lg sm:text-xl font-bold uppercase tracking-widest overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee gap-8 items-center min-w-full justify-around">
            <span className="flex items-center gap-2">FedEx<span className="text-xs align-super">®</span></span>
            <span className="font-serif tracking-normal text-2xl lowercase flex items-center gap-2">
              <span className="text-white">❈</span> Yu.
            </span>
            <span className="flex items-center gap-2">FedEx<span className="text-xs align-super">®</span></span>
            <span className="font-serif tracking-normal text-2xl lowercase flex items-center gap-2 hidden sm:flex">
              <span className="text-white">❈</span> Yu.
            </span>
            <span className="flex items-center gap-2 hidden sm:flex">FedEx<span className="text-xs align-super">®</span></span>
          </div>
        </div>

        {/* Product Grid Section */}
        <section className="w-full max-w-5xl mx-auto px-4 pt-10 pb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-8">
            Best Selling Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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