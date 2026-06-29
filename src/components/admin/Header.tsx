"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  BuildingStorefrontIcon,
  ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";
import dynamic from 'next/dynamic';
const GlobalSearchModal = dynamic(() => import('./GlobalSearchModal'), { ssr: false });

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [storeName, setStoreName] = useState("Cosmuv");
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchStoreName() {
      try {
        const res = await fetch("/api/store");
        if (res.ok) {
          const { store } = await res.json();
          if (store && store.store_name) {
            setStoreName(store.store_name);
          }
        }
      } catch (err) {
        console.error("Failed to fetch store name", err);
      }
    }
    fetchStoreName();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  let title = "Dashboard";
  let breadcrumb = "Home > Dashboard";
  
  if (pathname.endsWith('/admin')) {
    title = "Overview";
    breadcrumb = "Home > Overview";
  } else if (pathname.includes('/admin/products/new')) {
    title = "New product";
    breadcrumb = "Home > Product > New product";
  } else if (pathname.includes('/admin/products/categories')) {
    title = "Categories";
    breadcrumb = "Home > Product > Categories";
  } else if (pathname.includes('/admin/products')) {
    title = "All products";
    breadcrumb = "Home > Product > All products";
  } else if (pathname.match(/\/admin\/orders\/[^/]+/)) {
    title = "Edit Order";
    breadcrumb = "Home > Orders > Edit Order";
  } else if (pathname.includes('/admin/orders')) {
    title = "Orders";
    breadcrumb = "Home > Orders";
  } else if (pathname.includes('/admin/store/general')) {
    title = "General";
    breadcrumb = "Home > Store > General";
  } else if (pathname.includes('/admin/store/theme')) {
    title = "Theme";
    breadcrumb = "Home > Store > Theme";
  } else if (pathname.includes('/admin/store/checkout')) {
    title = "Checkout";
    breadcrumb = "Home > Store > Checkout";
  } else if (pathname.includes('/admin/store/pages')) {
    title = "Pages";
    breadcrumb = "Home > Store > Pages";
  } else if (pathname.includes('/admin/store/menus')) {
    title = "Menus";
    breadcrumb = "Home > Store > Menus";
  } else if (pathname.includes('/admin/store/footer')) {
    title = "Header & Footer";
    breadcrumb = "Home > Store > Header & Footer";
  } else if (pathname.includes('/admin/store/homepage')) {
    title = "Homepage";
    breadcrumb = "Home > Store > Homepage";
  } else if (pathname.includes('/admin/store/domains')) {
    title = "Domains";
    breadcrumb = "Home > Store > Domains";
  } else if (pathname.includes('/admin/store')) {
    title = "Store";
    breadcrumb = "Home > Store";
  } else if (pathname.includes('/admin/customer')) {
    title = "Customer";
    breadcrumb = "Home > Customer";
  } else if (pathname.includes('/admin/roles')) {
    title = "Roles";
    breadcrumb = "Home > Roles";
  }

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      {/* Left — Breadcrumb/Title */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {breadcrumb}
          </p>
        </div>
      </div>

      {/* Center — Search Bar */}
      <div 
        onClick={() => setIsSearchOpen(true)}
        className="hidden md:flex items-center w-96 bg-gray-100 rounded-full px-4 py-2.5 hover:bg-gray-200 cursor-text transition-all duration-200"
      >
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
        <span className="text-sm text-gray-500 w-full select-none">Search anything...</span>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center space-x-2">
        <button className="relative p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="w-px h-8 bg-gray-200 mx-2" />

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <div className="flex items-center space-x-2 pl-1 pr-2 cursor-pointer" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shadow-sm border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {storeName}
              </p>
              <p className="text-[11px] text-gray-400">Admin</p>
            </div>
          </div>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{storeName} Admin</p>
                <p className="text-xs text-gray-500">Your store: <span className="text-brand-600 font-semibold">{storeName}</span></p>
              </div>

              <div className="py-1">
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    router.push('/admin/settings/account');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 md:hover:bg-gray-50 active:bg-gray-50 flex items-center space-x-2"
                >
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span>Manage account</span>
                </button>
              </div>

              <div className="border-t border-gray-100 py-1">
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    window.open('/', '_blank');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 md:hover:bg-gray-50 active:bg-gray-50 flex items-center space-x-2"
                >
                  <BuildingStorefrontIcon className="w-4 h-4 text-gray-400" />
                  <span>Your store</span>
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 md:hover:bg-gray-50 active:bg-gray-50 flex items-center space-x-2">
                  <ArrowLeftOnRectangleIcon className="w-4 h-4 text-gray-400" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <GlobalSearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
          domain={pathname.split("/")[1] || "default"} 
        />
      )}
    </header>
  );
}
