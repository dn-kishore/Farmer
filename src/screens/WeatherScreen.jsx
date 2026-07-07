import React from 'react';
import { useApp } from '../context/AppContext';

const WeatherScreen = () => {
  const { language, t } = useApp();

  const isTel = language === 'te';

  const metrics = [
    { label: isTel ? 'తేమ' : 'Humidity', val: '72%', icon: 'humidity_percentage', color: 'text-secondary bg-secondary-container/20' },
    { label: isTel ? 'గాలి వేగం' : 'Wind Speed', val: '12 km/h', icon: 'air', color: 'text-primary bg-primary-container/20' },
    { label: isTel ? 'యూవీ ఇండెక్స్' : 'UV Index', val: isTel ? 'మధ్యస్థం' : 'Moderate', icon: 'light_mode', color: 'text-tertiary bg-tertiary-container/20' },
    { label: isTel ? 'నేల ఉష్ణోగ్రత' : 'Soil Temp', val: '18°C', icon: 'thermostat', color: 'text-secondary bg-secondary-fixed-dim/20' }
  ];

  const outlook = [
    { day: isTel ? 'రేపు' : 'Tomorrow', weather: isTel ? 'తేలికపాటి వర్షం' : 'Light Rain', icon: 'rainy', temp: '22° / 16°', primary: true },
    { day: isTel ? 'బుధవారం, అక్టో 25' : 'Wed, Oct 25', weather: isTel ? 'పాక్షికంగా మేఘావృతం' : 'Partly Cloudy', icon: 'partly_cloudy_day', temp: '25° / 18°' },
    { day: isTel ? 'గురువారం, అక్టో 26' : 'Thu, Oct 26', weather: isTel ? 'ఎండగా ఉంటుంది' : 'Sunny', icon: 'clear_day', temp: '27° / 19°' },
    { day: isTel ? 'శుక్రవారం, అక్టో 27' : 'Fri, Oct 27', weather: isTel ? 'ఎండగా ఉంటుంది' : 'Sunny', icon: 'clear_day', temp: '28° / 20°' }
  ];

  return (
    <div className="flex-grow flex flex-col pb-24 p-md">
      <div className="space-y-md">
        {/* AI Insight Card */}
        <section className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-lg shadow-sm relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-start justify-between relative z-10 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                <span className="font-label-md text-label-md text-primary tracking-wide uppercase font-bold">
                  {isTel ? 'AI పంట సమాచారం' : 'AI Field Insight'}
                </span>
              </div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2 font-bold leading-tight">
                {isTel ? 'ఎరువులు చల్లడానికి అనుకూల సమయం' : 'Optimal Conditions for Top Dressing'}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                {isTel 
                  ? 'ప్రస్తుత నేల తేమ 68% ఉంది మరియు 6 గంటల్లో తేలికపాటి వర్షం పడే అవకాశం ఉంది. ఇది ఎరువులు వేయడానికి అనుకూలమైన సమయం.'
                  : 'Current soil moisture is 68% and light rain is forecasted in 6 hours. This creates an ideal window for applying nitrogen-based fertilizers.'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-gradient-to-b from-primary to-[#157a24] text-white font-semibold text-xs px-4 py-2.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-xs">schedule</span>
              {isTel ? 'షెడ్యూల్ చేయండి' : 'Schedule'}
            </button>
            <button className="bg-surface-container font-semibold text-xs px-4 py-2.5 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors">
              {isTel ? 'నేల తేమ డేటా' : 'Soil Data'}
            </button>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="grid grid-cols-2 gap-3">
          {metrics.map((m, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-outline-variant/25 flex flex-col items-start">
              <div className={`w-10 h-10 rounded-full ${m.color} flex items-center justify-center mb-2`}>
                <span className="material-symbols-outlined text-xl">{m.icon}</span>
              </div>
              <span className="font-label-sm text-xs text-on-surface-variant mb-1 font-medium">{m.label}</span>
              <span className="font-title-md text-lg text-on-surface font-bold">{m.val}</span>
            </div>
          ))}
        </section>

        {/* Outlook */}
        <section className="space-y-3">
          <h3 className="font-title-md text-md text-on-surface font-bold border-b border-outline-variant/30 pb-2">
            {isTel ? '4 రోజుల వాతావరణ సూచన' : '4-Day Outlook'}
          </h3>
          <div className="space-y-2">
            {outlook.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-outline-variant/25">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-2xl ${item.primary ? 'text-primary' : 'text-secondary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                  <div>
                    <div className="font-label-md text-sm text-on-surface font-semibold">{item.day}</div>
                    <div className="font-label-sm text-xs text-on-surface-variant">{item.weather}</div>
                  </div>
                </div>
                <div className="font-title-md text-sm text-on-surface font-bold">{item.temp}</div>
              </div>
            ))}
          </div>
          
          <div className="p-3.5 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex gap-2 items-start mt-2">
            <span className="material-symbols-outlined text-secondary-container shrink-0 text-[18px]">info</span>
            <p className="font-label-sm text-xs text-on-surface-variant leading-relaxed">
              {isTel 
                ? 'ఈ సమాచారం మీ ప్రాథమిక ఫీల్డ్ సెక్టార్ (ఉత్తర బ్లాక్) కు పరిమితం చేయబడింది.' 
                : 'Forecasts are localized to your primary field sector (North Block).'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WeatherScreen;
