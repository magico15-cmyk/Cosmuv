"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '../components/TopBar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const FedExLogo = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="10 45.67 160.003 44.33" className={className}>
    <path d="M169.018 84.244c0-2.465-1.748-4.27-4.156-4.27-2.404 0-4.154 1.805-4.154 4.27 0 2.461 1.75 4.263 4.154 4.263 2.408 0 4.156-1.805 4.156-4.263zm-5.248.219v2.789h-.901v-6.15h2.239c1.312 0 1.914.573 1.914 1.69 0 .688-.465 1.233-1.064 1.312v.026c.52.083.711.547.818 1.396.082.55.191 1.504.387 1.728h-1.066c-.248-.578-.223-1.396-.414-2.081-.158-.521-.436-.711-1.033-.711h-.875v.003l-.005-.002zm1.117-.795c.875 0 1.125-.466 1.125-.877 0-.486-.25-.87-1.125-.87h-1.117v1.749h1.117v-.002zm-5.17.576c0-3.037 2.411-5.09 5.141-5.09 2.738 0 5.146 2.053 5.146 5.09 0 3.031-2.407 5.086-5.146 5.086-2.73 0-5.141-2.055-5.141-5.086z" fill="currentColor"/><g fill="currentColor"><path d="M141.9 88.443l-5.927-6.647-5.875 6.647h-12.362l12.082-13.574-12.082-13.578h12.748l5.987 6.596 5.761-6.596h12.302l-12.022 13.521 12.189 13.631zM93.998 88.443V45.67h23.738v9.534h-13.683v6.087h13.683v9.174h-13.683v8.42h13.683v9.558z"/></g><path d="M83.98 45.67v17.505h-.111c-2.217-2.548-4.988-3.436-8.201-3.436-6.584 0-11.544 4.479-13.285 10.396-1.986-6.521-7.107-10.518-14.699-10.518-6.167 0-11.035 2.767-13.578 7.277V61.29H21.361v-6.085h13.91v-9.533H10v42.771h11.361V70.465h11.324a17.082 17.082 0 0 0-.519 4.229c0 8.918 6.815 15.185 15.516 15.185 7.314 0 12.138-3.437 14.687-9.694h-9.737c-1.316 1.883-2.316 2.439-4.949 2.439-3.052 0-5.686-2.664-5.686-5.818h19.826C62.683 83.891 68.203 90 75.779 90c3.268 0 6.26-1.607 8.089-4.322h.11v2.771h10.017V45.672H83.98v-.002zM42.313 70.593c.633-2.718 2.74-4.494 5.37-4.494 2.896 0 4.896 1.721 5.421 4.494H42.313zm35.588 11.341c-3.691 0-5.985-3.439-5.985-7.031 0-3.84 1.996-7.529 5.985-7.529 4.139 0 5.788 3.691 5.788 7.529 0 3.638-1.746 7.031-5.788 7.031z" fill="currentColor"/>
  </svg>
);

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
              className="bg-[#f899a2] hover:bg-[#e6828b] text-white font-bold rounded-md text-[16px] transition-all shadow-sm"
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
        <div className="w-full bg-[#f899a2] text-white flex items-center overflow-hidden whitespace-nowrap" style={{ padding: '12px 0' }}>
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

        {/* Product Grid Section */}
        <section className="w-full max-w-5xl mx-auto px-4 pt-10 pb-16" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-8">
            Best Selling Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden flex flex-col relative cursor-pointer group" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                {/* Product Image area */}
                <div className="relative aspect-[4/5] w-full bg-gray-100 overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {/* Discount Badge */}
                  <div className="absolute bottom-3 left-3 bg-[#f899a2] text-white text-[11px] sm:text-[12px] font-bold px-2.5 py-1 rounded flex items-center gap-1 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
                    </svg>
                    SAVE {product.save}%
                  </div>
                </div>
                
                {/* Content area */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow text-center items-center justify-between">
                  <h3 className="font-extrabold text-black text-[14px] sm:text-[16px] leading-[1.3] line-clamp-4">{product.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium tracking-widest uppercase mt-3 mb-2">{product.brand}</p>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="font-extrabold text-[#f899a2] text-[16px] sm:text-[18px] tracking-wide">${product.price}</span>
                    <span className="text-[#111827] text-[12px] sm:text-[14px] font-bold line-through decoration-[#111827] decoration-2">${product.oldPrice}</span>
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