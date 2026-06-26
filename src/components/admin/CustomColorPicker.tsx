"use client";

import React, { useState, useEffect, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { Pipette } from "lucide-react";

// Utility to convert Hex to RGB
const hexToRgb = (hex: string) => {
  const safeHex = hex.replace("#", "");
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    safeHex.length === 3 ? safeHex.split('').map(c => c + c).join('') : safeHex
  );
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Utility to convert RGB to Hex
const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

interface CustomColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  trigger?: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}

export default function CustomColorPicker({ color, onChange, trigger, className = "", align = "left" }: CustomColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const safeColor = color?.startsWith('#') ? color : (color ? `#${color}` : '#000000');
  const [rgb, setRgb] = useState(hexToRgb(safeColor));
  
  useEffect(() => {
    setRgb(hexToRgb(safeColor));
  }, [safeColor]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleRgbChange = (channel: 'r'|'g'|'b', value: string) => {
    let num = parseInt(value, 10);
    if (isNaN(num)) num = 0;
    if (num > 255) num = 255;
    if (num < 0) num = 0;
    
    const newRgb = { ...rgb, [channel]: num };
    setRgb(newRgb);
    onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleEyedropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        onChange(result.sRGBHex.toUpperCase());
      } catch (e) {
        console.log("Eyedropper cancelled");
      }
    } else {
      alert("Eyedropper is not supported in your browser.");
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <div className="w-6 h-6 rounded cursor-pointer border border-gray-200" style={{ backgroundColor: safeColor }} />
        )}
      </div>

      {/* Popover */}
      {isOpen && (
        <div 
          className={`absolute z-50 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-64 ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Select Color</span>
            {typeof window !== 'undefined' && 'EyeDropper' in window && (
              <button 
                onClick={handleEyedropper}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Pick a color from screen"
              >
                <Pipette className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="mb-4">
             <style dangerouslySetInnerHTML={{__html: `
               .react-colorful { width: 100% !important; height: 160px !important; }
               .react-colorful__pointer { width: 20px !important; height: 20px !important; }
             `}} />
            <HexColorPicker color={safeColor} onChange={(c) => onChange(c.toUpperCase())} />
          </div>
          
          {/* RGB Inputs with requested styling */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-center text-xs font-medium text-gray-500 mb-1.5">R</label>
              <input 
                type="number" 
                min="0" 
                max="255" 
                value={rgb.r}
                onChange={(e) => handleRgbChange('r', e.target.value)}
                className="w-full px-2 py-1.5 text-sm text-center border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-center text-xs font-medium text-gray-500 mb-1.5">G</label>
              <input 
                type="number" 
                min="0" 
                max="255" 
                value={rgb.g}
                onChange={(e) => handleRgbChange('g', e.target.value)}
                className="w-full px-2 py-1.5 text-sm text-center border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-center text-xs font-medium text-gray-500 mb-1.5">B</label>
              <input 
                type="number" 
                min="0" 
                max="255" 
                value={rgb.b}
                onChange={(e) => handleRgbChange('b', e.target.value)}
                className="w-full px-2 py-1.5 text-sm text-center border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
