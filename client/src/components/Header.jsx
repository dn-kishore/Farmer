import React from 'react';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { currentScreen, language, setLanguage, navigateBack, isDark, toggleDarkMode, t, logout, clearWeatherLocation } = useApp();
  const [showLogoutMenu, setShowLogoutMenu] = React.useState(false);

  const isTel = language === 'te';

  if (currentScreen === 'login') return null;

  return (
    <header className="bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-md border-b border-outline-variant/30 flex justify-between items-center px-md py-sm w-full sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-sm relative">
        {/* Back Button if not on Dashboard */}
        {currentScreen !== 'dashboard' && (
          <button 
            onClick={navigateBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-90 transition-transform text-primary"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
        )}
        
        {/* Avatar */}
        {currentScreen === 'dashboard' && (
          <div 
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center overflow-hidden border border-primary-container/30 cursor-pointer active:scale-95 transition-transform"
          >
            <img 
              alt="Farmer Profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwYddgrPA7iAFg-9aQb2CmYR7sK5ty1INF8L5huNbeCc3ACwJLzefP_P8koY0iqZJnF3AVQd5G3OXzWy-pFjalIrEZYsHZPuBHU6fl4QEF82wWQ-C7yljuFiafyqkKcu4WkIyQk2_S-gK4jXBnEer4BUvAYInbcnqa0CykZyr5IO16VbfREXWLCSYf9vYcXi_s3XyjtcpCJcWZTYNaYV7qbk6YHPZZshSXIbDK1vY21tQFq_oN0qoILA"
            />
          </div>
        )}
        
        <h1 className="font-title-md text-title-md font-bold text-primary tracking-tight">
          {t('appName')}
        </h1>

        {/* Logout Popover Dropdown */}
        {showLogoutMenu && (
          <div className="absolute top-12 left-0 bg-white dark:bg-[#1d201c] border border-outline-variant/30 rounded-xl p-1.5 shadow-lg z-50 flex flex-col min-w-[150px] animate-in fade-in slide-in-from-top-2 duration-150">
            <button 
              onClick={() => {
                setShowLogoutMenu(false);
                clearWeatherLocation();
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[10px] font-bold text-on-surface hover:bg-surface-container active:scale-95 transition-all text-left w-full border-b border-outline-variant/20 pb-2 mb-1.5"
            >
              <span className="material-symbols-outlined text-sm text-primary">location_off</span>
              {isTel ? 'ప్రాంతాన్ని రీసెట్ చేయి' : 'Reset Location'}
            </button>
            <button 
              onClick={() => {
                setShowLogoutMenu(false);
                logout();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold text-error hover:bg-error-container/10 active:scale-95 transition-all text-left w-full"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              {t('logout')}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Switcher Toggle */}
        <button 
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-container/10 text-primary hover:bg-primary-container/20 transition-colors active:scale-95 duration-200"
          aria-label="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Language Button */}
        <button 
          onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
          className="font-label-md text-label-md font-semibold text-primary hover:opacity-80 transition-opacity bg-primary-container/10 px-3 py-2 rounded-lg active:scale-95 duration-200"
        >
          {language === 'en' ? 'తెలుగు' : 'English'}
        </button>
      </div>
    </header>
  );
};

export default Header;
