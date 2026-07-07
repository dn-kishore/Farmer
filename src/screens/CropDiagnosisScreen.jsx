import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const CropDiagnosisScreen = () => {
  const { language } = useApp();
  const [scanState, setScanState] = useState('idle'); // 'idle', 'scanning', 'complete'
  
  const isTel = language === 'te';

  const startScan = () => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState('complete');
    }, 2000);
  };

  return (
    <div className="flex-grow flex flex-col pb-24 p-md">
      {scanState === 'idle' && (
        <div className="flex-grow flex flex-col items-center justify-center border-3 border-dashed border-outline-variant/50 rounded-2xl p-lg bg-white/50 text-center my-auto space-y-md">
          <span className="material-symbols-outlined text-primary text-[64px]" style={{ fontVariationSettings: "'FILL' 0" }}>
            photo_camera
          </span>
          <div>
            <h3 className="font-title-md text-on-surface font-bold">
              {isTel ? 'పంట తెగులు పరీక్ష' : 'Crop Disease Diagnosis'}
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant max-w-[260px] mt-2">
              {isTel 
                ? 'తక్షణ రోగ నిర్ధారణ కోసం సోకిన పంట ఆకు చిత్రాన్ని అప్‌లోడ్ చేయండి.' 
                : 'Upload a clear photograph of an infected leaf to receive instant AI diagnostics.'}
            </p>
          </div>
          <button 
            onClick={startScan}
            className="bg-primary text-white font-bold px-md py-3 rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-md">qr_code_scanner</span>
            {isTel ? 'స్కాన్ ప్రారంభించండి' : 'Start Scanning'}
          </button>
        </div>
      )}

      {scanState === 'scanning' && (
        <div className="flex-grow flex flex-col items-center justify-center my-auto space-y-lg">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Spinning Radar circles */}
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-secondary border-b-transparent animate-spin [animation-duration:1.5s]"></div>
            <span className="material-symbols-outlined text-primary text-[48px] animate-pulse">
              eco
            </span>
          </div>
          <div className="text-center">
            <h3 className="font-title-md text-on-surface font-bold animate-pulse">
              {isTel ? 'ఆకును విశ్లేషిస్తోంది...' : 'Analyzing leaf photo...'}
            </h3>
            <p className="font-body-md text-xs text-on-surface-variant mt-1">
              {isTel ? 'AI నమూనా గుర్తిస్తోంది' : 'Running diagnostic model...'}
            </p>
          </div>
        </div>
      )}

      {scanState === 'complete' && (
        <div className="space-y-md">
          {/* Back to Scan button */}
          <button 
            onClick={() => setScanState('idle')}
            className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">replay</span>
            {isTel ? 'మరో స్కాన్ చేయండి' : 'Scan another leaf'}
          </button>

          {/* Scanned Image Container */}
          <div className="relative w-full rounded-xl overflow-hidden shadow-sm aspect-video">
            <img 
              className="w-full h-full object-cover" 
              alt="Late Blight leaf" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBebwOS0NlM1eMjdH081l3a1P33zzTsg6vDUcN0lai6GNW2vOAMwpC5Hg3n_zQvzFTbEns9OW-ED1f2SzNNCL0RTCvq8yptTC1CN92QjeCvaGgLIL8vFJx2ZoMnRDU2UweCvfqtqPdjzlpMDIU94w6kvW7l4YunzQ8F39MBWykZsMpV_8BVGJsbsqTU-X0p4iQ5azW6XI0oXsHML6lI2VbfMV2T9C_yzbWe_Hr1R4KR_Ed2imbBQXNPmA"
            />
            <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center space-x-1.5 shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-sm">qr_code_scanner</span>
              <span className="font-bold text-[10px] text-on-surface uppercase tracking-wider">
                {isTel ? 'విశ్లేషణ పూర్తయింది' : 'Scan Complete'}
              </span>
            </div>
          </div>

          {/* Severity & Confidence Bento */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary-container/10 border border-secondary-container/20 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 mb-2">
                <span className="material-symbols-outlined text-secondary text-sm fill">warning</span>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                  {isTel ? 'తీవ్రత' : 'Severity'}
                </span>
              </div>
              <div>
                <h4 className="text-secondary font-bold text-sm">{isTel ? 'మధ్యస్థం' : 'Moderate'}</h4>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {isTel ? '48 గంటల్లో నివారణ చర్య అవసరం' : 'Action required within 48h'}
                </p>
              </div>
            </div>

            <div className="bg-white border border-outline-variant/30 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 mb-2">
                <span className="material-symbols-outlined text-primary text-sm">target</span>
                <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                  {isTel ? 'AI ఖచ్చితత్వం' : 'AI Confidence'}
                </span>
              </div>
              <div>
                <div className="flex items-end space-x-0.5">
                  <h4 className="font-bold text-base text-on-surface">94</h4>
                  <span className="text-[10px] text-on-surface-variant pb-0.5">%</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-1 mt-1 overflow-hidden">
                  <div className="bg-primary h-1 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis details */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 mb-1.5">
              <span className="px-2 py-0.5 bg-error-container text-on-error-container rounded-lg text-[10px] font-bold uppercase">
                {isTel ? 'శిలీంధ్రాల సంక్రమణ' : 'Fungal Infection'}
              </span>
              <span className="px-2 py-0.5 bg-surface-container text-on-surface rounded-lg text-[10px] font-bold uppercase">
                {isTel ? 'టమోటా పంట' : 'Tomato'}
              </span>
            </div>
            <h3 className="font-bold text-base text-on-surface">
              {isTel ? 'అగ్గి తెగులు' : 'Early Blight'}{' '}
              <span className="text-xs text-on-surface-variant italic font-normal">(Alternaria solani)</span>
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {isTel 
                ? 'ఆకులపై ఏక కేంద్రక వలయాలతో కూడిన నల్లటి మచ్చలు గుర్తించబడ్డాయి. ఇటీవలి అధిక తేమ వల్ల ఇది మరింత ఎక్కువవుతుంది.'
                : 'Detected irregular, dark lesions with concentric rings on lower leaves. Typical of early blight progression, exacerbated by recent high humidity.'}
            </p>
          </div>

          {/* Treatment plan */}
          <div className="bg-white/80 border border-outline-variant/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2 border-b border-outline-variant/30 pb-2">
              <span className="material-symbols-outlined text-primary text-lg fill">medical_services</span>
              <h4 className="font-bold text-xs text-on-surface">
                {isTel ? 'సూచించిన నివారణ పద్ధతి' : 'Recommended Treatment Plan'}
              </h4>
            </div>
            <div className="relative pl-5 space-y-4 text-xs">
              <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-surface-variant"></div>
              
              <div className="relative">
                <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary flex items-center justify-center z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                </div>
                <h5 className="font-bold text-on-surface">{isTel ? 'తక్షణ చర్య (ఈరోజు)' : 'Immediate Action (Today)'}</h5>
                <p className="text-on-surface-variant mt-0.5">
                  {isTel ? 'సోకిన ఆకులను కత్తిరించి నాశనం చేయండి.' : 'Prune and destroy infected lower leaves. Do not compost.'}
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[23px] top-0.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-outline-variant flex items-center justify-center z-10"></div>
                <h5 className="font-bold text-on-surface">{isTel ? 'ఫంగిసైడ్ పిచికారీ (2 రోజుల్లో)' : 'Fungicide Application (2 Days)'}</h5>
                <p className="text-on-surface-variant mt-0.5">
                  {isTel ? 'రాగి ఆధారిత ఫంగిసైడ్ లేదా క్లోరోథలోనిల్ చల్లండి.' : 'Apply copper-based fungicide. Ensure thorough leaf coverage.'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-gradient-to-b from-primary to-[#157a24] text-white text-xs font-semibold py-3 rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1">
              <span className="material-symbols-outlined text-md">science</span>
              <span>{isTel ? 'చర్యను నమోదు చేయి' : 'Log Treatment'}</span>
            </button>
            <button className="flex-1 bg-surface-container-high text-on-surface text-xs font-semibold py-3 rounded-xl hover:bg-surface-variant active:scale-95 transition-all flex items-center justify-center space-x-1 border border-outline-variant/30">
              <span className="material-symbols-outlined text-md">support_agent</span>
              <span>{isTel ? 'సలహాదారుడిని సంప్రదించండి' : 'Contact Expert'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropDiagnosisScreen;
