import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const AiHelpScreen = () => {
  const { language, navigateTo, chatMessages, setChatMessages, t } = useApp();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'tools'
  const [inputText, setInputText] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  const isTel = language === 'te';

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

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

  const handleSend = (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = { id: chatMessages.length + 1, sender: 'user', text: textToSend, teluguText: textToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // AI thinking delay
    setTimeout(() => {
      let responseText = "I've logged that. You should apply Urea N46% based on soil test indicators.";
      let responseTe = "నేను దానిని సేవ్ చేసాను. మట్టి పరీక్ష సూచికల ఆధారంగా మీరు యూరియా N46% వేయాలి.";
      
      const query = textToSend.toLowerCase();
      if (query.includes('rice') || query.includes('paddy') || query.includes('వరి') || query.includes('dose') || query.includes('మోతాదు')) {
        responseText = "For Guntur paddy fields at vegetative stage, we recommend 45 kg of Nitrogen (Urea) and 20 kg of DAP per acre.";
        responseTe = "గుంటూరు వరి పొలాలకు మొలక దశలో, ఎకరాకు 45 కిలోల నత్రజని (యూరియా) మరియు 20 కిలోల DAP సిఫార్సు చేస్తున్నాము.";
      } else if (query.includes('weather') || query.includes('rain') || query.includes('వర్షం') || query.includes('వాతావరణం')) {
        responseText = "Pesticide application warning: Light rainfall is expected in Guntur in 2 hours. Do not spray now.";
        responseTe = "కీటకనాశిని పిచికారీ హెచ్చరిక: గుంటూరులో 2 గంటల్లో తేలికపాటి వర్షం కురిసే అవకాశం ఉంది. ఇప్పుడు స్ప్రే చేయవద్దు.";
      } else if (query.includes('disease') || query.includes('blast') || query.includes('తెగులు') || query.includes('చెక్')) {
        responseText = "Tomato Early Blight detected recently. Recommend copper-based spray. Check Crop Diagnosis page.";
        responseTe = "టమోటా ఆకు అగ్గి తెగులు కనుగొనబడింది. రాగి ఆధారిత పిచికారీ సిఫార్సు చేయబడింది. పంట తెగులు పరీక్ష పేజీ చూడండి.";
      }

      const aiMsg = {
        id: chatMessages.length + 2,
        sender: 'ai',
        text: responseText,
        teluguText: responseTe
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceQueriesEn = [
        "Paddy fertilizer dose recommendation",
        "Is it going to rain in Guntur today?",
        "How to spray chemical fertilizers safely?"
      ];
      const voiceQueriesTe = [
        "వరి పంట ఎరువుల మోతాదు ఎంత?",
        "ఈరోజు గుంటూరులో వర్షం పడుతుందా?",
        "రసాయన ఎరువులు సురక్షితంగా ఎలా చల్లాలి?"
      ];
      const randomIdx = Math.floor(Math.random() * voiceQueriesEn.length);
      handleSend(isTel ? voiceQueriesTe[randomIdx] : voiceQueriesEn[randomIdx]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] relative">
      
      {/* Top Tabs */}
      <div className="flex bg-white border-b border-outline-variant/30 sticky top-0 z-30 shrink-0">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'chat' 
              ? 'border-primary text-primary bg-primary-container/5' 
              : 'border-transparent text-outline hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-sm">chat</span>
          {isTel ? 'AI అసిస్టెంట్' : 'AI Assistant'}
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
            activeTab === 'tools' 
              ? 'border-primary text-primary bg-primary-container/5' 
              : 'border-transparent text-outline hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-sm">grid_view</span>
          {isTel ? 'వ్యవసాయ టూల్స్' : 'Farming Tools'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-hidden flex flex-col">
        
        {activeTab === 'chat' ? (
          /* ========================================================
             1. PREMIUM AI CHAT INTERFACE
             ======================================================== */
          <div className="flex flex-col h-full justify-between bg-background relative">
            
            {/* Scrollable messages box */}
            <div className="flex-grow overflow-y-auto p-md space-y-4 pb-20">
              {chatMessages.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-semibold">
                    {isTel ? 'స్మార్ట్ చాట్ ప్రారంభించండి' : 'Ask me anything about your field'}
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isAi = msg.sender === 'ai';
                  const textContent = isTel ? msg.teluguText : msg.text;
                  return (
                    <div key={msg.id} className={`flex items-start gap-2 ${isAi ? 'justify-start' : 'justify-end animate-in fade-in duration-300'}`}>
                      {isAi && (
                        <div className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0 border border-primary-container/30">
                          <span className="material-symbols-outlined text-sm">smart_toy</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 max-w-[82%]">
                        <div className={`relative rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border text-xs font-semibold ${
                          isAi 
                            ? 'bg-white border-outline-variant/30 text-on-surface' 
                            : 'bg-primary border-transparent text-on-primary'
                        }`}>
                          <p className="leading-relaxed text-[13px]">{textContent}</p>
                        </div>

                        {/* Speaker icons IMMEDIATELY to the right of AI bubbles (48x48 touch target area) */}
                        {isAi && (
                          <button
                            onClick={() => speakText(textContent, msg.id)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-200 ${
                              playingId === msg.id 
                                ? 'bg-primary text-white scale-95' 
                                : 'bg-white text-primary border border-outline-variant/30 hover:bg-surface-container active:scale-90'
                            }`}
                            aria-label="Play spoken text"
                          >
                            <span className="material-symbols-outlined text-lg">
                              {playingId === msg.id ? 'volume_mute' : 'volume_up'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Suggestion Chips */}
            <div className="absolute bottom-[60px] left-0 w-full bg-gradient-to-t from-background via-background to-transparent py-2 px-md flex gap-2 overflow-x-auto border-t border-outline-variant/15 scrollbar-hide z-10 shrink-0">
              <button 
                onClick={() => handleSend(isTel ? 'వరి పంటకు యూరియా వేయడం' : 'Paddy urea dose')}
                className="bg-white border border-outline-variant/40 rounded-full px-4 py-2 text-[11px] font-bold text-primary shadow-sm hover:border-primary active:scale-95 transition-all shrink-0"
              >
                🌾 {isTel ? 'వరి ఎరువులు' : 'Paddy dose'}
              </button>
              <button 
                onClick={() => handleSend(isTel ? 'ఈరోజు వర్షం పడుతుందా?' : 'Is it going to rain today?')}
                className="bg-white border border-outline-variant/40 rounded-full px-4 py-2 text-[11px] font-bold text-secondary shadow-sm hover:border-secondary active:scale-95 transition-all shrink-0"
              >
                ☁️ {isTel ? 'వర్ష సూచన' : 'Rain forecast'}
              </button>
              <button 
                onClick={() => handleSend(isTel ? 'టమోటా తెగుళ్లు పరీక్ష' : 'Tomato early blight treatment')}
                className="bg-white border border-outline-variant/40 rounded-full px-4 py-2 text-[11px] font-bold text-tertiary shadow-sm hover:border-tertiary active:scale-95 transition-all shrink-0"
              >
                🛡️ {isTel ? 'టమోటా తెగులు' : 'Tomato blight'}
              </button>
            </div>

            {/* Chat inputs footer bar */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-outline-variant/20 p-2.5 flex items-center gap-2 z-20 shrink-0">
              {/* Voice Button */}
              <button 
                onClick={startVoiceRecording}
                className="w-11 h-11 bg-primary-container/20 text-primary border border-primary-container/30 rounded-xl flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                title="Speak question"
              >
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
              </button>
              
              <input 
                className="flex-grow h-11 px-3 bg-[#F1F3F0] rounded-xl border border-transparent focus:bg-white focus:border-primary text-xs font-semibold outline-none"
                type="text"
                placeholder={isTel ? 'ప్రశ్న టైప్ చేయండి...' : 'Type your question...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              />
              
              <button 
                onClick={() => handleSend(inputText)}
                className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform shadow-md"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>

          </div>
        ) : (
          /* ========================================================
             2. PREMIUM TOOLS GRID VIEW
             ======================================================== */
          <div className="flex-grow overflow-y-auto p-md space-y-md bg-background">
            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Card 1: Fertilizer Recommendation */}
              <div 
                onClick={() => navigateTo('fertilizer_help')}
                className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between border border-outline-variant/20 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer aspect-square"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">science</span>
                </div>
                <div>
                  <h3 className="font-bold text-xs text-on-surface leading-tight">
                    {isTel ? 'ఎరువుల సిఫార్సు' : 'Fertilizer Recommendation'}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                    {isTel ? 'నేల నివేదిక ఆధారంగా అవసరమైన ఎరువులను సిఫార్సు చేస్తుంది.' : 'Soil-specific nutrient balancing calculators.'}
                  </p>
                </div>
              </div>

              {/* Card 2: Quantity Calculator */}
              <div 
                onClick={() => navigateTo('fertilizer_help')}
                className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between border border-outline-variant/20 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer aspect-square"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">calculate</span>
                </div>
                <div>
                  <h3 className="font-bold text-xs text-on-surface leading-tight">
                    {isTel ? 'పరిమాణ క్యాలిక్యులేటర్' : 'Quantity Calculator'}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                    {isTel ? 'పొలం సైజును బట్టి ఎరువుల బస్తాల లెక్కింపు.' : 'Dosage recommendations based on crop acres.'}
                  </p>
                </div>
              </div>

              {/* Card 3: Safety Instructions */}
              <div 
                onClick={() => navigateTo('safety_guide')}
                className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between border border-outline-variant/20 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer aspect-square"
              >
                <div className="w-11 h-11 rounded-xl bg-error-container/20 text-error flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">health_and_safety</span>
                </div>
                <div>
                  <h3 className="font-bold text-xs text-on-surface leading-tight">
                    {isTel ? 'భద్రతా నియమాలు' : 'Safety Instructions'}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                    {isTel ? 'రసాయనాలు వాడే ముందు తీసుకోవాల్సిన జాగ్రత్తలు.' : 'Essential guidelines for spraying safety.'}
                  </p>
                </div>
              </div>

              {/* Card 4: Crop Diagnosis */}
              <div 
                onClick={() => navigateTo('crop_diagnosis')}
                className="bg-surface-container-lowest rounded-2xl p-4 flex flex-col justify-between border border-outline-variant/20 shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer aspect-square"
              >
                <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">energy_savings_leaf</span>
                </div>
                <div>
                  <h3 className="font-bold text-xs text-on-surface leading-tight">
                    {isTel ? 'పంట తెగులు పరీక్ష' : 'Check My Crop'}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant mt-1.5 leading-relaxed">
                    {isTel ? 'ఆకు స్కాన్ ద్వారా తెగుళ్లను గుర్తించండి.' : 'Upload photos for leaf diseases identification.'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ========================================================
         3. SIMULATED VOICE RECORDING FREQUENCY OVERLAY
         ======================================================== */}
      {isRecording && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white p-lg animate-in fade-in duration-300">
          <div className="bg-white/10 border border-white/20 p-8 rounded-3xl flex flex-col items-center max-w-[280px] w-full text-center space-y-6 shadow-2xl backdrop-blur-md">
            
            <h3 className="font-bold text-sm tracking-wide text-white/95">
              {isTel ? 'నేను వింటున్నాను...' : 'Listening...'}
            </h3>
            
            <div className="relative w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 animate-pulse">
              <span className="material-symbols-outlined text-[36px] text-white">mic</span>
            </div>
            
            {/* Visualizer Soundwave Columns */}
            <div className="flex gap-1.5 justify-center items-end h-10 w-full px-4">
              <div className="w-1.5 h-6 bg-primary rounded-full animate-bounce [animation-duration:0.6s]"></div>
              <div className="w-1.5 h-9 bg-secondary-container rounded-full animate-bounce [animation-duration:0.4s]"></div>
              <div className="w-1.5 h-4 bg-white rounded-full animate-bounce [animation-duration:0.8s]"></div>
              <div className="w-1.5 h-8 bg-[#88d982] rounded-full animate-bounce [animation-duration:0.5s]"></div>
              <div className="w-1.5 h-5 bg-[#feae2c] rounded-full animate-bounce [animation-duration:0.7s]"></div>
            </div>

            <p className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">
              {isTel ? 'వాయిస్ గుర్తిస్తోంది' : 'Processing speech'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default AiHelpScreen;
