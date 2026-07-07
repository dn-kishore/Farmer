import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const FertilizerHelpScreen = () => {
  const { language, fertilizerHelpMode, t } = useApp();
  const [mode, setMode] = useState('recommendation'); // 'recommendation' or 'quantity'
  const [crop, setCrop] = useState('Paddy');
  const [acres, setAcres] = useState('');
  const [stage, setStage] = useState('Vegetative');
  const [result, setResult] = useState(null);

  const isTel = language === 'te';

  useEffect(() => {
    if (fertilizerHelpMode) {
      setMode(fertilizerHelpMode);
    }
    setResult(null);
  }, [fertilizerHelpMode]);

  const crops = [
    { value: 'Paddy', label: isTel ? 'వరి పంట' : 'Paddy / Rice' },
    { value: 'Chilli', label: isTel ? 'మిరప పంట' : 'Chilli' },
    { value: 'Cotton', label: isTel ? 'ప్రత్తి పంట' : 'Cotton' }
  ];

  const stages = [
    { value: 'Vegetative', label: isTel ? 'శాఖీయ దశ (మొలక దశ)' : 'Vegetative Stage' },
    { value: 'Flowering', label: isTel ? 'పూత దశ' : 'Flowering Stage' },
    { value: 'Harvesting', label: isTel ? 'గింజ గట్టిపడే దశ' : 'Grain Filling / Harvesting' }
  ];

  const handleCalculate = (e) => {
    e.preventDefault();
    let n = 0, p = 0, k = 0;
    let textAdvice = '';

    if (mode === 'recommendation') {
      // Recommendation per acre
      if (crop === 'Paddy') {
        if (stage === 'Vegetative') {
          n = 1.5; p = 1.0; k = 0.5;
          textAdvice = isTel 
            ? 'మొలక దశలో నత్రజని అధికంగా అవసరం. కనుక యూరియా వేయడం శ్రేయస్కరం.' 
            : 'High nitrogen demand during early growth. Apply Urea immediately before watering.';
        } else if (stage === 'Flowering') {
          n = 0.8; p = 0.5; k = 1.0;
          textAdvice = isTel 
            ? 'పూత దశలో పొటాషియం అవసరం. ఇది ధాన్యం గింజల బరువు పెరగడానికి సహాయపడుతుంది.' 
            : 'Apply Potassium (MOP) to enhance grain quality and yield weight during flowering.';
        } else {
          n = 0; p = 0; k = 0.5;
          textAdvice = isTel ? 'కోత దశలో కేవలం నీటి యాజమాన్యం ముఖ్యం.' : 'Focus on water management. No heavy nitrogen application required now.';
        }
      } else if (crop === 'Chilli') {
        n = 2.0; p = 1.2; k = 1.5;
        textAdvice = isTel ? 'మిరప కాపు దశలో కాంప్లెక్స్ ఎరువుల వాడకం మేలు.' : 'Chilli crops require balanced NPK throughout vegetative and fruiting cycles.';
      } else {
        n = 1.2; p = 0.8; k = 1.0;
        textAdvice = isTel ? 'ప్రత్తి పంటకు యూరియా మరియు పొటాష్ సమపాళ్లలో వేయాలి.' : 'Apply balanced dosage. Nitrogen prevents boll shedding.';
      }
      setResult({ n, p, k, advice: textAdvice, unitText: isTel ? 'బ్యాగులు/ఎకరం' : 'Bags/Acre' });
    } else {
      // Quantity Calculation for total area
      if (!acres || Number(acres) <= 0) return;
      const area = Number(acres);

      if (crop === 'Paddy') {
        n = Math.ceil(area * 1.5);
        p = Math.ceil(area * 1.0);
        k = Math.ceil(area * 0.5);
        textAdvice = isTel 
          ? `${area} ఎకరాల వరి పొలానికి అవసరమైన మొత్తం ఎరువుల బస్తాల వివరాలు పైన ఇవ్వబడ్డాయి.`
          : `Total bags computed for ${area} acres of paddy field under standard growth conditions.`;
      } else if (crop === 'Chilli') {
        n = Math.ceil(area * 2.0);
        p = Math.ceil(area * 1.2);
        k = Math.ceil(area * 1.5);
        textAdvice = isTel 
          ? `${area} ఎకరాల మిరప తోటకు అవసరమైన మొత్తం ఎరువుల బస్తాల వివరాలు పైన ఇవ్వబడ్డాయి.`
          : `Total bags computed for ${area} acres of chilli crop.`;
      } else {
        n = Math.ceil(area * 1.2);
        p = Math.ceil(area * 0.8);
        k = Math.ceil(area * 1.0);
        textAdvice = isTel 
          ? `${area} ఎకరాల ప్రత్తి పొలానికి అవసరమైన మొత్తం ఎరువుల బస్తాల వివరాలు పైన ఇవ్వబడ్డాయి.`
          : `Total bags computed for ${area} acres of cotton crop.`;
      }
      setResult({ n, p, k, advice: textAdvice, unitText: isTel ? 'బ్యాగులు' : 'Bags' });
    }
  };

  return (
    <div className="flex-grow flex flex-col pb-24 p-md">
      <div className="mb-4">
        <h2 className="text-base font-bold text-on-surface">
          {mode === 'recommendation' ? t('fertilizerRecommendation') : t('quantityCalculator')}
        </h2>
        <p className="text-xs text-on-surface-variant mt-1">
          {mode === 'recommendation' 
            ? (isTel ? 'పంట దశను బట్టి ఎరువుల మోతాదు సిఫార్సులు.' : 'Get optimal fertilizer recipes for your crop stage.')
            : (isTel ? 'మీ పొలం సైజును బట్టి ఎరువుల బస్తాల సంఖ్యను లెక్కించండి.' : 'Calculate exact fertilizer bag quantities for your field area.')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-surface-container rounded-xl border border-outline-variant/30 p-1 mb-4">
        <button
          onClick={() => {
            setMode('recommendation');
            setResult(null);
          }}
          className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
            mode === 'recommendation' 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          {t('fertilizerRecommendation')}
        </button>
        <button
          onClick={() => {
            setMode('quantity');
            setResult(null);
          }}
          className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition-all ${
            mode === 'quantity' 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          {t('quantityCalculator')}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20 space-y-4">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-on-surface-variant">
              {isTel ? 'పంట రకం' : 'Crop Type'}
            </label>
            <select
              className="w-full h-11 px-3 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-semibold focus:bg-white outline-none"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              {crops.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {mode === 'quantity' ? (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant">
                {isTel ? 'పొలం వైశాల్యం (ఎకరాలలో)' : 'Field Area (in Acres)'}
              </label>
              <input
                className="w-full h-11 px-3 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-semibold focus:bg-white outline-none"
                type="number"
                step="0.1"
                placeholder="e.g. 2.5"
                value={acres}
                onChange={(e) => setAcres(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant">
                {isTel ? 'పంట దశ' : 'Growth Stage'}
              </label>
              <select
                className="w-full h-11 px-3 rounded-xl bg-surface-container border border-outline-variant/30 text-xs font-semibold focus:bg-white outline-none"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                {stages.map((stg) => (
                  <option key={stg.value} value={stg.value}>{stg.label}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">calculate</span>
            {mode === 'recommendation' 
              ? (isTel ? 'సిఫార్సు పొందండి' : 'Get Recommendation')
              : (isTel ? 'లెక్కించండి' : 'Calculate Quantity')}
          </button>
        </form>
      </div>

      {result && (
        <section className="mt-4 space-y-3 animate-in fade-in duration-300">
          <h3 className="font-bold text-xs text-on-surface uppercase tracking-wider">
            {mode === 'recommendation' 
              ? (isTel ? 'సిఫార్సు చేసిన మోతాదు' : 'Recommended Dosage')
              : (isTel ? 'కావలసిన మొత్తం ఎరువులు' : 'Required Quantities')}
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
              <span className="block text-[10px] text-on-surface-variant font-bold">Urea (N)</span>
              <span className="block text-xs font-bold text-primary mt-1">{result.n} {result.unitText}</span>
            </div>
            <div className="bg-secondary-container/10 border border-secondary-container/20 rounded-xl p-3 text-center">
              <span className="block text-[10px] text-on-surface-variant font-bold">DAP (P)</span>
              <span className="block text-xs font-bold text-secondary mt-1">{result.p} {result.unitText}</span>
            </div>
            <div className="bg-tertiary-container/10 border border-tertiary-container/20 rounded-xl p-3 text-center">
              <span className="block text-[10px] text-on-surface-variant font-bold">MOP (K)</span>
              <span className="block text-xs font-bold text-tertiary mt-1">{result.k} {result.unitText}</span>
            </div>
          </div>

          {/* AI Advice */}
          <div className="bg-white rounded-xl p-3 border border-outline-variant/30 flex gap-2.5 items-start">
            <span className="material-symbols-outlined text-primary text-lg fill">psychology</span>
            <div>
              <h4 className="text-xs font-bold text-on-surface">{isTel ? 'AI సలహా' : 'AI Advice'}</h4>
              <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">{result.advice}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default FertilizerHelpScreen;
