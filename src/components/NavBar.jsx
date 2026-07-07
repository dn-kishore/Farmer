import React from 'react';
import { useApp } from '../context/AppContext';

const NavBar = () => {
  const { currentScreen, navigateTo, t } = useApp();

  if (currentScreen === 'login') return null;

  const tabs = [
    { id: 'dashboard', label: 'home', icon: 'home', fillIcon: true },
    { id: 'market', label: 'market', icon: 'storefront', fillIcon: true },
    { id: 'ai_help', label: 'aiHelp', icon: 'smart_toy', fillIcon: true },
    { id: 'weather', label: 'weather', icon: 'partly_cloudy_day', fillIcon: true },
    { id: 'alerts', label: 'alerts', icon: 'notifications', fillIcon: true }
  ];

  return (
    <nav className="bg-surface border-t border-outline-variant/30 fixed bottom-0 w-full z-40 flex justify-around items-center px-2 py-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:absolute md:bottom-0">
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigateTo(tab.id)}
            className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all duration-300 rounded-xl ${
              isActive 
                ? 'text-primary bg-primary-container/20 scale-105 font-bold' 
                : 'text-outline hover:text-primary'
            }`}
          >
            <span 
              className="material-symbols-outlined text-[24px]"
              style={{
                fontVariationSettings: `'FILL' ${isActive ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`
              }}
            >
              {tab.icon}
            </span>
            <span className="font-label-sm text-[11px] mt-0.5">
              {t(tab.label)}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default NavBar;
