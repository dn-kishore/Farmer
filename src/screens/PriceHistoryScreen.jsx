import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const PriceHistoryScreen = () => {
  const { language } = useApp();
  const [tab, setTab] = useState('fertilizer'); // 'fertilizer' or 'crop'
  const [playingId, setPlayingId] = useState(null);

  const isTel = language === 'te';

  const speakText = (text, id) => {
    if ('speechSynthesis' in window) {
      if (playingId === id) {
        window.speechSynthesis.cancel();
        setPlayingId(null);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isTel ? 'te-IN' : 'en-US';
        utterance.onend = () => setPlayingId(null);
        setPlayingId(id);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const chartData = {
    fertilizer: {
      title: isTel ? 'యూరియా 50కిలోల బ్యాగ్' : 'Urea 50kg Bag',
      price: '₹1,250',
      change: '+5.2%',
      points: "M 5,80 L 23,75 L 41,85 L 59,50 L 77,60 L 95,20",
      fillPoints: "M 5,80 L 23,75 L 41,85 L 59,50 L 77,60 L 95,20 L 95,100 L 5,100 Z",
      coords: [{x: 5, y: 80}, {x: 23, y: 75}, {x: 41, y: 85}, {x: 59, y: 50}, {x: 77, y: 60}, {x: 95, y: 20}],
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      items: [
        {
          id: 1,
          name: isTel ? 'యూరియా ఎరువు' : 'Urea Fertilizer',
          spec: isTel ? '50కిలోల బ్యాగ్ • సాధారణ ధర' : '50kg Bag • Standard',
          price: '₹1,250',
          change: '+₹45',
          isUp: true,
          insight: isTel 
            ? 'ఖరీఫ్ సీజన్ వస్తున్నందున వచ్చే వారం ధరలు పెరిగే అవకాశం ఉంది. ఇప్పుడే నిల్వ చేసుకోండి.' 
            : 'Price likely to rise next week due to approaching sowing season. Consider stocking up now.'
        },
        {
          id: 2,
          name: 'NPK 19:19:19',
          spec: isTel ? '50కిలోల బ్యాగ్ • కాంప్లెక్స్' : '50kg Bag • Complex',
          price: '₹1,480',
          change: '-₹15',
          isUp: false,
          insight: isTel 
            ? 'మార్కెట్ స్థిరంగా ఉంది. ప్రస్తుత ధరలు గడిచిన 3 నెలల సగటు కంటే తక్కువగా ఉన్నాయి.' 
            : 'Market stable. Current prices are favorable compared to the 3-month average.'
        }
      ]
    },
    crop: {
      title: isTel ? 'మిర్చి (గుంటూరు తేజ)' : 'Chilli (Guntur Teja)',
      price: '₹18,500/Qtl',
      change: '+8.4%',
      points: "M 5,90 L 23,80 L 41,65 L 59,70 L 77,45 L 95,10",
      fillPoints: "M 5,90 L 23,80 L 41,65 L 59,70 L 77,45 L 95,10 L 95,100 L 5,100 Z",
      coords: [{x: 5, y: 90}, {x: 23, y: 80}, {x: 41, y: 65}, {x: 59, y: 70}, {x: 77, y: 45}, {x: 95, y: 10}],
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      items: [
        {
          id: 3,
          name: isTel ? 'తేజ మిర్చి (మొదటి రకం)' : 'Teja Chilli (Grade A)',
          spec: isTel ? 'క్వింటాల్ • గుంటూరు మార్కెట్' : 'Quintal • Guntur Mandi',
          price: '₹18,500',
          change: '+₹1,400',
          isUp: true,
          insight: isTel 
            ? 'ఎగుమతి డిమాండ్ పెరగడం వల్ల ధరలలో మరింత పెరుగుదల ఉండవచ్చు.' 
            : 'Strong export demand suggests further price gains. High grade chilli prices will remain bullish.'
        },
        {
          id: 4,
          name: isTel ? 'వరి (సన్న రకాలు)' : 'Paddy (Fine Rice)',
          spec: isTel ? 'క్వింటాల్ • గుంటూరు మార్కెట్' : 'Quintal • Guntur Mandi',
          price: '₹2,180',
          change: '+₹60',
          isUp: true,
          insight: isTel 
            ? 'ప్రభుత్వ కనీస మద్దతు ధరల కొనుగోలు వల్ల మార్కెట్ లో స్థిరత్వం ఉంది.' 
            : 'Stable demand backed by MSP procurement. Prices expected to hold current levels.'
        }
      ]
    }
  };

  const activeData = chartData[tab];

  return (
    <div className="flex-grow flex flex-col pb-24 p-md">
      <div className="mb-4">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">
          {isTel ? 'మార్కెట్ ధరలు & ట్రెండ్స్' : 'Market Price Trends'}
        </h2>
        <p className="font-body-md text-xs text-on-surface-variant">
          {isTel ? 'నిజ సమయ మార్కెట్ ధరలు మరియు స్మార్ట్ విశ్లేషణ.' : 'Real-time mandi prices and smart market insights.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('fertilizer')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            tab === 'fertilizer' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {isTel ? 'వ్యవసాయ సామాగ్రి' : 'Fertilizers / Inputs'}
        </button>
        <button
          onClick={() => setTab('crop')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            tab === 'crop' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {isTel ? 'మార్కెట్ పంటల ధరలు' : 'Crop Mandi Prices'}
        </button>
      </div>

      {/* SVG Chart Card */}
      <section className="bg-white/70 backdrop-blur-md border border-outline-variant/30 rounded-2xl p-4 shadow-sm relative overflow-hidden mb-4">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="font-bold text-sm text-on-surface">{activeData.title}</h3>
            <p className="text-[10px] text-on-surface-variant font-medium">{isTel ? '6 నెలల ధరల విశ్లేషణ' : '6-Month Price Trend'}</p>
          </div>
          <div className="text-right">
            <span className="block font-bold text-lg text-primary">{activeData.price}</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded-full mt-0.5">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> {activeData.change}
            </span>
          </div>
        </div>

        {/* SVG Chart area */}
        <div className="h-36 w-full relative mt-2 border-b border-outline-variant/30 border-l border-outline-variant/30 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0d631b" stopOpacity="0.25"></stop>
                <stop offset="100%" stopColor="#0d631b" stopOpacity="0"></stop>
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#bfcaba" strokeDasharray="3" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#bfcaba" strokeDasharray="3" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#bfcaba" strokeDasharray="3" strokeWidth="0.5" />
            
            <line x1="23" y1="0" x2="23" y2="100" stroke="#bfcaba" strokeDasharray="3" strokeWidth="0.5" />
            <line x1="41" y1="0" x2="41" y2="100" stroke="#bfcaba" strokeDasharray="3" strokeWidth="0.5" />
            <line x1="59" y1="0" x2="59" y2="100" stroke="#bfcaba" strokeDasharray="3" strokeWidth="0.5" />
            <line x1="77" y1="0" x2="77" y2="100" stroke="#bfcaba" strokeDasharray="3" strokeWidth="0.5" />

            <path d={activeData.fillPoints} fill="url(#chartGrad)"></path>
            <path d={activeData.points} fill="none" stroke="#0d631b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
            
            {/* Draw circles exactly on matching trend line node coordinates */}
            {activeData.coords.map((pt, idx) => (
              <circle key={idx} cx={pt.x} cy={pt.y} fill={idx === 5 ? "#0d631b" : "#ffffff"} r="3.5" stroke="#0d631b" strokeWidth="2"></circle>
            ))}
          </svg>
        </div>

        {/* Axis Labels */}
        <div className="flex justify-between mt-2 px-1 text-[9px] font-bold text-on-surface-variant tracking-wider">
          {activeData.labels.map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
        </div>
      </section>

      {/* Tracked Items list */}
      <section className="space-y-3">
        <h3 className="font-bold text-xs text-on-surface uppercase tracking-wider mb-1">
          {isTel ? 'ట్రాక్ చేసిన వస్తువులు' : 'Tracked Items'}
        </h3>
        
        {activeData.items.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-xl p-3 shadow-sm border border-outline-variant/20 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-2 items-center">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">
                    {item.id === 1 ? 'science' : item.id === 2 ? 'compost' : item.id === 3 ? 'pest_control' : 'agriculture'}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">{item.name}</h4>
                  <p className="text-[10px] text-on-surface-variant">{item.spec}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-sm text-on-surface">{item.price}</span>
                <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 ${
                  item.isUp ? 'text-error bg-error-container/20' : 'text-primary bg-primary-container/20'
                }`}>
                  <span className="material-symbols-outlined text-[10px]">
                    {item.isUp ? 'trending_up' : 'trending_down'}
                  </span>
                  {item.change}
                </span>
              </div>
            </div>

            {/* AI Advice block */}
            <div className="bg-surface-container-low rounded-lg p-2.5 flex gap-2 items-start border border-primary/5">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 fill">psychology</span>
              <p className="text-[11px] leading-relaxed text-on-surface-variant flex-1">{item.insight}</p>
              
              {/* Speaker Button (tts) */}
              <button 
                onClick={() => speakText(item.insight, item.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  playingId === item.id ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {playingId === item.id ? 'volume_mute' : 'volume_up'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PriceHistoryScreen;
