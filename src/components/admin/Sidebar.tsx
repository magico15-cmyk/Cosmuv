"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  TagIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  UsersIcon,
  IdentificationIcon,
  QuestionMarkCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  Squares2X2Icon as Squares2X2Solid,
  TagIcon as TagSolid,
  ShoppingBagIcon as ShoppingBagSolid,
  UsersIcon as UsersSolid,
  IdentificationIcon as IdentificationSolid,
} from "@heroicons/react/24/solid";

interface NavItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: string[];
}

const navItems: NavItem[] = [
  { label: "Overview", icon: Squares2X2Icon, activeIcon: Squares2X2Solid },
  {
    label: "Product",
    icon: TagIcon,
    activeIcon: TagSolid,
    children: ["All products", "New product", "Categories"],
  },
  { label: "Orders", icon: ShoppingBagIcon, activeIcon: ShoppingBagSolid },
  { label: "Roles", icon: UsersIcon, activeIcon: UsersSolid },
  { label: "Customer", icon: IdentificationIcon, activeIcon: IdentificationSolid },
];

const footerItems = [
  { label: "Help Desk", icon: QuestionMarkCircleIcon },
  { label: "Settings", icon: Cog6ToothIcon },
  { label: "Log Out", icon: ArrowLeftOnRectangleIcon },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("Product");
  const [expandedItem, setExpandedItem] = useState<string | null>("Product");

  let activeChild = "";
  if (pathname === "/admin/products/new") {
    activeChild = "New product";
  } else if (pathname === "/admin/categories") {
    activeChild = "Categories";
  } else if (pathname?.startsWith("/admin")) {
    activeChild = "All products";
  }

  const handleChildClick = (child: string) => {
    if (child === "New product") {
      router.push("/admin/products/new");
    } else if (child === "All products") {
      router.push("/admin");
    } else if (child === "Categories") {
      // router.push("/admin/categories");
    }
  };

  return (
    <aside className="w-56 h-full bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center shadow-sm">
            <ShoppingBagIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Shoplytic
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Main Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeItem === item.label;
            const isExpanded = expandedItem === item.label;
            const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;

            return (
              <li key={item.label}>
                <button
                  onClick={() => {
                    setActiveItem(item.label);
                    if (item.children) {
                      setExpandedItem(isExpanded ? null : item.label);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-gray-900 bg-gray-50"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-brand-500" : "text-gray-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.children && (
                    <span className="text-gray-400">
                      {isExpanded ? (
                        <ChevronDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </button>

                {/* Accordion children */}
                {item.children && isExpanded && (
                  <ul className="ml-8 mt-1 space-y-0.5">
                    {item.children.map((child) => {
                      const isChildActive = activeChild === child;
                      return (
                        <li key={child}>
                          <button
                            onClick={() => handleChildClick(child)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-150 
${
                              isChildActive
                                ? "bg-teal-50 text-teal-600 font-medium border-l-2 border-teal-500"
                                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {child}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 px-3 py-3 space-y-0.5">
        {footerItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
              item.label === "Log Out"
                ? "text-red-400 hover:text-red-600 hover:bg-red-50"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
