import React from 'react';
import { Flame } from 'lucide-react';

export const TopBar = () => {
  return (
    <div className="top-scroll-bar">
      <div className="scroll-track">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="scroll-content">
            <span className="scroll-item"><Flame size={20} className="icon-fire" /> HIGH DEMAND: SELLING OUT FAST</span>
            <span className="scroll-item"><Flame size={20} className="icon-fire" /> HIGH DEMAND: SELLING OUT FAST</span>
            <span className="scroll-item"><Flame size={20} className="icon-fire" /> HIGH DEMAND: SELLING OUT FAST</span>
          </div>
        ))}
      </div>
    </div>
  );
};
