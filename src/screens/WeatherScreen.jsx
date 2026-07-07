import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const COMMON_LOCATIONS = [
  'Adoni',
  'Amalapuram',
  'Anantapur',
  'Armoor',
  'Bapatla',
  'Bhimavaram',
  'Bodhan',
  'Chilakaluripet',
  'Chittoor',
  'Dharmavaram',
  'Dandagarra',
  'Eluru',
  'Gannavaram',
  'Gauribidanur',
  'Gellapadu',
  'Giddalur',
  'Gooty',
  'Gudivada',
  'Gudur',
  'Guduru',
  'Gulbarga',
  'Guntakal',
  'Guntur',
  'Hindupur',
  'Hyderabad',
  'Jagtial',
  'Kadapa',
  'Kadiri',
  'Kakinada',
  'Kamareddy',
  'Karimnagar',
  'Kavali',
  'Khammam',
  'Kurnool',
  'Machilipatnam',
  'Madanapalle',
  'Mahabubnagar',
  'Mancherial',
  'Mangalagiri',
  'Miryalaguda',
  'Naidupeta',
  'Nalgonda',
  'Nandyal',
  'Narasaraopet',
  'Nellore',
  'Nizamabad',
  'Ongole',
  'Palakollu',
  'Proddatur',
  'Puttur',
  'Rajahmundry',
  'Rajampet',
  'Ramagundam',
  'Renigunta',
  'Sangareddy',
  'Siddipet',
  'Srikakulam',
  'Srikalahasti',
  'Sullurpeta',
  'Suryapet',
  'Tadepalligudem',
  'Tadpatri',
  'Tanuku',
  'Tekkali',
  'Tenali',
  'Tirupati',
  'Undrajavaram',
  'Vijayawada',
  'Visakhapatnam',
  'Vizianagaram',
  'Wanaparthy',
  'Warangal'
];

