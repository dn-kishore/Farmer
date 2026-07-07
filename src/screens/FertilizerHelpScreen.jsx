import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const FertilizerHelpScreen = () => {
  const { language } = useApp();
  const [crop, setCrop] = useState('Paddy');
  const [acres, setAcres] = useState('');
  const [stage, setStage] = useState('Vegetative');
  const [result, setResult] = useState(null);

  const isTel = language === 'te';

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
    if (!acres || Number(acres) <= 0) return;

    const area = Number(acres);
    let n = 0, p = 0, k = 0;
    let textAdvice = '';

    if (crop === 'Paddy') {
      if (stage === 'Vegetative') {
        n = Math.ceil(area * 1.5); // 1.5 bags of Urea per acre
        p = Math.ceil(area * 1.0); // 1 bag of DAP per acre
        k = Math.ceil(area * 0.5); // 0.5 bag of MOP
        textAdvice = isTel 
          ? 'మొలక దశలో నత్రజని అధికంగా అవసరం. కనుక యూరియా వేయడం శ్రేయస్కరం.' 
          : 'High nitrogen demand during early growth. Apply Urea immediately before watering.';
      } else if (stage === 'Flowering') {
        n = Math.ceil(area * 0.8);
        p = Math.ceil(area * 0.5);
        k = Math.ceil(area * 1.0); // Potash helps flowering
        textAdvice = isTel 
          ? 'పూత దశలో పొటాషియం అవసరం. ఇది ధాన్యం గింజల బరువు పెరగడానికి సహాయపడుతుంది.' 
          : 'Apply Potassium (MOP) to enhance grain quality and yield weight during flowering.';
      } else {
        n = 0; p = 0; k = Math.ceil(area * 0.5);
        textAdvice = isTel ? 'కోత దశలో కేవలం నీటి యాజమాన్యం ముఖ్యం.' : 'Focus on water management. No heavy nitrogen application required now.';
      }
    } else if (crop === 'Chilli') {
      n = Math.ceil(area * 2.0);
      p = Math.ceil(area * 1.2);
      k = Math.ceil(area * 1.5);
      textAdvice = isTel ? 'మిరప కాపు దశలో కాంప్లెక్స్ ఎరువుల వాడకం మేలు.' : 'Chilli crops require balanced NPK throughout vegetative and fruiting cycles.';
    } else {
      n = Math.ceil(area * 1.2);
      p = Math.ceil(area * 0.8);
      k = Math.ceil(area * 1.0);
      textAdvice = isTel ? 'ప్రత్తి పంటకు యూరియా మరియు పొటాష్ సమపాళ్లలో వేయాలి.' : 'Apply balanced dosage. Nitrogen prevents boll shedding.';
    }

    setResult({ n, p, k, advice: textAdvice });
  };

  return (
    <div className="flex-grow flex flex-col pb-24 p-md">
      <div className="mb-4">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">
          {isTel ? 'ఎరువుల గణన యంత్రం' : 'Nutrient Calculator'}
        </h2>
        <p className="font-body-md text-xs text-on-surface-variant">
          {isTel ? 'మీ పొలానికి సరిపడా ఎరువుల మోతాదును సులభంగా లెక్కించండి.' : 'Calculate N-P-K inputs needed based on crop and field acreage.'}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20 space-y-4">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">
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

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">
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

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant">
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

          <button
            type="submit"
            className="w-full h-11 bg-primary text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">calculate</span>
            {isTel ? 'లెక్కించండి' : 'Calculate Recommendation'}
          </button>
        </form>
      </div>

      {result && (
        <section className="mt-4 space-y-3 animate-in fade-in duration-300">
          <h3 className="font-bold text-xs text-on-surface uppercase tracking-wider">
            {isTel ? 'సిఫార్సు చేయబడిన మోతాదు' : 'Recommended Dosage'}
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
              <span className="block text-[10px] text-on-surface-variant font-bold">Urea (N)</span>
              <span className="block text-lg font-bold text-primary mt-1">{result.n} {isTel ? 'బ్యాగులు' : 'Bags'}</span>
            </div>
            <div className="bg-secondary-container/10 border border-secondary-container/20 rounded-xl p-3 text-center">
              <span className="block text-[10px] text-on-surface-variant font-bold">DAP (P)</span>
              <span className="block text-lg font-bold text-secondary mt-1">{result.p} {isTel ? 'బ్యాగులు' : 'Bags'}</span>
            </div>
            <div className="bg-tertiary-container/10 border border-tertiary-container/20 rounded-xl p-3 text-center">
              <span className="block text-[10px] text-on-surface-variant font-bold">MOP (K)</span>
              <span className="block text-lg font-bold text-tertiary mt-1">{result.k} {isTel ? 'బ్యాగులు' : 'Bags'}</span>
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
