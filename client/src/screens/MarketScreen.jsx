import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const MarketScreen = () => {
  const { addToCart, cart, updateCartQty, checkout, language, t } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isTel = language === 'te';
  const modalCartItem = selectedProduct ? cart.find((item) => item.id === selectedProduct.id) : null;

  const products = [
    { 
      id: 101, 
      title: 'Urea Fertilizer (N46%)', 
      brand: 'AgriChem Corp', 
      price: 850, 
      unit: '50kg bag', 
      category: 'Urea', 
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDToFbFYF3ce3VdTqVj_p4frJ1q3mqrKIMaX72uoy-xRFHu-tQK3a97m4dtYzdfHsV_Zea2sTH-dqmsfQJ5Q0kfGHISyVMWj9YqRFc1VjpWOR0I_12nHNutfAZW-EdmqvEQDopXVyefN3nDXz_y59SyHLAVzA_MNe1vy4gPkgjH7SLej4LaKQk11YSYy8t-WsCkGO_YLTHYW9ESQlbKHsDuwMmXbo4jpDd_8r1p_lS3bXTSrgSmXqXTMg',
      desc: isTel 
        ? 'నత్రజని అధికంగా గల రసాయనిక ఎరువు. వరి, గోధుమ పంటలలో ఆకుపచ్చని ఎదుగుదలకు తోడ్పడుతుంది.' 
        : 'High nitrogen concentration (46%) fertilizer. Promotes leafy green growth and vegetative development in paddy, wheat, and vegetables.',
      trendPoints: "M 5,80 L 23,75 L 41,70 L 59,50 L 77,60 L 95,20",
      fillPoints: "M 5,80 L 23,75 L 41,70 L 59,50 L 77,60 L 95,20 L 95,100 L 5,100 Z",
      coords: [{x: 5, y: 80}, {x: 23, y: 75}, {x: 41, y: 70}, {x: 59, y: 50}, {x: 77, y: 60}, {x: 95, y: 20}],
      monthlyPrices: ['₹805', '₹810', '₹825', '₹830', '₹840', '₹850']
    },
    { 
      id: 102, 
      title: 'NPK 19:19:19 Water Soluble', 
      brand: 'GrowMax', 
      price: 1200, 
      unit: '25kg bag', 
      category: 'NPK', 
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtX1wXsz8NjTPdI7OkgbJnIEfviI4D_vuTMdan77DWhO0VAwT_N8WhxCGWrxxYs7cqQZX1EUOKKyH6WJENlqDc-9AXAzhNEFHU1jWaLnYWxwK5B_yPn-n7iaSo1kO4vNx7ZLBK0zOm4TaIoEf3VNqFXVqJOFSAbyeWn7fdJS5zVmSyoj1sUaN2VJYNhZkNETH7BaYKVIN_my34MpxSR9AtxDX7hijmFHoIUmPnlpxyRu-3-GLFeBLwWw',
      desc: isTel 
        ? 'సమతుల్య ఎన్-పి-కె నీటిలో కరిగే ఎరువు. పూత దశలో పంట నాణ్యత పెరగడానికి అత్యంత ఉపయోగకరం.' 
        : 'Balanced water-soluble fertilizer containing equal ratios of Nitrogen, Phosphorus, and Potassium. Ideal for flowering stages and overall root growth.',
      trendPoints: "M 5,30 L 23,35 L 41,40 L 59,25 L 77,45 L 95,50",
      fillPoints: "M 5,30 L 23,35 L 41,40 L 59,25 L 77,45 L 95,50 L 95,100 L 5,100 Z",
      coords: [{x: 5, y: 30}, {x: 23, y: 35}, {x: 41, y: 40}, {x: 59, y: 25}, {x: 77, y: 45}, {x: 95, y: 50}],
      monthlyPrices: ['₹1220', '₹1210', '₹1205', '₹1230', '₹1215', '₹1200']
    },
    { 
      id: 103, 
      title: 'Premium Wheat Seeds', 
      brand: 'GreenFields Biotech', 
      price: 1640, 
      unit: '20kg bag', 
      category: 'Organic', 
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7FHd9sh-1byx3DOhypPTpII7vkjAZ8SxbL535v4fdAa4YviQU1Uslv41wQlqhBiTCqFkUgyILFzS1y4wZtHg_SOHTsP9hvmUHVxH-MIc-dSEful_IfjOOk6_KiHg2TNzmY_au2B7Dj11CmrLY0ln_XEKbqRA1R2KlmqOwOMRtX8l9pQc_HVTl9IudADMYFTEJ_J0t7V0BYD4HnQvbQaiXAtO9XFWHIyEAK6i2lAp0QmVqWy_pVS5nWw',
      desc: isTel 
        ? 'అధిక దిగుబడి ఇచ్చే ధృవీకరించబడిన గోధుమ విత్తనాలు. తెగుళ్లను తట్టుకునే రకం.' 
        : 'Certified high-yielding wheat seeds. Heat-tolerant and disease-resistant. Perfect for Rabi season sowing.',
      trendPoints: "M 5,90 L 23,85 L 41,80 L 59,70 L 77,65 L 95,60",
      fillPoints: "M 5,90 L 23,85 L 41,80 L 59,70 L 77,65 L 95,60 L 95,100 L 5,100 Z",
      coords: [{x: 5, y: 90}, {x: 23, y: 85}, {x: 41, y: 80}, {x: 59, y: 70}, {x: 77, y: 65}, {x: 95, y: 60}],
      monthlyPrices: ['₹1750', '₹1720', '₹1700', '₹1680', '₹1660', '₹1640']
    },
    { 
      id: 104, 
      title: 'Pesticide Spray (Organic)', 
      brand: 'EcoSafe Solutions', 
      price: 2075, 
      unit: '5L bottle', 
      category: 'Pesticides', 
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBebwOS0NlM1eMjdH081l3a1P33zzTsg6vDUcN0lai6GNW2vOAMwpC5Hg3n_zQvzFTbEns9OW-ED1f2SzNNCL0RTCvq8yptTC1CN92QjeCvaGgLIL8vFJx2ZoMnRDU2UweCvfqtqPdjzlpMDIU94w6kvW7l4YunzQ8F39MBWykZsMpV_8BVGJsbsqTU-X0p4iQ5azW6XI0oXsHML6lI2VbfMV2T9C_yzbWe_Hr1R4KR_Ed2imbBQXNPmA',
      desc: isTel 
        ? '100% ఆర్గానిక్ వేప ఆధారిత పంట పురుగుమందు. అఫిడ్స్ మరియు తెల్లదోమల నివారణకు అద్భుతమైనది.' 
        : '100% organic neem-based crop pesticide. Protects tomatoes and vegetables against aphids, whiteflies, and insect pests.',
      trendPoints: "M 5,70 L 23,65 L 41,55 L 59,40 L 77,35 L 95,25",
      fillPoints: "M 5,70 L 23,65 L 41,55 L 59,40 L 77,35 L 95,25 L 95,100 L 5,100 Z",
      coords: [{x: 5, y: 70}, {x: 23, y: 65}, {x: 41, y: 55}, {x: 59, y: 40}, {x: 77, y: 35}, {x: 95, y: 25}],
      monthlyPrices: ['₹1950', '₹1980', '₹2010', '₹2040', '₹2060', '₹2075']
    }
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = ['All', 'Urea', 'NPK', 'Organic', 'Pesticides'];

  return (
    <div className="flex-grow flex flex-col pb-24 p-md relative">
      {/* Search Bar */}
      <section className="space-y-3 mb-4">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full h-12 pl-12 pr-4 bg-surface-container border-2 border-transparent focus:border-primary focus:bg-surface-container-lowest rounded-xl font-body-md text-body-md transition-all outline-none" 
            placeholder={t('searchMarket')} 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Scroll Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`snap-start shrink-0 px-4 py-2 rounded-xl font-title-md text-title-md transition-all ${
                category === cat 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-surface-container border border-outline-variant/35 text-on-surface-variant'
              }`}
            >
              {cat === 'All' ? (isTel ? 'అన్నీ' : 'All') : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="grid grid-cols-2 gap-3">
        {filteredProducts.map((p) => {
          const cartItem = cart.find((item) => item.id === p.id);
          return (
            <article 
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="bg-surface-container-lowest rounded-2xl p-3 shadow-sm border border-outline-variant/20 hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between cursor-pointer"
            >
              <div className="w-full h-28 rounded-lg border border-outline-variant/10 shadow-sm mb-2 overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
                <img 
                  alt={p.title} 
                  className="w-full h-full object-cover mix-blend-multiply" 
                  src={p.img}
                />
              </div>
              <div className="flex-grow flex flex-col mb-2">
                <span className="text-[9px] text-outline uppercase font-bold tracking-wider">{p.brand}</span>
                <h3 className="text-xs font-bold text-on-surface mt-0.5 leading-tight">{p.title}</h3>
                <div className="mt-2">
                  <p className="text-sm font-bold text-primary">₹{p.price}</p>
                  <p className="text-[9px] text-on-surface-variant font-medium">/ {p.unit}</p>
                </div>
              </div>
              
              {cartItem ? (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-9 bg-primary text-white rounded-lg text-xs font-semibold flex items-center justify-between px-2"
                >
                  <button
                    onClick={() => updateCartQty(p.id, -1)}
                    className="w-7 h-7 rounded-md hover:bg-white/10 active:scale-90 transition-transform flex items-center justify-center font-bold text-base"
                  >
                    —
                  </button>
                  <span className="font-bold text-xs text-white">{cartItem.quantity}</span>
                  <button
                    onClick={() => updateCartQty(p.id, 1)}
                    className="w-7 h-7 rounded-md hover:bg-white/10 active:scale-90 transition-transform flex items-center justify-center font-bold text-base"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent opening product details modal
                    addToCart(p);
                  }}
                  className="w-full h-9 bg-primary text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">shopping_cart</span>
                  {t('addToCart')}
                </button>
              )}
            </article>
          );
        })}
      </section>

      {/* Product Details Modal Overlay */}
      {selectedProduct && (
        <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end">
          <div className="bg-surface-container-lowest rounded-t-[28px] p-6 max-h-[92%] overflow-y-auto flex flex-col shadow-2xl border-t border-outline-variant/30 animate-in slide-in-from-bottom duration-300 space-y-4">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 className="font-title-md text-title-md text-on-surface uppercase tracking-wide font-bold">
                {isTel ? 'ఉత్పత్తి వివరాలు' : 'Product Details'}
              </h3>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Product Meta */}
            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center border border-outline-variant/20" style={{ backgroundColor: '#ffffff' }}>
                <img 
                  alt={selectedProduct.title} 
                  className="w-full h-full object-cover mix-blend-multiply" 
                  src={selectedProduct.img}
                />
              </div>
              <div className="flex-1">
                <span className="text-[9px] text-outline uppercase font-extrabold tracking-wider">{selectedProduct.brand}</span>
                <h4 className="text-sm font-bold text-on-surface mt-0.5 leading-tight">{selectedProduct.title}</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-base font-bold text-primary">₹{selectedProduct.price}</span>
                  <span className="text-xs text-on-surface-variant font-medium">/ {selectedProduct.unit}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h5 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                {isTel ? 'వివరణ' : 'Description'}
              </h5>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {selectedProduct.desc}
              </p>
            </div>

            {/* Price History Chart */}
            <div className="space-y-2 border-t border-outline-variant/20 pt-3">
              <div className="flex justify-between items-center">
                <h5 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  {isTel ? '6 నెలల ధరల ట్రెండ్' : '6-Month Price Trend'}
                </h5>
                <span className="text-[9px] font-bold text-primary bg-primary-container/10 px-2 py-0.5 rounded-full">
                  {isTel ? 'ధర విశ్లేషణ' : 'Price History'}
                </span>
              </div>

              {/* Chart line SVG */}
              <div className="h-28 w-full relative mt-2 border-b border-outline-variant/30 border-l border-outline-variant/30 bg-surface-container-low/50 rounded-lg p-2 overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="detailChartGrad" x1="0" x2="0" y1="0" y2="1">
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

                  <path d={selectedProduct.fillPoints} fill="url(#detailChartGrad)"></path>
                  <path d={selectedProduct.trendPoints} fill="none" stroke="#0d631b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  
                  {/* Circle nodes mapped exactly to coordinate points */}
                  {selectedProduct.coords.map((pt, idx) => (
                    <circle key={idx} cx={pt.x} cy={pt.y} fill={idx === 5 ? "#0d631b" : "#ffffff"} r="3" stroke="#0d631b" strokeWidth="1.5"></circle>
                  ))}
                </svg>
              </div>

              {/* Axis labels with prices */}
              <div className="flex justify-between px-1 font-semibold text-[9px] text-on-surface-variant tracking-wide">
                <div className="text-center"><span>Oct</span><span className="block text-[8px] text-outline font-semibold mt-0.5">{selectedProduct.monthlyPrices[0]}</span></div>
                <div className="text-center"><span>Nov</span><span className="block text-[8px] text-outline font-semibold mt-0.5">{selectedProduct.monthlyPrices[1]}</span></div>
                <div className="text-center"><span>Dec</span><span className="block text-[8px] text-outline font-semibold mt-0.5">{selectedProduct.monthlyPrices[2]}</span></div>
                <div className="text-center"><span>Jan</span><span className="block text-[8px] text-outline font-semibold mt-0.5">{selectedProduct.monthlyPrices[3]}</span></div>
                <div className="text-center"><span>Feb</span><span className="block text-[8px] text-outline font-semibold mt-0.5">{selectedProduct.monthlyPrices[4]}</span></div>
                <div className="text-center"><span>Mar</span><span className="block text-[8px] text-outline font-semibold mt-0.5">{selectedProduct.monthlyPrices[5]}</span></div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              {modalCartItem ? (
                <div 
                  className="w-full h-12 bg-primary text-white rounded-xl font-bold font-title-md text-title-md flex items-center justify-between px-4 shadow-sm"
                >
                  <button
                    onClick={() => updateCartQty(selectedProduct.id, -1)}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 active:scale-90 transition-transform flex items-center justify-center font-bold text-lg"
                  >
                    —
                  </button>
                  <span className="font-bold text-sm text-white">{modalCartItem.quantity}</span>
                  <button
                    onClick={() => updateCartQty(selectedProduct.id, 1)}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 active:scale-90 transition-transform flex items-center justify-center font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                  }}
                  className="w-full h-12 bg-primary text-white rounded-xl font-bold font-title-md text-title-md flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-sm">shopping_cart</span>
                  {t('addToCart')}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <button 
          onClick={() => setShowCart(true)}
          className="fixed bottom-[96px] right-md w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-30"
          aria-label="Open shopping cart"
        >
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          {/* Small badge with count */}
          <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-sm">
            {cartItemCount}
          </span>
        </button>
      )}

      {/* Cart Drawer Modal */}
      {showCart && (
        <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end">
          <div className="bg-surface-container-lowest rounded-t-[24px] p-lg max-h-[80%] flex flex-col shadow-xl border-t border-outline-variant/30 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_cart</span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  {isTel ? 'మీ బుట్ట' : 'Shopping Cart'}
                </h3>
              </div>
              <button 
                onClick={() => setShowCart(false)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto py-3 space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-surface rounded-xl p-3 border border-outline-variant/20">
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface font-bold">{item.title}</h4>
                    <p className="font-label-md text-label-md text-primary font-bold mt-0.5">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container-high rounded-lg p-1">
                    <button 
                      onClick={() => updateCartQty(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-outline hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="font-title-md text-title-md font-bold px-1">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQty(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-outline hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total & Checkout */}
            <div className="border-t border-outline-variant/30 pt-3 space-y-3">
              <div className="flex justify-between items-center font-title-md text-title-md font-semibold">
                <span className="text-on-surface-variant">{t('total')}</span>
                <span className="text-primary font-headline-lg-mobile text-headline-lg-mobile font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <button
                onClick={() => {
                  checkout();
                  setShowCart(false);
                }}
                className="w-full h-12 bg-primary text-white rounded-xl font-bold font-title-md text-title-md flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                {t('checkout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketScreen;
