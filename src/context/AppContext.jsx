import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 'en' or 'te'
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'dashboard', 'weather', etc.
  const [screenHistory, setScreenHistory] = useState([]);
  const [cart, setCart] = useState([]);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newVal = !prev;
      if (newVal) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newVal;
    });
  };

  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Urea Fertilizer', amount: 1850, category: 'Fertilizer', date: '2026-06-02' },
    { id: 2, name: 'Labor Charge', amount: 4500, category: 'Labor', date: '2026-06-05' },
    { id: 3, name: 'Chilli Seeds', amount: 2100, category: 'Seeds', date: '2026-06-08' },
    { id: 4, name: 'Tractor Hire', amount: 4000, category: 'Machinery', date: '2026-06-10' }
  ]);

  const [purchases, setPurchases] = useState([
    { id: 'ORD-5849', title: 'Urea Fertilizer (N46%)', brand: 'AgriChem Corp', price: 850, quantity: 1, date: 'June 12, 2026', status: 'Out for Delivery', icon: 'shopping_cart' },
    { id: 'ORD-3921', title: 'NPK 19:19:19 Water Soluble', brand: 'GrowMax', price: 1200, quantity: 2, date: 'June 10, 2026', status: 'Delivered', icon: 'shopping_cart' }
  ]);

  const [diagnoses, setDiagnoses] = useState([
    { id: 1, crop: 'Paddy / వరి', disease: 'Leaf Blast / ఆకు తెగులు', confidence: '94%', date: 'June 09, 2026', status: 'Resolved', recommendation: 'Spray Tricyclazole 75% WP (0.6g/L).' }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: 'Hello! I am AgriAssist, your voice farming partner. Ask me about weather, mandi prices, crop diseases, or fertilizer ratios.',
      teluguText: 'హలో! నేను అగ్రిఅసిస్ట్, మీ వాయిస్ వ్యవసాయ భాగస్వామిని. వాతావరణం, మార్కెట్ ధరలు, తెగుళ్ళు లేదా ఎరువుల నిష్పత్తి గురించి అడగండి.'
    }
  ]);

  // Screen transition with back stack logging
  const navigateTo = (screen) => {
    if (screen === 'login') {
      setScreenHistory([]);
    } else {
      setScreenHistory((prev) => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
  };

  const navigateBack = () => {
    if (screenHistory.length > 0) {
      const prevScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory((prev) => prev.slice(0, -1));
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('dashboard');
    }
  };

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const checkout = () => {
    if (cart.length === 0) return;
    const newPurchases = cart.map((item, index) => ({
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      title: item.title,
      brand: item.brand || 'AgriCorp',
      price: item.price,
      quantity: item.quantity,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Ordered (Processing)',
      icon: 'shopping_cart'
    }));
    setPurchases((prev) => [...newPurchases, ...prev]);
    setCart([]);
    navigateTo('purchases');
  };

  // Expenses operations
  const addExpense = (expense) => {
    setExpenses((prev) => [
      {
        id: prev.length + 1,
        ...expense,
        date: expense.date || new Date().toISOString().split('T')[0]
      },
      ...prev
    ]);
  };

  // Language translation dictionary
  const t = (key) => {
    const translations = {
      en: {
        appName: "AgriAssist AI",
        tagline: "Expert insights for high-tech harvest.",
        login: "Login",
        logout: "Logout",
        phone: "Phone Number",
        password: "Password",
        forgot: "Forgot password? Contact your shopkeeper",
        goodMorning: "Good morning, Rahul",
        overview: "Farm Overview • June 12th",
        humidity: "Hum",
        location: "Guntur, AP",
        temp: "28°",
        partlyCloudy: "Partly Cloudy",
        purchases: "Purchases",
        trackSupplies: "Track supplies",
        expenses: "Expenses",
        expenseSub: "₹12,450 this month",
        aiHelp: "AI Help",
        askAnything: "Ask anything",
        weather: "Weather",
        forecast: "7-day forecast",
        diseaseCheck: "Disease Check",
        scanCrop: "Scan crop leaves",
        notifications: "Notifications",
        newAlerts: "2 new alerts",
        home: "Home",
        market: "Market",
        alerts: "Alerts",
        priceHistory: "Price History",
        fertilizerHelp: "Fertility Calculator",
        safetyGuide: "Safety Guide",
        language: "EN/తె",
        back: "Back",
        currency: "₹",
        searchMarket: "Search fertilizers & seeds...",
        addToCart: "Add to Cart",
        checkout: "Checkout",
        total: "Total",
        emptyCart: "Your cart is empty",
        addExpenseBtn: "Add Expense",
        expenseName: "Item Name",
        expenseAmount: "Amount (₹)",
        expenseCategory: "Category",
        selectCategory: "Select Category",
        paddy: "Paddy",
        chilli: "Chilli",
        cotton: "Cotton",
        calculate: "Calculate",
        recommendation: "Recommendation"
      },
      te: {
        appName: "అగ్రిఅసిస్ట్ AI",
        tagline: "అధిక దిగుబడి కోసం నిపుణుల సలహాలు.",
        login: "లాగిన్ చేయండి",
        logout: "లాగ్అవుట్",
        phone: "ఫోన్ నంబర్",
        password: "పాస్‌వర్డ్",
        forgot: "పాస్‌వర్డ్ మర్చిపోయారా? మీ దుకాణదారుడిని సంప్రదించండి",
        goodMorning: "శుభోదయం, రాహుల్",
        overview: "పంటల వివరాలు • జూన్ 12",
        humidity: "తేమ",
        location: "గుంటూరు, ఆంధ్రప్రదేశ్",
        temp: "28°",
        partlyCloudy: "పాక్షికంగా మేఘావృతం",
        purchases: "కొనుగోళ్లు",
        trackSupplies: "సామగ్రి వివరాలు",
        expenses: "ఖర్చులు",
        expenseSub: "ఈ నెలలో ₹12,450",
        aiHelp: "AI సహాయం",
        askAnything: "ఏదైనా అడగండి",
        weather: "వాతావరణం",
        forecast: "7 రోజుల సూచన",
        diseaseCheck: "తెగులు పరీక్ష",
        scanCrop: "ఆకులను స్కాన్ చేయండి",
        notifications: "అలర్ట్స్",
        newAlerts: "2 కొత్త అలర్ట్స్",
        home: "హోమ్",
        market: "మార్కెట్",
        alerts: "అలర్ట్స్",
        priceHistory: "మార్కెట్ ధరలు",
        fertilizerHelp: "ఎరువుల క్యాలిక్యులేటర్",
        safetyGuide: "భద్రతా సూచనలు",
        language: "EN/తె",
        back: "వెనుకకు",
        currency: "₹",
        searchMarket: "ఎరువులు & విత్తనాల కోసం వెతకండి...",
        addToCart: "కార్ట్ లో జోడించు",
        checkout: "కొనుగోలు చేయి",
        total: "మొత్తం",
        emptyCart: "కార్ట్ ఖాళీగా ఉంది",
        addExpenseBtn: "ఖర్చు జోడించండి",
        expenseName: "వస్తువు పేరు",
        expenseAmount: "మొత్తం (₹)",
        expenseCategory: "వర్గం",
        selectCategory: "వర్గాన్ని ఎంచుకోండి",
        paddy: "వరి",
        chilli: "మిరప",
        cotton: "ప్రత్తి",
        calculate: "లెక్కించు",
        recommendation: "సిఫార్సు"
      }
    };
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      currentScreen,
      navigateTo,
      navigateBack,
      screenHistory,
      cart,
      addToCart,
      updateCartQty,
      isDark,
      toggleDarkMode,
      checkout,
      expenses,
      addExpense,
      purchases,
      setPurchases,
      diagnoses,
      setDiagnoses,
      chatMessages,
      setChatMessages,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};
