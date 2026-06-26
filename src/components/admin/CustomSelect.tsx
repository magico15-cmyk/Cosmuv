"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  direction?: 'up' | 'down';
}

export default function CustomSelect({ value, onChange, options, direction = 'down' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 text-left bg-gray-50 border rounded-xl flex items-center justify-between transition-colors focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 ${
          isOpen ? "border-gray-300 ring-1 ring-gray-300" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className="flex items-center gap-2 truncate text-gray-900">
          {selectedOption?.icon}
          {selectedOption?.label}
        </span>
        <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div 
          className={`absolute z-[99] w-full bg-white border border-gray-100 rounded-xl shadow-lg py-1 overflow-hidden animate-in fade-in duration-200 ${
            direction === 'up' 
              ? 'bottom-full mb-2 slide-in-from-bottom-2' 
              : 'top-full mt-2 slide-in-from-top-2'
          }`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                option.value === value
                  ? "bg-brand-50 text-brand-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </div>
              {option.value === value && <CheckIcon className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
