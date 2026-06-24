"use client";

import React, { useRef, useEffect, useState } from 'react';

export default function RichTextEditor({ 
  value, 
  onChange, 
  align,
  color,
  id
}: { 
  value: string, 
  onChange: (val: string) => void, 
  align: any,
  color: string,
  id: string
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [savedRange, setSavedRange] = useState<Range | null>(null);

  const [hexColor, setHexColor] = useState('');

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`sello_rich_text_color_${id}`);
    if (saved) {
      setHexColor(saved);
    }
  }, [id]);

  const updateColor = (newColor: string) => {
    setHexColor(newColor);
    if (id) {
      localStorage.setItem(`sello_rich_text_color_${id}`, newColor);
    }
  };

  // Initialize value only once to avoid cursor jumping
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedRange(sel.getRangeAt(0));
    }
  };

  const handleApplyColor = () => {
    let finalColor = hexColor.trim();
    if (!finalColor) return;
    if (!finalColor.startsWith('#')) {
      finalColor = '#' + finalColor;
    }

    const sel = window.getSelection();
    if (savedRange && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange);
    }
    
    // Apply the color to the selected text
    document.execCommand('styleWithCSS', false, 'true');
    document.execCommand('foreColor', false, finalColor);
    
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-2 pb-2 border-b border-gray-100">
        <label className="text-xs font-medium text-gray-500">Color selected text:</label>
        <div className="flex items-center gap-2">
          <input 
            type="color" 
            value={hexColor.startsWith('#') ? hexColor : (hexColor ? `#${hexColor}` : '#000000')}
            onChange={(e) => {
              updateColor(e.target.value);
              
              const color = e.target.value;
              const sel = window.getSelection();
              if (savedRange && sel) {
                sel.removeAllRanges();
                sel.addRange(savedRange);
              }
              document.execCommand('styleWithCSS', false, 'true');
              document.execCommand('foreColor', false, color);
              if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
              }
            }}
            className="w-7 h-7 rounded cursor-pointer border border-gray-200 p-0 shadow-sm"
            title="Pick a color from palette"
          />
          <div className="flex items-center">
            <span className="text-gray-400 text-sm border border-r-0 border-gray-300 rounded-l-lg px-2 py-1 bg-gray-50">#</span>
            <input 
              type="text" 
              value={hexColor.replace('#', '')}
              onChange={(e) => updateColor(e.target.value)}
              placeholder="FE7F2D"
              maxLength={6}
              className="w-20 px-2 py-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm"
            />
            <button 
              onClick={handleApplyColor}
              className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-r-lg transition-colors border border-brand-600 hover:border-brand-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      <div 
        ref={editorRef}
        contentEditable
        onSelect={saveSelection}
        onBlur={saveSelection}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-colors min-h-[100px] whitespace-pre-wrap"
        style={{ textAlign: align, color: color }}
      />
    </div>
  );
}