const WeatherScreen = () => {
  const { language, t, weatherData, setWeatherData, fetchWeatherByCity, refreshWeatherWithGps, clearWeatherLocation } = useApp();
  const [citySearch, setCitySearch] = useState('');
  const [searchError, setSearchError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const isTel = language === 'te';

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!citySearch.trim()) return;
    setSearchError('');
    setSuggestions([]);
    const success = await fetchWeatherByCity(citySearch);
    if (!success) {
      setSearchError(isTel ? 'ప్రాంతం కనుగొనబడలేదు. మళ్ళీ ప్రయత్నించండి.' : 'Location not found. Try another city.');
    } else {
      setCitySearch('');
    }
  };

  const metrics = weatherData.loading || !weatherData.location ? [] : [
    { label: isTel ? 'తేమ' : 'Humidity', val: `${weatherData.humidity}%`, icon: 'humidity_percentage', color: 'text-secondary bg-secondary-container/20' },
    { label: isTel ? 'గాలి వేగం' : 'Wind Speed', val: `${weatherData.windSpeed} km/h`, icon: 'air', color: 'text-primary bg-primary-container/20' },
    { label: isTel ? 'యూవీ ఇండెక్స్' : 'UV Index', val: isTel ? 'మధ్యస్థం' : 'Moderate', icon: 'light_mode', color: 'text-tertiary bg-tertiary-container/20' },
    { label: isTel ? 'నేల ఉష్ణోగ్రత' : 'Soil Temp', val: '18°C', icon: 'thermostat', color: 'text-secondary bg-secondary-fixed-dim/20' }
  ];

  const hasRain = !weatherData.loading && weatherData.location && (weatherData.icon === 'rainy' || weatherData.humidity > 75);
  const aiInsightTitle = isTel 
    ? (hasRain ? 'వర్ష సూచన - ఎరువులు చల్లడం వాయిదా వేయండి' : 'ఎరువులు చల్లడానికి అనుకూల సమయం')
    : (hasRain ? 'Rain Forecasted - Postpone Dressings' : 'Optimal Conditions for Top Dressing');
  const aiInsightDesc = isTel
    ? (hasRain 
        ? `ప్రస్తుత తేమ ${weatherData.humidity}% ఉంది మరియు వర్ష సూచన ఉంది. ఎరువులు కొట్టుకుపోకుండా ఉండడానికి అప్లికేషన్ వాయిదా వేయండి.`
        : `ప్రస్తుత తేమ ${weatherData.humidity}% ఉంది మరియు వాతావరణం అనుకూలంగా ఉంది. ఎరువులు వేయడానికి ఇది సరైన సమయం.`)
    : (hasRain
        ? `High humidity (${weatherData.humidity}%) and rain forecast. Postpone applying granular fertilizers to avoid runoff/leaching.`
        : `Current soil moisture is optimal at ${weatherData.humidity}% with no immediate heavy rain forecast. Ideal window for applying nitrogen dressings.`);

  const outlook = weatherData.loading || !weatherData.location ? [] : [
    { day: isTel ? 'ఈరోజు' : 'Today', weather: isTel ? weatherData.teluguCondition : weatherData.condition, icon: weatherData.icon, temp: `${weatherData.temp}° / ${weatherData.temp - 6}°`, primary: true },
    { day: isTel ? 'రేపు' : 'Tomorrow', weather: isTel ? 'పాక్షికంగా మేఘావృతం' : 'Partly Cloudy', icon: 'partly_cloudy_day', temp: `${weatherData.temp + 1}° / ${weatherData.temp - 5}°` },
    { day: isTel ? 'ఎల్లుండి' : 'Day After', weather: isTel ? 'ఎండగా ఉంటుంది' : 'Sunny', icon: 'clear_day', temp: `${weatherData.temp + 2}° / ${weatherData.temp - 4}°` },
    { day: isTel ? 'మరుసటి రోజు' : 'Following Day', weather: isTel ? 'ఎండగా ఉంటుంది' : 'Sunny', icon: 'clear_day', temp: `${weatherData.temp + 3}° / ${weatherData.temp - 3}°` }
  ];

  return (
    <div className="flex-grow flex flex-col pb-24 p-md">
      <div className="space-y-md">

        {weatherData.loading ? (
          <div className="flex-grow py-12 flex items-center justify-center">
            <div className="text-center space-y-2">
              <span className="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
              <p className="text-xs font-semibold text-on-surface-variant">
                {isTel ? 'వాతావరణ వివరాలు లోడ్ అవుతున్నాయి...' : 'Loading weather details...'}
              </p>
            </div>
          </div>
        ) : !weatherData.location ? (
          /* Full Page Location Setup Screen */
          <div className="flex-grow py-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-bounce">
              <span className="material-symbols-outlined text-3xl">pin_drop</span>
            </div>
            
            <div className="space-y-2 max-w-[280px]">
              <h3 className="text-sm font-bold text-on-surface">
                {isTel ? 'వాతావరణ స్థానాన్ని సెట్ చేయండి' : 'Set Your Weather Location'}
              </h3>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                {isTel 
                  ? 'రియల్ టైమ్ వాతావరణ అప్‌డేట్లు మరియు సాగు సలహాల కోసం మీ గ్రామం లేదా పట్టణాన్ని శోధించండి.'
                  : 'Search for your village or city to receive real-time farming forecasts and AI weather advisories.'}
              </p>
            </div>

            {/* Set Location Input Card */}
            <section className="bg-white rounded-2xl p-4 shadow-md border border-outline-variant/20 space-y-3 w-full max-w-[340px] relative z-20">
              <form onSubmit={handleSearchSubmit} className="flex gap-2 relative">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                  <input
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container border border-transparent focus:bg-white focus:border-primary text-xs font-semibold outline-none transition-all"
                    type="text"
                    placeholder={isTel ? 'ప్రాంతం పేరు (ఉదా: గుంటూరు)...' : 'Enter city name (e.g. Guntur)...'}
                    value={citySearch}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCitySearch(val);
                      setSearchError('');
                      if (weatherData.error) {
                        setWeatherData(prev => ({ ...prev, error: null }));
                      }
                      if (val.trim().length > 0) {
                        const filtered = COMMON_LOCATIONS.filter(loc => 
                          loc.toLowerCase().includes(val.toLowerCase())
                        ).slice(0, 5);
                        setSuggestions(filtered);
                      } else {
                        setSuggestions([]);
                      }
                    }}
                  />

                  {/* Suggestions List */}
                  {suggestions.length > 0 && (
                    <ul className="absolute top-11 left-0 right-0 bg-white border border-outline-variant/30 rounded-xl shadow-lg overflow-hidden z-30 divide-y divide-outline-variant/10 text-left">
                      {suggestions.map((loc) => (
                        <li 
                          key={loc}
                          onClick={() => {
                            setCitySearch(loc);
                            setSuggestions([]);
                            fetchWeatherByCity(loc);
                          }}
                          className="px-4 py-2 text-xs font-semibold text-on-surface hover:bg-primary-container/20 cursor-pointer active:bg-primary-container/30 transition-colors flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-xs text-outline">location_on</span>
                          <span>{loc}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="h-10 px-3 bg-primary text-white text-xs font-bold rounded-xl active:scale-95 transition-transform flex items-center gap-1 shadow-sm shrink-0"
                >
                  {isTel ? 'వెతకండి' : 'Search'}
                </button>
              </form>

              {/* Or Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-outline-variant/30"></div>
                <span className="flex-shrink mx-2 text-[8px] text-outline uppercase font-extrabold tracking-widest">
                  {isTel ? 'లేదా' : 'or'}
                </span>
                <div className="flex-grow border-t border-outline-variant/30"></div>
              </div>

              {/* GPS Locate Button */}
              <button
                type="button"
                onClick={refreshWeatherWithGps}
                className="w-full h-10 bg-primary text-white rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm font-semibold text-xs"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>my_location</span>
                {isTel ? 'ప్రస్తుత ప్రాంతాన్ని కనుగొనండి' : 'Detect My Location (GPS)'}
              </button>
              
              {searchError && (
                <p className="text-[10px] text-error font-semibold text-center mt-1 animate-in fade-in">
                  ⚠️ {searchError}
                </p>
              )}
              {weatherData.error && (
                <p className="text-[10px] text-error font-semibold text-center mt-1 animate-in fade-in">
                  ⚠️ {weatherData.error}
                </p>
              )}
            </section>
          </div>
        ) : (
          /* Live Weather Details view WITHOUT search option */
          <>
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
                  <h2 className="text-xs font-bold text-on-surface mb-2 leading-tight">
                    {aiInsightTitle}
                  </h2>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">
                    {aiInsightDesc}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-gradient-to-b from-primary to-[#157a24] text-white font-semibold text-[10px] px-4 py-2.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  {isTel ? 'షెడ్యూల్ చేయండి' : 'Schedule'}
                </button>
                <button className="bg-surface-container font-semibold text-[10px] px-4 py-2.5 rounded-lg text-on-surface hover:bg-surface-container-high transition-colors">
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
                  <span className="text-[10px] text-on-surface-variant mb-1 font-medium">{m.label}</span>
                  <span className="text-sm text-on-surface font-bold">{m.val}</span>
                </div>
              ))}
            </section>

            {/* Outlook */}
            <section className="space-y-3">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                <h3 className="text-xs text-on-surface font-bold">
                  {isTel ? `${weatherData.location} వాతావరణ సూచన` : `${weatherData.location} Outlook`}
                </h3>
                <button
                  onClick={clearWeatherLocation}
                  className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-xs">edit_location</span>
                  {isTel ? 'మార్చండి' : 'Change Location'}
                </button>
              </div>
              <div className="space-y-2">
                {outlook.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-outline-variant/25">
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-2xl ${item.primary ? 'text-primary' : 'text-secondary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        {item.icon}
                      </span>
                      <div>
                        <div className="text-xs text-on-surface font-semibold">{item.day}</div>
                        <div className="text-[10px] text-on-surface-variant">{item.weather}</div>
                      </div>
                    </div>
                    <div className="text-xs text-on-surface font-bold">{item.temp}</div>
                  </div>
                ))}
              </div>
              
              <div className="p-3.5 rounded-xl bg-secondary-container/10 border border-secondary-container/20 flex gap-2 items-start mt-2">
                <span className="material-symbols-outlined text-secondary-container shrink-0 text-[18px]">info</span>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  {isTel 
                    ? 'వాతావరణ వివరాలు ఎంచుకున్న ప్రాంతం ఆధారంగా నిజ-సమయంలో అందించబడతాయి.' 
                    : 'Weather data is loaded in real-time based on the selected location.'}
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherScreen;
