import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ttsService from '../services/ttsService';

const SafetyGuideScreen = () => {
  const { language, navigateTo } = useApp();
  const [playingId, setPlayingId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const isTel = language === 'te';

  const speakText = async (text, id) => {
    if (playingId === id) {
      ttsService.cancel();
      setPlayingId(null);
      return;
    }

    setLoadingId(id);
    const lang = isTel ? 'te' : 'en';
    
    try {
      await ttsService.speak(
        text,
        lang,
        id,
        () => setPlayingId(null),
        (error) => {
          console.error("TTS error:", error);
          setPlayingId(null);
          setLoadingId(null);
        }
      );
      
      setLoadingId(null);
      if (ttsService.getCurrentId() === id) {
        setPlayingId(id);
      } else {
        setPlayingId(null);
      }
    } catch (error) {
      console.error("Failed to speak text:", error);
      setPlayingId(null);
      setLoadingId(null);
    }
  };

  const guidelines = [
    {
      id: 1,
      icon: 'front_hand',
      color: 'bg-primary-container/20 text-primary',
      title: isTel ? 'రక్షణ చేతి తొడుగులు ధరించండి' : 'Wear Protective Gloves',
      text: isTel 
        ? 'చేతులకు నేరుగా రసాయనాలు అంటకుండా ఉండేందుకు ఎల్లప్పుడూ మందపాటి రబ్బరు గ్లోవ్స్ ధరించండి.'
        : 'Always wear heavy-duty rubber or nitrile gloves to prevent direct skin contact with corrosive granules.'
    },
    {
      id: 2,
      icon: 'masks',
      color: 'bg-secondary-container/20 text-secondary',
      title: isTel ? 'N95 మాస్క్ వాడండి' : 'Use an N95 Mask',
      text: isTel 
        ? 'రసాయన దుమ్ము మరియు ఆవిరి పీల్చకుండా ఉండటానికి మీ ముక్కు మరియు నోటికి మాస్క్ సరిగ్గా అమర్చుకోండి.'
        : 'Inhale protection is critical. Ensure your mask fits snugly to avoid breathing in harmful chemical dust.'
    },
    {
      id: 3,
      icon: 'wash',
      color: 'bg-tertiary-container/20 text-tertiary',
      title: isTel ? 'చేతులు శుభ్రంగా కడగాలి' : 'Wash Hands Thoroughly',
      text: isTel 
        ? 'పని ముగిసిన వెంటనే చేతులను, చర్మాన్ని సబ్బు మరియు శుభ్రమైన నీటితో కడుక్కోవాలి.'
        : 'Immediately wash hands and exposed skin with soap and clean water after finishing application.'
    },
    {
      id: 4,
      icon: 'visibility',
      color: 'bg-surface-variant text-on-surface-variant',
      title: isTel ? 'కళ్ల రక్షణ కళ్లద్దాలు' : 'Eye Protection',
      text: isTel 
        ? 'రసాయన ధూళి కళ్లల్లో పడకుండా రక్షణ కళ్లద్దాలు ధరించండి. ఇది కంటి దెబ్బతినకుండా కాపాడుతుంది.'
        : 'Wear safety goggles. Dust or splashing liquids can cause severe irritation or permanent eye damage.'
    }
  ];

  const aiAdvice = isTel 
    ? 'ప్రస్తుత గాలి వేగం గంటకు 15 కి.మీ. రసాయన దుమ్ము గాల్లో కొట్టుకుపోకుండా ఉండటానికి గుళికలను నేలకు దగ్గరగా వేయండి.'
    : 'Current wind speed is 15 km/h. It is advised to apply granules close to the soil to prevent drift.';

  return (
    <div className="flex-grow flex flex-col pb-24 p-md">
      {/* Top Header Card */}
      <div className="mb-6 text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center mb-3 text-error">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2 font-bold">
          {isTel ? 'ఎరువుల భద్రతా గైడ్' : 'Fertilizer Safety Guide'}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px]">
          {isTel 
            ? 'యూరియా మరియు ఇతర మిశ్రమాలను వాడే ముందు ఈ నియమాలను తప్పక అనుసరించండి.' 
            : 'Please follow these mandatory safety protocols before handling Urea and NPK blends.'}
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {guidelines.map((g) => (
          <div 
            key={g.id}
            className="bg-white/70 backdrop-blur-md rounded-xl p-4 flex flex-col gap-3 border border-outline-variant/35 shadow-sm"
          >
            <div className="flex justify-between items-center w-full">
              <div className={`w-10 h-10 rounded-lg ${g.color} flex items-center justify-center`}>
                <span className="material-symbols-outlined text-lg">{g.icon}</span>
              </div>
              <button 
                onClick={() => speakText(g.text, g.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  playingId === g.id ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {loadingId === g.id ? (
                  <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">
                    {playingId === g.id ? 'volume_mute' : 'volume_up'}
                  </span>
                )}
              </button>
            </div>
            <div>
              <h3 className="font-bold text-xs text-on-surface mb-1">{g.title}</h3>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">{g.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Recommendation banner */}
      <div className="bg-surface-container-low rounded-xl p-4 flex gap-3 items-start border border-primary/20 shadow-sm mb-4">
        <span className="material-symbols-outlined text-primary text-xl mt-0.5 fill">tips_and_updates</span>
        <div className="flex-grow">
          <h4 className="font-bold text-xs text-on-surface mb-1">{isTel ? 'AI సిఫార్సు' : 'AI Recommendation'}</h4>
          <p className="text-[10px] text-on-surface-variant leading-relaxed">{aiAdvice}</p>
        </div>
        <button 
          onClick={() => speakText(aiAdvice, 99)}
          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
            playingId === 99 ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'
          }`}
        >
          {loadingId === 99 ? (
            <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <span className="material-symbols-outlined text-[16px]">
              {playingId === 99 ? 'volume_mute' : 'volume_up'}
            </span>
          )}
        </button>
      </div>

      {/* Bottom Proceed Action */}
      <button 
        onClick={() => navigateTo('dashboard')}
        className="w-full h-12 bg-gradient-to-b from-primary to-[#157a24] text-white rounded-xl font-bold text-title-md text-title-md flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all mt-2"
      >
        {isTel ? 'నేను అర్థం చేసుకున్నాను మరియు కొనసాగుతాను' : 'I Understand & Proceed'}
        <span className="material-symbols-outlined text-[18px]">check_circle</span>
      </button>
    </div>
  );
};

export default SafetyGuideScreen;
