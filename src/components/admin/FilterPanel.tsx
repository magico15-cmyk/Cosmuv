"use client";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface FilterSection {
  title: string;
  defaultOpen?: boolean;
}

const sections: FilterSection[] = [
  { title: "Categories", defaultOpen: true },
  { title: "Product Price", defaultOpen: true },
  { title: "Gender", defaultOpen: true },
  { title: "Size & Fit", defaultOpen: false },
];

const categories = [
  { label: "All Products", count: 245 },
  { label: "Footwear", count: 86 },
  { label: "Accessories", count: 64 },
  { label: "Clothing", count: 52 },
  { label: "Electronics", count: 43 },
];

const priceRanges = [
  { label: "Under $50", value: "0-50" },
  { label: "$50 - $100", value: "50-100" },
  { label: "$100 - $200", value: "100-200" },
  { label: "$200 - $500", value: "200-500" },
  { label: "Over $500", value: "500+" },
];

const genders = ["All", "Men", "Women", "Unisex"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FilterPanelProps {
  onFilterChange?: (filters: Record<string, unknown>) => void;
}

export default function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Categories: true,
    "Product Price": true,
    Gender: true,
    "Size & Fit": false,
  });
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(500);
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("500");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["M"]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const togglePriceRange = (value: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleApply = () => {
    onFilterChange?.({
      category: selectedCategory,
      priceRanges: selectedPriceRanges,
      priceSlider: priceRange,
      minPrice,
      maxPrice,
      gender: selectedGender,
      sizes: selectedSizes,
    });
  };

  const renderSectionContent = (title: string) => {
    switch (title) {
      case "Categories":
        return (
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.label}>
                <button
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.label
                      ? "bg-brand-50 text-brand-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === cat.label
                        ? "bg-brand-100 text-brand-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        );

      case "Product Price":
        return (
          <div className="space-y-4">
            {/* Checkboxes */}
            <div className="space-y-2.5">
              {priceRanges.map((range) => (
                <label
                  key={range.value}
                  className="flex items-center space-x-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.includes(range.value)}
                    onChange={() => togglePriceRange(range.value)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-gray-300 focus:border-gray-300"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Range Slider */}
            <div className="pt-2">
              <div className="relative">
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(Number(e.target.value));
                    setMaxPrice(e.target.value);
                  }}
                  className="w-full"
                />
                {/* Tooltip */}
                <div
                  className="absolute -top-8 transform -translate-x-1/2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded-md pointer-events-none"
                  style={{ left: `${(priceRange / 1000) * 100}%` }}
                >
                  ${priceRange}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                </div>
              </div>
            </div>

            {/* Min / Max inputs */}
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <label className="text-[11px] text-gray-400 font-medium uppercase">
                  Min
                </label>
                <div className="mt-1 flex items-center border border-gray-200 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs text-gray-400 mr-1">$</span>
                  <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>
              </div>
              <span className="text-gray-300 mt-5">—</span>
              <div className="flex-1">
                <label className="text-[11px] text-gray-400 font-medium uppercase">
                  Max
                </label>
                <div className="mt-1 flex items-center border border-gray-200 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs text-gray-400 mr-1">$</span>
                  <input
                    type="text"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "Gender":
        return (
          <div className="flex flex-wrap gap-2">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  selectedGender === g
                    ? "bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        );

      case "Size & Fit":
        return (
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => toggleSize(s)}
                className={`py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  selectedSizes.includes(s)
                    ? "bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-64 flex-shrink-0 overflow-y-auto custom-scrollbar space-y-1 pr-2">
      <h2 className="text-base font-bold text-gray-900 mb-4 px-1">Filters</h2>

      {sections.map((section) => {
        const isOpen = openSections[section.title];
        return (
          <div
            key={section.title}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span>{section.title}</span>
              {isOpen ? (
                <ChevronUpIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {isOpen && (
              <div className="px-4 pb-4">
                {renderSectionContent(section.title)}
              </div>
            )}
          </div>
        );
      })}

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-brand-400 to-brand-500 text-white font-semibold text-sm shadow-sm hover:shadow-md hover:from-brand-500 hover:to-brand-600 transition-all duration-200 active:scale-[0.98]"
      >
        Apply Filters
      </button>

      {/* Reset */}
      <button className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium">
        Reset All
      </button>
    </div>
  );
}
