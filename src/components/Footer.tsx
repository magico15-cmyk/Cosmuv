import React from 'react';
import Link from 'next/link';

export const Footer = ({ store }: { store?: any }) => {
  const footerMenu = store?.menus?.find((m: any) => m.slug === 'footer-menu');

  const showNewsletter = store?.footer_show_newsletter !== false;
  const newsletterTitle = store?.footer_newsletter_title || 'Subscribe to our emails';
  const newsletterSubtitle = store?.footer_newsletter_subtitle || 'Join our email list for exclusive offers and the latest news.';
  const logoText = store?.footer_logo_text || 'Yu.';
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
        {showNewsletter && (
          <>
            <div className="footer-subscribe">
              <h2>{newsletterTitle}</h2>
              <p>{newsletterSubtitle}</p>
              <div className="subscribe-form">
                <input type="email" placeholder="Email" />
                <button aria-label="Subscribe">→</button>
              </div>
            </div>
            <div className="footer-divider"></div>
          </>
        )}

        <div className="footer-bottom-grid">
          <div className="footer-logo">
            {logoUrl ? (
              <img src={logoUrl} alt="Footer Logo" style={{ height: `${logoSize}px` }} className="w-auto object-contain md:-ml-8" />
            ) : (
              <span className="logo-box md:-ml-8">{logoText}</span>
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
                  <li><Link href="/">Shop All</Link></li>
                  <li><Link href="/pages/about-us">About Us</Link></li>
                  <li><Link href="/pages/shipping">Shipping & Delivery</Link></li>
                  <li><Link href="/pages/faq">FAQ</Link></li>
                  <li><Link href="/contact">Contact Us</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
