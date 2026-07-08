import React from 'react';
import { useApp } from '../context/AppContext';

const MobileFrame = ({ children }) => {
  const { isDark } = useApp();
  return (
    <div className={`min-h-screen bg-[#1e231c] flex items-center justify-center py-0 md:py-8 px-0 md:px-4 ${isDark ? 'dark' : ''}`}>
      {/* Emulator container for desktop */}
      <div className="w-full md:w-[390px] h-screen md:h-[844px] bg-background md:rounded-[40px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] md:border-[10px] md:border-[#2f312e] relative overflow-hidden flex flex-col">
        {/* Phone Notch/Status Bar Simulation (Only on desktop) */}
        <div className="hidden md:flex justify-between items-center px-6 pt-3 pb-1 bg-surface-container/30 border-b border-outline-variant/10 text-xs font-semibold text-on-surface-variant relative z-50">
          <span>9:41</span>
          <div className="w-20 h-4 bg-[#2f312e] rounded-full absolute left-1/2 -translate-x-1/2 -top-1"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <span className="material-symbols-outlined text-[14px]">battery_5_bar</span>
          </div>
        </div>
        {/* App Contents */}
        <div className="flex-grow flex flex-col overflow-y-auto relative h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
