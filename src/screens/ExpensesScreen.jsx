import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ExpensesScreen = () => {
  const { expenses, addExpense, language, t } = useApp();
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Fertilizer');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const isTel = language === 'te';

  // Live sum
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    addExpense({
      name,
      amount: Number(amount),
      category,
      date
    });
    // Reset
    setName('');
    setAmount('');
    setCategory('Fertilizer');
    setDate(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const categories = [
    { value: 'Fertilizer', label: isTel ? 'ఎరువులు' : 'Fertilizer' },
    { value: 'Seeds', label: isTel ? 'విత్తనాలు' : 'Seeds' },
    { value: 'Labor', label: isTel ? 'కూలీలు' : 'Labor' },
    { value: 'Machinery', label: isTel ? 'యంత్రాలు' : 'Machinery' },
    { value: 'Pesticides', label: isTel ? 'పురుగుమందులు' : 'Pesticides' },
    { value: 'Other', label: isTel ? 'ఇతరములు' : 'Other' }
  ];

  return (
    <div className="flex-grow flex flex-col pb-24 p-md relative">
      <div className="space-y-md">
        {/* Total Expenses Banner */}
        <section className="bg-gradient-to-br from-primary to-[#157a24] text-white rounded-2xl p-lg shadow-sm">
          <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">
            {isTel ? 'ఈ నెల మొత్తం ఖర్చు' : 'TOTAL SPENT THIS MONTH'}
          </span>
          <div className="text-3xl font-bold mt-1">₹{totalExpenses.toLocaleString('en-IN')}</div>
          <p className="text-xs opacity-75 mt-2">
            {isTel ? 'గత నెల కంటే 12% తక్కువ ఖర్చు చేయబడింది' : '12% lower spending compared to last month'}
          </p>
        </section>

        {/* Expenses List */}
        <section className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-title-md text-md text-on-surface font-bold">
              {isTel ? 'ఖర్చుల చిట్టా' : 'Expense Logs'}
            </h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary-container/20 text-primary font-semibold text-xs px-3 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">add</span>
              {t('addExpenseBtn')}
            </button>
          </div>

          <div className="space-y-2.5">
            {expenses.map((exp) => (
              <div key={exp.id} className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm border border-outline-variant/25">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-xl">
                      {exp.category === 'Fertilizer' ? 'science' : 
                       exp.category === 'Seeds' ? 'eco' : 
                       exp.category === 'Labor' ? 'groups' : 
                       exp.category === 'Machinery' ? 'agriculture' : 'receipt_long'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-on-surface">{exp.name}</h4>
                    <p className="text-xs text-on-surface-variant font-medium">
                      {exp.date} • {isTel ? categories.find(c => c.value === exp.category)?.label : exp.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-base text-[#ac0c18]">- ₹{exp.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Add Expense Slide-up Panel overlay */}
      {showForm && (
        <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end">
          <div className="bg-white rounded-t-[24px] p-lg space-y-4 shadow-xl border-t border-outline-variant/30 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
              <h3 className="font-title-md text-md text-on-surface font-bold">
                {isTel ? 'కొత్త ఖర్చును జోడించండి' : 'Add New Expense'}
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-xs text-on-surface-variant font-semibold">{t('expenseName')}</label>
                <input
                  className="w-full h-[48px] px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:bg-white text-sm outline-none"
                  type="text"
                  placeholder={isTel ? 'ఉదా: యూరియా బ్యాగ్స్' : 'e.g. Urea fertilizer bags'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-xs text-on-surface-variant font-semibold">{t('expenseAmount')}</label>
                <input
                  className="w-full h-[48px] px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:bg-white text-sm outline-none"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-xs text-on-surface-variant font-semibold">{t('expenseCategory')}</label>
                <select
                  className="w-full h-[48px] px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:bg-white text-sm outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-xs text-on-surface-variant font-semibold">Date</label>
                <input
                  className="w-full h-[48px] px-3 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:bg-white text-sm outline-none"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-[52px] bg-primary text-white rounded-xl font-bold flex items-center justify-center shadow-md active:scale-95 transition-all mt-4"
              >
                {t('addExpenseBtn')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesScreen;
