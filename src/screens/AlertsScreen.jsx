import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AlertsScreen = () => {
  const { language, navigateTo } = useApp();
  const [playingId, setPlayingId] = useState(null);

  const isTel = language === 'te';

  const alerts = [
    {
      id: 1,
      type: 'urgent',
      time: '10:45 AM',
      title: isTel ? 'భారీ వర్షపాతం హెచ్చరిక' : 'Heavy Rainfall Expected',
      text: isTel 
        ? 'రాబోయే 2 గంటల్లో భారీ వర్షం పడే అవకాశం ఉంది. నీరు నిల్వ ఉండకుండా సెల్టర్ ఏ లో డ్రైనేజీ వ్యవస్థలను సరిచేసుకోండి.'
        : 'High probability of heavy rain (40mm+) in the next 2 hours. Ensure drainage systems in Field Sector A are clear.',
      icon: 'thunderstorm',
      color: 'border-l-error bg-error-container/10 text-error',
      badge: isTel ? 'అత్యవసరం' : 'Urgent',
      actionText: isTel ? 'వాతావరణ మ్యాప్ చూడండి' : 'View weather map',
      action: () => navigateTo('weather')
    },
    {
      id: 2,
      type: 'insight',
      time: '08:15 AM',
      title: isTel ? 'పురుగుమందుల పిచికారీకి అనుకూల సమయం' : 'Optimal Spraying Window',
      text: isTel
        ? 'ప్రస్తుత గాలి వేగం (5km/h) మరియు తేమ (70%) టమోటా పంటపై పురుగుమందుల పిచికారీ చేయడానికి అనువైనది. 11:30 కు ముగుస్తుంది.'
        : 'Current wind speed (5km/h) and humidity (70%) create ideal conditions for pesticide application. Window closes at 11:30 AM.',
      icon: 'psychology',
      color: 'border-l-primary bg-primary-container/10 text-primary',
      badge: isTel ? 'AI పంట సమాచారం' : 'AI Insight',
      actionText: isTel ? 'ప్రక్రియ ప్రారంభించండి' : 'Start task',
      action: () => navigateTo('safety_guide')
    },
    {
      id: 3,
      type: 'caution',
      time: '06:00 AM',
      title: isTel ? 'పురుగుల ఉధృతి గుర్తింపు' : 'Pest Activity Detected',
      text: isTel
        ? 'డ్రోన్ చిత్రాల విశ్లేషణ ప్రకారం సెంటర్ సి లో 15% అఫిడ్స్ క్రియాశీలత పెరిగింది. వెంటనే చర్యలు అవసరం.'
        : 'Drone imagery analysis indicates a 15% increase in aphid activity in Sector C. Early intervention recommended.',
      icon: 'pest_control',
      color: 'border-l-[#f5a623] bg-[#f5a623]/10 text-[#835500]',
      badge: isTel ? 'హెచ్చరిక' : 'Caution',
      actionText: isTel ? 'నివారణ పద్ధతులు చూడండి' : 'View treatments',
      action: () => navigateTo('crop_diagnosis')
    }
  ];

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
    } else {
      alert("TTS not supported in this browser");
    }
  };

  return (
    <div className="flex-grow flex flex-col pb-24 p-md">
      <div className="mb-4">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">
          {isTel ? 'హెచ్చరికలు & నోటిఫికేషన్లు' : 'Alerts & Notifications'}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {isTel ? 'మీ తాజా పొలం సమాచారం ఇక్కడ చూడండి.' : 'Your latest AI-driven field insights.'}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="font-title-md text-title-md text-on-surface-variant font-semibold border-b border-outline-variant/35 pb-1">
          {isTel ? 'ఈరోజు' : 'Today'}
        </h3>
        
        {alerts.map((a) => (
          <div 
            key={a.id} 
            className={`bg-white rounded-xl p-4 relative overflow-hidden border-l-4 ${a.color} shadow-sm transition-transform hover:-translate-y-0.5`}
          >
            {/* TTS Button */}
            <div className="absolute top-3 right-3">
              <button 
                onClick={() => speakText(a.text, a.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  playingId === a.id ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] animate-pulse-slow">
                  {playingId === a.id ? 'volume_mute' : 'volume_up'}
                </span>
              </button>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary mt-1">
                <span className="material-symbols-outlined text-lg">{a.icon}</span>
              </div>
              <div className="flex-1 pr-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm uppercase font-bold tracking-wider">
                    {a.badge}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{a.time}</span>
                </div>
                <h4 className="font-bold text-xs text-on-surface mb-1">{a.title}</h4>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">{a.text}</p>
                
                {a.actionText && (
                  <button 
                    onClick={a.action}
                    className="mt-2 font-bold font-label-md text-label-md text-primary flex items-center gap-0.5 hover:underline active:scale-95 transition-transform"
                  >
                    {a.actionText} 
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsScreen;
