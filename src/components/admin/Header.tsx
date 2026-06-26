"use client";
import { usePathname } from "next/navigation";
import {
  MagnifyingGlassIcon,
  BellIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname() || "";
  
  let title = "Dashboard";
  let breadcrumb = "Home > Dashboard";
  
  if (pathname.endsWith('/admin')) {
    title = "All products";
    breadcrumb = "Home > Product > All products";
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
      <div className="hidden md:flex items-center w-96 bg-gray-100 rounded-full px-4 py-2.5 focus-within:ring-1 focus-within:ring-gray-300 focus-within:bg-white transition-all duration-200">
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
        <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-gray-400 bg-white rounded-md border border-gray-200">
          ⌘K
        </kbd>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center space-x-2">
        <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <QuestionMarkCircleIcon className="w-5 h-5" />
        </button>
        <button className="relative p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
          <MoonIcon className="w-5 h-5" />
        </button>

        <div className="w-px h-8 bg-gray-200 mx-2" />

        {/* User Profile */}
        <div className="flex items-center space-x-3 pl-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            JD
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              John Doe
            </p>
            <p className="text-[11px] text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
