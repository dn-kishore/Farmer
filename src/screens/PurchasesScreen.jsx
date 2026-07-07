import React from 'react';
import { useApp } from '../context/AppContext';

const PurchasesScreen = () => {
  const { purchases, language } = useApp();

  const isTel = language === 'te';

  return (
    <div className="flex-grow flex flex-col pb-24 p-md">
      <div className="mb-4">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">
          {isTel ? 'నా కొనుగోళ్లు' : 'Purchase History'}
        </h2>
        <p className="font-body-md text-xs text-on-surface-variant">
          {isTel ? 'మీరు కొనుగోలు చేసిన వస్తువులు మరియు బిల్లుల వివరాలు.' : 'Review your recent transactions and invoices.'}
        </p>
      </div>

      <div className="space-y-3">
        {purchases.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant text-xs">
            {isTel ? 'ఎటువంటి కొనుగోళ్లు లేవు' : 'No purchases logged yet.'}
          </div>
        ) : (
          purchases.map((p) => (
            <div 
              key={p.id} 
              className="bg-white rounded-xl p-4 flex flex-col gap-2 shadow-sm border border-outline-variant/25 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">
                    {p.title.includes('Seeds') ? 'grass' : p.title.includes('NPK') ? 'water_drop' : 'science'}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-on-surface leading-tight">{p.title}</h4>
                  <p className="text-xs text-on-surface-variant">{p.brand}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-primary-container/20 text-primary font-bold text-[9px] rounded-full uppercase">
                    {p.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1 pt-2 border-t border-outline-variant/15 text-xs text-on-surface-variant font-medium">
                <div>
                  <div className="text-[10px] text-outline uppercase tracking-wider">{isTel ? 'తేదీ' : 'Date'}</div>
                  <div className="text-on-surface font-semibold text-xs mt-0.5">{p.date}</div>
                </div>
                <div>
                  <div className="text-[10px] text-outline uppercase tracking-wider">{isTel ? 'పరిమాణం' : 'Qty'}</div>
                  <div className="text-on-surface font-semibold text-xs mt-0.5">{p.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-outline uppercase tracking-wider">{isTel ? 'మొత్తం' : 'Amount'}</div>
                  <div className="text-primary font-bold text-sm mt-0.5">₹{(p.price * p.quantity).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PurchasesScreen;
