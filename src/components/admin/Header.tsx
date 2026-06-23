"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const displayName = "Sello Admin";
  const displayEmail = "selloappsupport@gmail.com";
  const activeRole = "Owner";

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    return '#f899a2'; // Sello brand color
  };

  const getPageInfo = () => {
    switch (pathname) {
      case '/admin':
        return { 
          title: 'Products', 
          subtitle: 'Manage store inventory',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          )
        };
      case '/admin/orders':
        return { 
          title: 'Orders', 
          subtitle: 'Process incoming orders',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
            </svg>
          )
        };
      case '/admin/settings':
        return { 
          title: 'Settings', 
          subtitle: 'Manage your store preferences',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" transform="translate(-0.01, 0.01)" d="
                M 6 13.5
                V 3.75
                m 0 9.75
                a 1.5 1.5 0 0 1 0 3
                m 0 -3
                a 1.5 1.5 0 0 0 0 3
                m 0 3.75
                V 16.5
                m 12 -3
                V 3.75
                m 0 9.75
                a 1.5 1.5 0 0 1 0 3
                m 0 -3
                a 1.5 1.5 0 0 0 0 3
                m 0 3.75
                V 16.5
                m -6 -9
                V 3.75
                m 0 3.75
                a 1.5 1.5 0 0 1 0 3
                m 0 -3
                a 1.5 1.5 0 0 0 0 3
                m 0 9.75
                V 10.5" />
            </svg>
          )
        };
      default:
        return { 
          title: 'Admin', 
          subtitle: 'Store Management',
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
            </svg>
          )
        };
    }
  };

  const pageInfo = getPageInfo();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside as any);
    document.addEventListener("touchstart", handleClickOutside as any, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside as any);
      document.removeEventListener("touchstart", handleClickOutside as any);
    };
  }, []);

  return (
    <div className="w-full bg-white px-3 sm:px-5 py-3 flex items-center justify-between shrink-0 relative z-[60] border-b border-gray-100 shadow-sm">
      {/* Left Section: Hamburger + Page Title */}
      <div className="flex items-center gap-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="hidden md:hidden w-9 h-9 rounded-lg items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors mr-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Dynamic Page Icon */}
        <div className="p-2 text-gray-600 mr-2 sm:mr-4 border-r border-gray-200 sm:pr-5 flex items-center justify-center">
          {pageInfo.icon}
        </div>

        {/* Page Title */}
        <div className="leading-tight">
          <h1 className="text-[14px] sm:text-[15px] font-semibold text-gray-900">{pageInfo.title}</h1>
          <p className="text-[11px] text-gray-500 hidden sm:block">{pageInfo.subtitle}</p>
        </div>
      </div>

      {/* Right Section: User */}
      <div className="flex items-center gap-2 sm:gap-3">
        <a href="/" className="text-[13px] text-blue-600 hover:text-blue-800 font-medium mr-4 hidden sm:block">View Storefront</a>
        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors border border-transparent hover:border-gray-100"
          >
            <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center text-[13px] font-bold shadow-sm" style={{ backgroundColor: getAvatarColor(displayName) }}>
              {getInitials(displayName)}
            </div>
            {/* Name & Role */}
            <div className="text-left leading-tight hidden md:block">
              <div className="flex items-center gap-1">
                <p className="text-[13px] font-semibold text-gray-900 truncate max-w-[120px]">
                  {displayName}
                </p>
              </div>
              <p className="text-[10px] text-gray-400 font-medium">{activeRole}</p>
            </div>
            {/* Chevron */}
            <svg
              className={`hidden md:block w-4 h-4 text-gray-400 ml-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ backgroundColor: getAvatarColor(displayName) }}>
                    {getInitials(displayName)}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-gray-800 leading-tight truncate">
                      {displayName}
                    </div>
                    <div className="text-[11px] text-gray-500 font-medium leading-tight truncate" title={displayEmail}>
                      {displayEmail}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="py-2">
                <button onClick={() => { setIsProfileOpen(false); router.push('/'); }} className="w-full flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  View Storefront
                </button>
              </div>

              <div className="border-t border-gray-100 p-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[13px] font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
