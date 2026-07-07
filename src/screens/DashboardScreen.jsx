import React from 'react';
import { useApp } from '../context/AppContext';

const DashboardScreen = () => {
  const { navigateTo, t } = useApp();

  const tiles = [
    { id: 'purchases', title: 'purchases', desc: 'trackSupplies', icon: 'shopping_cart', color: 'bg-surface-container dark:bg-white/10 text-primary dark:text-[#88d982]', bg: 'bg-surface-container-lowest' },
    { id: 'expenses', title: 'expenses', desc: 'expenseSub', icon: 'account_balance_wallet', color: 'bg-error-container dark:bg-[#ba1a1a]/30 text-on-error-container dark:text-[#ffb3ac]', bg: 'bg-surface-container-lowest' },
    { id: 'crop_diagnosis', title: 'diseaseCheck', desc: 'scanCrop', icon: 'pest_control', color: 'bg-tertiary-container/10 dark:bg-white/10 text-tertiary dark:text-[#ffb3ac]', bg: 'bg-surface-container-lowest' },
    { id: 'fertilizer_help', title: 'fertilizerHelp', desc: 'Calculate N-P-K', icon: 'calculate', color: 'bg-primary-container/10 dark:bg-white/10 text-primary dark:text-[#88d982]', bg: 'bg-surface-container-lowest' },
    { id: 'safety_guide', title: 'safetyGuide', desc: 'Safety Checklists', icon: 'health_and_safety', color: 'bg-tertiary-container/10 dark:bg-white/10 text-tertiary dark:text-[#ffb3ac]', bg: 'bg-surface-container-lowest' }
  ];

  return (
    <div className="flex-grow flex flex-col pb-28">
      {/* Greeting & Weather Banner */}
      <section className="px-md pt-lg pb-md">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-xs font-bold">
          {t('goodMorning')}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
          {t('overview')}
        </p>
        
        {/* Weather Widget Card */}
        <div 
          onClick={() => navigateTo('weather')}
          className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-md shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform duration-200"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-secondary-fixed opacity-40 blur-2xl rounded-full"></div>
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-primary-fixed opacity-20 blur-2xl rounded-full"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-xs text-secondary dark:text-[#ffb955] mb-xs">
                <span className="material-symbols-outlined text-[16px] dark:text-[#ffb955]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <span className="font-label-sm text-label-sm font-semibold">{t('location')}</span>
              </div>
              <div className="font-display-lg text-display-lg text-on-background leading-none font-bold">{t('temp')}</div>
              <div className="font-label-md text-label-md text-on-surface-variant mt-2 font-medium">
                {t('partlyCloudy')} • {t('humidity')}: 65%
              </div>
            </div>
            <div className="text-secondary dark:text-[#ffb955] drop-shadow-md">
              <span className="material-symbols-outlined text-[72px]" style={{ fontVariationSettings: "'FILL' 1" }}>partly_cloudy_day</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="px-md flex-grow">
        <div className="grid grid-cols-2 gap-md">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              onClick={() => navigateTo(tile.id)}
              className={`${tile.bg} rounded-xl p-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/10 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex flex-col justify-between aspect-square`}
            >
              {tile.isSpecial && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/20 to-transparent"></div>
              )}
              <div className={`w-12 h-12 rounded-full ${tile.color} flex items-center justify-center relative z-10`}>
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: tile.isSpecial ? "'FILL' 1" : undefined }}>
                  {tile.icon}
                </span>
              </div>
              <div className="mt-auto relative z-10">
                <h3 className="font-title-md text-title-md text-on-background font-bold leading-tight">
                  {t(tile.title)}
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 text-xs">
                  {tile.id === 'expenses' ? t('expenseSub') : t(tile.desc)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardScreen;
