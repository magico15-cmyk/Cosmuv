"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  BuildingStorefrontIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import {
  Squares2X2Icon as Squares2X2Solid,
  TagIcon as TagSolid,
  ShoppingBagIcon as ShoppingBagSolid,
  UsersIcon as UsersSolid,
  IdentificationIcon as IdentificationSolid,
  BuildingStorefrontIcon as BuildingStorefrontSolid,
} from "@heroicons/react/24/solid";

interface NavItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: string[];
}

const navItems: NavItem[] = [
  { label: "Overview", icon: Squares2X2Icon, activeIcon: Squares2X2Solid },
  { label: "Orders", icon: ShoppingBagIcon, activeIcon: ShoppingBagSolid },
  {
    label: "Product",
    icon: TagIcon,
    activeIcon: TagSolid,
    children: ["All products", "New product", "Categories"],
  },
  { label: "Customer", icon: IdentificationIcon, activeIcon: IdentificationSolid },
  {
    label: "Store",
    icon: BuildingStorefrontIcon,
    activeIcon: BuildingStorefrontSolid,
    children: ["General", "Theme", "Homepage", "Checkout", "Pages", "Menus", "Header & Footer", "Domains"],
  },
  { label: "Roles", icon: UsersIcon, activeIcon: UsersSolid },
];

const footerItems = [
  { label: "Settings", icon: Cog6ToothIcon },
  { label: "Log Out", icon: ArrowLeftOnRectangleIcon },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const getInitialActiveItem = () => {
    if (pathname?.startsWith("/admin/orders")) return "Orders";
    if (pathname?.startsWith("/admin/customers")) return "Customer";
    if (pathname?.startsWith("/admin/products")) return "Product";
    if (pathname === "/admin") return "Overview";
    if (pathname?.startsWith("/admin/store")) return "Store";
    return "Overview";
  };

  const [activeItem, setActiveItem] = useState(getInitialActiveItem());
  const [expandedItem, setExpandedItem] = useState<string | null>(getInitialActiveItem());
  const [storeName, setStoreName] = useState("COSMUV");

  useEffect(() => {
    async function fetchStoreName() {
      try {
        const res = await fetch("/api/store");
        if (res.ok) {
          const { store } = await res.json();
          if (store && store.store_name) {
            setStoreName(store.store_name);
            document.title = store.store_name + " | Admin";
          }
        }
      } catch (err) {
        console.error("Failed to fetch store name", err);
      }
    }
    fetchStoreName();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setStoreName(newName);
    document.title = newName;
  };

  const handleNameBlur = async () => {
    try {
      await fetch("/api/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ store_name: storeName })
      });
    } catch (err) {
      console.error("Failed to update store name", err);
    }
  };

  useEffect(() => {
    if (pathname?.startsWith("/admin/orders")) {
      setActiveItem("Orders");
    } else if (pathname?.startsWith("/admin/customers")) {
      setActiveItem("Customer");
    } else if (pathname?.startsWith("/admin/products")) {
      setActiveItem("Product");
    } else if (pathname === "/admin") {
      setActiveItem("Overview");
    } else if (pathname?.startsWith("/admin/store")) {
      setActiveItem("Store");
    }
  }, [pathname]);

  let activeChild = "";
  if (pathname === "/admin/products/new") {
    activeChild = "New product";
  } else if (pathname === "/admin/products/categories") {
    activeChild = "Categories";
  } else if (pathname === "/admin/products") {
    activeChild = "All products";
  } else if (pathname === "/admin/store/theme") {
    activeChild = "Theme";
  } else if (pathname === "/admin/store/checkout") {
    activeChild = "Checkout";
  } else if (pathname === "/admin/store/general") {
    activeChild = "General";
  } else if (pathname === "/admin/store/homepage") {
    activeChild = "Homepage";
  } else if (pathname === "/admin/store/pages") {
    activeChild = "Pages";
  } else if (pathname === "/admin/store/menus") {
    activeChild = "Menus";
  } else if (pathname === "/admin/store/footer") {
    activeChild = "Header & Footer";
  } else if (pathname === "/admin/store/domains") {
    activeChild = "Domains";
  }

  const handleChildClick = (child: string) => {
    if (child === "New product") {
      router.push("/admin/products/new");
    } else if (child === "All products") {
      router.push("/admin/products");
    } else if (child === "Categories") {
      router.push("/admin/products/categories");
    } else if (child === "Theme") {
      router.push("/admin/store/theme");
    } else if (child === "Checkout") {
      router.push("/admin/store/checkout");
    } else if (child === "General") {
      router.push("/admin/store/general");
    } else if (child === "Homepage") {
      router.push("/admin/store/homepage");
    } else if (child === "Pages") {
      router.push("/admin/store/pages");
    } else if (child === "Menus") {
      router.push("/admin/store/menus");
    } else if (child === "Header & Footer") {
      router.push("/admin/store/footer");
    } else if (child === "Domains") {
      router.push("/admin/store/domains");
    }
  };

  const handleParentClick = (label: string, hasChildren: boolean) => {
    setActiveItem(label);
    if (hasChildren) {
      setExpandedItem(expandedItem === label ? null : label);
    } else {
      if (label === "Orders") {
        router.push("/admin/orders");
      } else if (label === "Overview") {
        router.push("/admin");
      } else if (label === "Customer") {
        router.push("/admin/customers");
      }
    }
  };

  return (
    <aside className="w-56 h-full bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-50">
        <div className="flex items-center space-x-3 w-full">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center shadow-sm shrink-0">
            <ShoppingBagIcon className="w-5 h-5 text-white" />
          </div>
          <input
            type="text"
            value={storeName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            className="text-xl font-bold text-gray-900 tracking-tight bg-transparent border border-transparent md:hover:border-gray-200 focus:border-brand-500 rounded px-2 py-1 -ml-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 w-full cursor-text transition-all"
            placeholder="Store Name"
          />
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
                  onClick={() => handleParentClick(item.label, !!item.children)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-gray-900 bg-gray-50"
                      : "text-gray-500 md:hover:text-gray-800 md:hover:bg-gray-50 active:bg-gray-50"
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
                                ? "text-brand-500 font-medium"
                                : "text-gray-400 md:hover:text-gray-600 md:hover:bg-gray-50 active:bg-gray-50"
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
            onClick={async () => {
              if (item.label === "Settings") {
                router.push("/admin/settings");
              } else if (item.label === "Log Out") {
                const supabase = createClient();
                await supabase.auth.signOut();
                window.location.href = "/login";
              }
            }}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
              item.label === "Log Out"
                ? "text-red-400 hover:text-red-600 hover:bg-red-50"
                : pathname?.startsWith("/admin/settings") && item.label === "Settings"
                ? "text-gray-900 bg-gray-50"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <item.icon className={`w-5 h-5 ${pathname?.startsWith("/admin/settings") && item.label === "Settings" ? "text-brand-500" : ""}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
