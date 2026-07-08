import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const LoginScreen = () => {
  const { navigateTo, language, setLanguage, t } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setErrorMsg(t('phone') + ' and ' + t('password') + ' are required.');
      return;
    }
    localStorage.setItem('isLoggedIn', 'true');
    navigateTo('dashboard');
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-md min-h-full relative overflow-hidden bg-[#fafaf4]">
      
      {/* Drifting glowing ambient orbs (extremely soft for light theme) */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-amber-400/10 rounded-full blur-[80px] animate-pulse [animation-duration:8s]"></div>
      <div className="absolute bottom-[-10%] left-[-15%] w-80 h-80 bg-green-300/15 rounded-full blur-[100px] animate-pulse [animation-duration:10s]"></div>

      {/* Floating Language Bar */}
      <div className="absolute top-4 right-4 z-20">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 hover:bg-surface-container-high transition-all text-xs font-bold text-primary shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">language</span>
          {language === 'en' ? 'తెలుగు' : 'English'}
        </button>
      </div>

      {/* Logo & Headline Container */}
      <div className="mb-6 flex flex-col items-center text-center z-10 animate-in fade-in slide-in-from-top duration-500">
        <div className="w-16 h-16 bg-primary/10 rounded-[22px] flex items-center justify-center mb-3 shadow-md border border-primary/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
          <span className="material-symbols-outlined text-primary text-[34px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
        </div>
        <h1 className="font-headline-lg-mobile text-[30px] text-primary tracking-tight font-extrabold drop-shadow-sm">
          {t('appName')}
        </h1>
        <p className="text-xs text-on-surface-variant mt-1 max-w-[260px] font-medium tracking-wide">
          {t('tagline')}
        </p>
      </div>

      {/* Solid White Premium Login Card */}
      <div className="w-full max-w-[340px] bg-white rounded-[28px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-outline-variant/35 z-10 relative overflow-hidden animate-in fade-in zoom-in duration-500">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          
          {errorMsg && (
            <div className="p-3 bg-error-container text-on-error-container text-xs rounded-xl font-medium animate-shake">
              {errorMsg}
            </div>
          )}

          {/* Phone Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider" htmlFor="phone">
              {t('phone')}
            </label>
            <div className="relative group/input">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within/input:text-primary transition-colors">call</span>
              <input
                className="w-full h-[52px] pl-[46px] pr-4 rounded-xl bg-surface-container border border-transparent focus:bg-white focus:border-primary focus:ring-0 text-xs font-semibold text-on-background placeholder:text-outline transition-all outline-none"
                id="phone"
                placeholder="Enter registered number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant ml-1 uppercase tracking-wider" htmlFor="password">
              {t('password')}
            </label>
            <div className="relative group/input">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within/input:text-primary transition-colors">lock</span>
              <input
                className="w-full h-[52px] pl-[46px] pr-4 rounded-xl bg-surface-container border border-transparent focus:bg-white focus:border-primary focus:ring-0 text-xs font-semibold text-on-background placeholder:text-outline transition-all outline-none"
                id="password"
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="w-full h-[52px] mt-2 rounded-xl bg-gradient-to-b from-primary to-[#0a5215] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(13,99,27,0.2)] hover:shadow-[0_6px_16px_rgba(13,99,27,0.3)] active:scale-95 transition-all duration-200"
            type="submit"
          >
            {t('login')}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>
      </div>

      <div className="mt-6 text-center pb-6 z-10">
        <a className="text-[11px] font-bold text-outline hover:text-primary transition-colors tracking-wide underline" href="#">
          {t('forgot')}
        </a>
      </div>
    </div>
  );
};

export default LoginScreen;
