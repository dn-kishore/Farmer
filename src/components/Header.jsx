import React from 'react';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { currentScreen, language, setLanguage, navigateBack, isDark, toggleDarkMode, t } = useApp();

  if (currentScreen === 'login') return null;

  return (
    <header className="bg-surface/90 dark:bg-surface-dim/90 backdrop-blur-md border-b border-outline-variant/30 flex justify-between items-center px-md py-sm w-full sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-sm">
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
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center overflow-hidden border border-primary-container/30">
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
