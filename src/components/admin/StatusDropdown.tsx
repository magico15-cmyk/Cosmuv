"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const STATUS_CONFIGS = {
  confirmation: {
    'Open': 'bg-gray-400',
    'Closed': 'bg-green-500',
    'Processed': 'bg-gray-400',
    'Canceled by seller': 'bg-red-500'
  },
  payment: {
    'Paid': 'bg-green-500',
    'Unpaid': 'bg-gray-400',
    'Captured': 'bg-gray-400',
    'Refunded': 'bg-green-500',
    'Pending': 'bg-amber-500'
  },
  shipping: {
    'Fulfilled': 'bg-amber-500',
    'Unfulfilled': 'bg-gray-400',
    'Canceled': 'bg-sky-400',
    'Shipped': 'bg-gray-900',
    'Processing': 'bg-red-600'
  }
};

export default function StatusDropdown({ 
  type, 
  value, 
  onChange 
}: { 
  type: 'confirmation'|'payment'|'shipping', 
  value: string, 
  onChange: (v: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const options = Object.keys(STATUS_CONFIGS[type]);
  const color = STATUS_CONFIGS[type][value as keyof typeof STATUS_CONFIGS[typeof type]] || 'bg-gray-400';

  return (
    <div className="relative inline-block text-left">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium cursor-pointer transition-colors ${
          isOpen ? 'border-blue-500 text-gray-900 bg-white shadow-[0_0_0_1px_rgba(59,130,246,0.1)]' : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-50'
        }`}
      >
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        {value}
        <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500 ml-0.5" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 mt-1 w-40 rounded-md bg-white shadow-lg border border-gray-100 z-20 py-1">
            {options.map((option) => {
              const optColor = STATUS_CONFIGS[type][option as keyof typeof STATUS_CONFIGS[typeof type]];
              const isSelected = option === value;
              return (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 relative`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-blue-500 rounded-r-sm"></div>
                  )}
                  <div className={`w-2 h-2 rounded-full ${optColor} ${isSelected ? 'ml-1' : 'ml-1'}`}></div>
                  <span className={`${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
