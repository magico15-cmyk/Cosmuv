import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Footer = ({ store }: { store?: any }) => {
  const footerMenu = store?.menus?.find((m: any) => m.slug === 'footer-menu');

  const showNewsletter = store?.footer_show_newsletter !== false;
  const newsletterTitle = store?.footer_newsletter_title || 'Subscribe to our emails';
  const newsletterSubtitle = store?.footer_newsletter_subtitle || 'Join our email list for exclusive offers and the latest news.';
  const logoText = store?.footer_logo_text || 'Cosmuv.';
  const logoUrl = store?.footer_logo_url;
  const logoSize = store?.footer_logo_size || 48;
  const linksTitle = store?.footer_links_title || 'Products';

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
        <div className="footer-subscribe flex flex-col self-stretch">
          <div>
            {showNewsletter && (
              <>
                <h2>{newsletterTitle}</h2>
                <p>{newsletterSubtitle}</p>
                <div className="subscribe-form">
                  <input type="email" placeholder="Email" />
                  <button aria-label="Subscribe">→</button>
                </div>
              </>
            )}
          </div>
          <div className="hidden md:block mt-auto pb-2 text-center w-full">
            <p className="text-xs text-white/50">
              Powered by <a href="https://cosmuv.com" className="font-semibold text-white/80 hover:text-white transition-colors">Cosmuv</a>
            </p>
          </div>
        </div>
        {showNewsletter && <div className="footer-divider md:hidden"></div>}

        <div className="footer-bottom-grid">
          <div className="footer-logo">
            {logoUrl ? (
              <div className="relative w-full md:-ml-8" style={{ height: `${logoSize}px`, maxWidth: '300px' }}>
                <Image 
                  src={logoUrl} 
                  alt="Footer Logo" 
                  fill
                  sizes="300px"
                  className="object-contain object-left md:object-center" 
                />
              </div>
            ) : (
              <span className="logo-box">{logoText}</span>
            )}
          </div>
          
          <div className="footer-links">
            <h3>{linksTitle}</h3>
            <ul>
              {footerMenu ? (
                footerMenu.items.map((item: any, i: number) => (
                  <li key={i}><Link href={item.url}>{item.label}</Link></li>
                ))
              ) : (
                <>
                  <li><Link href="/pages/about-us">About Us</Link></li>
                  <li><Link href="/pages/privacy-policy-confidentiality">Privacy Policy & Confidentiality</Link></li>
                  <li><Link href="/pages/terms-and-conditions">Terms and Conditions</Link></li>
                  <li><Link href="/pages/shipping">Shipping & Delivery</Link></li>
                  <li><Link href="/pages/contact-us">Contact Us</Link></li>
                  <li><Link href="/pages/faq">FAQ</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div className="md:hidden w-full mt-3 pt-3 border-t border-white/10 flex flex-col items-center justify-center pb-0 text-center">
          <p className="text-xs text-white/50">
            Powered by <a href="https://cosmuv.com" className="font-semibold text-white/80 hover:text-white transition-colors">Cosmuv</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
