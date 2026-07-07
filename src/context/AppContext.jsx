import React, { createContext, useState, useEffect, useContext } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { CapacitorUpdater } from '@capgo/capacitor-updater';
import { Capacitor } from '@capacitor/core';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 'en' or 'te'
  const [currentScreen, setCurrentScreen] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true' ? 'dashboard' : 'login';
  });
  const [screenHistory, setScreenHistory] = useState([]);
  const [fertilizerHelpMode, setFertilizerHelpMode] = useState('recommendation'); // 'recommendation' or 'quantity'
  const [cart, setCart] = useState([]);
  const [isDark, setIsDark] = useState(false);
  const getCachedWeatherData = () => {
    const defaultData = {
      temp: null,
      humidity: null,
      windSpeed: null,
      condition: null,
      teluguCondition: null,
      location: null,
      teluguLocation: null,
      icon: 'partly_cloudy_day',
      loading: false,
      error: null
    };

    try {
      const cached = localStorage.getItem('weatherCache');
      const savedLoc = localStorage.getItem('weatherLocation');
      if (cached && savedLoc) {
        const parsed = JSON.parse(cached);
        // Cache weather data for 30 minutes (30 * 60 * 1000 ms)
        const isFresh = Date.now() - parsed.timestamp < 30 * 60 * 1000;
        if (isFresh && parsed.location === savedLoc) {
          return {
            ...parsed,
            loading: false,
            error: null
          };
        }
      }
      if (savedLoc) {
        return {
          ...defaultData,
          location: savedLoc,
          teluguLocation: savedLoc,
          loading: true
        };
      }
    } catch (e) {
      console.warn('Failed to parse cached weather', e);
    }
    return defaultData;
  };

  const [weatherData, setWeatherData] = useState(getCachedWeatherData);

  const saveWeatherToCache = (data) => {
    try {
      localStorage.setItem('weatherLocation', data.location);
      localStorage.setItem('weatherCache', JSON.stringify({
        ...data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save weather cache', e);
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e7d96cb598ba84ac3c1fb223a233c543&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch weather');
      const data = await res.json();
      
      let iconName = 'partly_cloudy_day';
      const cond = data.weather[0].main;
      if (cond === 'Clear') iconName = 'clear_day';
      else if (cond === 'Rain' || cond === 'Drizzle') iconName = 'rainy';
      else if (cond === 'Thunderstorm') iconName = 'thunderstorm';
      else if (cond === 'Snow') iconName = 'weather_snowy';
      else if (cond === 'Clouds') iconName = 'cloudy';

      const conditionMap = {
        'Clear': { en: 'Sunny', te: 'ఎండగా ఉంటుంది' },
        'Rain': { en: 'Rainy', te: 'వర్షం పడుతుంది' },
        'Drizzle': { en: 'Drizzle', te: 'చినుకులు' },
        'Thunderstorm': { en: 'Thunderstorm', te: 'ఉరుములతో కూడిన వర్షం' },
        'Clouds': { en: 'Cloudy', te: 'మేఘావృతం' },
        'Atmosphere': { en: 'Hazy', te: 'పొగమంచు' },
        'Mist': { en: 'Mist', te: 'పొగమంచు' },
        'Haze': { en: 'Hazy', te: 'పొగమంచు' },
        'Fog': { en: 'Foggy', te: 'పొగమంచు' }
      };

      const mappedCond = conditionMap[cond] || { en: cond, te: cond };

      const newWeatherData = {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        condition: mappedCond.en,
        teluguCondition: mappedCond.te,
        location: data.name,
        teluguLocation: data.name,
        icon: iconName,
        loading: false,
        error: null
      };

      setWeatherData(newWeatherData);
      saveWeatherToCache(newWeatherData);
    } catch (err) {
      console.error(err);
      setWeatherData(prev => ({ ...prev, loading: false }));
    }
  };

  const refreshWeatherWithGps = async () => {
    setWeatherData(prev => ({ ...prev, loading: true, error: null }));
    
    const tryWebGeolocation = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Browser does not support geolocation'));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (err) => reject(err),
          { enableHighAccuracy: false, timeout: 8000 }
        );
      });
    };

    try {
      let position;
      try {
        const perm = await Geolocation.checkPermissions();
        if (perm.location !== 'granted') {
          const req = await Geolocation.requestPermissions();
          if (req.location !== 'granted') {
            throw new Error('Location permission not granted');
          }
        }
        position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 8000
        });
      } catch (capErr) {
        console.warn('Capacitor Geolocation failed, trying web browser fallback...', capErr);
        position = await tryWebGeolocation();
      }

      await fetchWeather(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error('All geolocation attempts failed:', error);
      setWeatherData(prev => ({ 
        ...prev, 
        loading: false, 
        error: language === 'te' 
          ? 'GPS పని చేయడం లేదు. దయచేసి మీ ప్రాంతాన్ని వెతకండి.' 
          : 'GPS location detection failed. Please search for your town manually.' 
      }));
    }
  };

  const fetchWeatherByCity = async (cityName, bypassCache = false) => {
    try {
      if (!bypassCache) {
        const cached = localStorage.getItem('weatherCache');
        const savedLoc = localStorage.getItem('weatherLocation');
        if (cached && savedLoc && savedLoc.toLowerCase() === cityName.toLowerCase()) {
          const parsed = JSON.parse(cached);
          const isFresh = Date.now() - parsed.timestamp < 30 * 60 * 1000;
          if (isFresh) {
            setWeatherData({
              ...parsed,
              loading: false,
              error: null
            });
            return true;
          }
        }
      }

      setWeatherData(prev => ({ ...prev, loading: true, error: null }));
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=e7d96cb598ba84ac3c1fb223a233c543&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('City not found');
      const data = await res.json();
      
      let iconName = 'partly_cloudy_day';
      const cond = data.weather[0].main;
      if (cond === 'Clear') iconName = 'clear_day';
      else if (cond === 'Rain' || cond === 'Drizzle') iconName = 'rainy';
      else if (cond === 'Thunderstorm') iconName = 'thunderstorm';
      else if (cond === 'Snow') iconName = 'weather_snowy';
      else if (cond === 'Clouds') iconName = 'cloudy';

      const conditionMap = {
        'Clear': { en: 'Sunny', te: 'ఎండగా ఉంటుంది' },
        'Rain': { en: 'Rainy', te: 'వర్షం పడుతుంది' },
        'Drizzle': { en: 'Drizzle', te: 'చినుకులు' },
        'Thunderstorm': { en: 'Thunderstorm', te: 'ఉరుములతో కూడిన వర్షం' },
        'Clouds': { en: 'Cloudy', te: 'మేఘావృతం' },
        'Atmosphere': { en: 'Hazy', te: 'పొగమంచు' },
        'Mist': { en: 'Mist', te: 'పొగమంచు' },
        'Haze': { en: 'Hazy', te: 'పొగమంచు' },
        'Fog': { en: 'Foggy', te: 'పొగమంచు' }
      };

      const mappedCond = conditionMap[cond] || { en: cond, te: cond };

      const newWeatherData = {
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        condition: mappedCond.en,
        teluguCondition: mappedCond.te,
        location: data.name,
        teluguLocation: data.name,
        icon: iconName,
        loading: false,
        error: null
      };

      setWeatherData(newWeatherData);
      saveWeatherToCache(newWeatherData);
      return true;
    } catch (err) {
      console.error(err);
      setWeatherData(prev => ({ ...prev, loading: false, error: 'Location not found' }));
      return false;
    }
  };

  const clearWeatherLocation = () => {
    localStorage.removeItem('weatherLocation');
    localStorage.removeItem('weatherCache');
    setWeatherData({
      temp: null,
      humidity: null,
      windSpeed: null,
      condition: null,
      teluguCondition: null,
      location: null,
      teluguLocation: null,
      icon: 'partly_cloudy_day',
      loading: false,
      error: null
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem('weatherLocation');
    if (saved) {
      fetchWeatherByCity(saved, false);
    } else {
      setWeatherData((prev) => ({ ...prev, loading: false, location: null }));
    }
  }, []);

  // Live OTA Web Updates
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const checkForUpdates = async () => {
        try {
          // Notify app is ready to prevent rolling back to previous version
          await CapacitorUpdater.notifyAppReady();

          // Get current version dynamically
          const currentBundle = await CapacitorUpdater.current();
          const currentWebVersion = currentBundle.version || '1.0.0';
          console.log('Current active bundle version:', currentWebVersion);

          // Check update version descriptor from your server
          const response = await fetch('https://raw.githubusercontent.com/dn-kishore/agriassist-ota/main/version.json');
          if (!response.ok) return;
          const manifest = await response.json();
          
          if (manifest.version !== currentWebVersion && manifest.url) {
            console.log('Downloading OTA update version:', manifest.version);
            const version = await CapacitorUpdater.download({
              url: manifest.url,
              version: manifest.version,
            });
            console.log('OTA update downloaded. Swapping build...');
            await CapacitorUpdater.set(version);
          }
        } catch (err) {
          console.warn('OTA update check failed:', err);
        }
      };
      checkForUpdates();
    }
  }, []);

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

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setScreenHistory([]);
    setCurrentScreen('login');
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
        recommendation: "Recommendation",
        fertilizerRecommendation: "Fertilizer Recommendation",
        quantityCalculator: "Quantity Calculator"
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
        recommendation: "సిఫార్సు",
        fertilizerRecommendation: "ఎరువుల సిఫార్సు",
        quantityCalculator: "పరిమాణ క్యాలిక్యులేటర్"
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
      t,
      logout,
      fertilizerHelpMode,
      setFertilizerHelpMode,
      weatherData,
      setWeatherData,
      refreshWeatherWithGps,
      fetchWeatherByCity,
      clearWeatherLocation
    }}>
      {children}
    </AppContext.Provider>
  );
};
