"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Flame, Sparkles, Star, Zap } from 'lucide-react';

const DeliveryIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 24 24" width={size} className={className} fill="currentColor">
    <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
    <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
    <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
  </svg>
);

export function GlobalHeader({ store }: { store?: any }) {
  const pathname = usePathname();

  // Do not render the storefront header on admin pages
  if (pathname?.includes('/admin')) {
    return null;
  }

  // Notice Bar Desktop Settings
  const desktopNoticeEnabled = store?.notice_bar_desktop_enabled ?? false;
  const desktopNoticeText = store?.notice_bar_desktop_text || '';
  const desktopNoticeIcon = store?.notice_bar_desktop_icon || 'flame';
  const desktopNoticeBgColor = store?.notice_bar_desktop_bg_color || '#000000';
  const desktopNoticeTextColor = store?.notice_bar_desktop_text_color || '#FFFFFF';
  const desktopNoticeAboveHeader = store?.notice_bar_desktop_above_header ?? true;

  // Notice Bar Mobile Settings
  const mobileNoticeEnabled = store?.notice_bar_mobile_enabled ?? false;
  const mobileNoticeText = store?.notice_bar_mobile_text || '';
  const mobileNoticeIcon = store?.notice_bar_mobile_icon || 'flame';
  const mobileNoticeBgColor = store?.notice_bar_mobile_bg_color || '#000000';
  const mobileNoticeTextColor = store?.notice_bar_mobile_text_color || '#FFFFFF';
  const mobileNoticeAboveHeader = store?.notice_bar_mobile_above_header ?? true;

  // Render Icon helper
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'flame': return <Flame size={20} className="icon-flame mr-2 flex-shrink-0" fill="currentColor" stroke="currentColor" />;
      case 'sparkles': return <Sparkles size={20} className="icon-sparkles mr-2 flex-shrink-0" fill="currentColor" stroke="currentColor" />;
      case 'star': return <Star size={20} className="icon-star mr-2 flex-shrink-0" fill="currentColor" stroke="currentColor" />;
      case 'zap': return <Zap size={20} className="icon-zap mr-2 flex-shrink-0" fill="currentColor" stroke="currentColor" />;
      case 'delivery': return <DeliveryIcon size={22} className="icon-delivery mr-2 flex-shrink-0" />;
      case 'none': 
      default: return null;
    }
  };

  // A helper component to render the scrolling marquee
  const ScrollingNotice = ({ 
    text, 
    bgColor, 
    textColor, 
    className,
    iconName
  }: { 
    text: string; 
    bgColor: string; 
    textColor: string; 
    className: string; 
    iconName: string;
  }) => {
    return (
      <div 
        className={`top-scroll-bar ${className}`} 
        style={{ backgroundColor: bgColor }}
      >
        <div className="scroll-track">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="scroll-content">
              {/* Rich text notice item. The global CSS for .scroll-item sets some flex properties. 
                  We override color here dynamically. */}
              <div 
                className="scroll-item flex items-center" 
                style={{ color: textColor }}
              >
                {renderIcon(iconName)}
                <div className="prose prose-sm max-w-none [&_p]:m-0" dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DesktopNoticeBar = () => {
    if (!desktopNoticeEnabled || !desktopNoticeText) return null;
    return <ScrollingNotice text={desktopNoticeText} bgColor={desktopNoticeBgColor} textColor={desktopNoticeTextColor} className="hidden md:block" iconName={desktopNoticeIcon} />;
  };

  const MobileNoticeBar = () => {
    if (!mobileNoticeEnabled || !mobileNoticeText) return null;
    return <ScrollingNotice text={mobileNoticeText} bgColor={mobileNoticeBgColor} textColor={mobileNoticeTextColor} className="md:hidden block" iconName={mobileNoticeIcon} />;
  };

  return (
    <>
      {/* ABOVE HEADER NOTICES */}
      {desktopNoticeAboveHeader && <DesktopNoticeBar />}
      {mobileNoticeAboveHeader && <MobileNoticeBar />}

      <Header store={store} />

      {/* BELOW HEADER NOTICES */}
      {!desktopNoticeAboveHeader && <DesktopNoticeBar />}
      {!mobileNoticeAboveHeader && <MobileNoticeBar />}
    </>
  );
}
