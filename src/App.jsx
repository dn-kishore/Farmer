import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import MobileFrame from './components/MobileFrame';
import Header from './components/Header';
import NavBar from './components/NavBar';

// Import Screens
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import WeatherScreen from './screens/WeatherScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import AlertsScreen from './screens/AlertsScreen';
import CropDiagnosisScreen from './screens/CropDiagnosisScreen';
import PurchasesScreen from './screens/PurchasesScreen';
import MarketScreen from './screens/MarketScreen';
import AiHelpScreen from './screens/AiHelpScreen';
import PriceHistoryScreen from './screens/PriceHistoryScreen';
import FertilizerHelpScreen from './screens/FertilizerHelpScreen';
import SafetyGuideScreen from './screens/SafetyGuideScreen';

const ScreenContent = () => {
  const { currentScreen, isDark } = useApp();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'weather':
        return <WeatherScreen />;
      case 'expenses':
        return <ExpensesScreen />;
      case 'alerts':
        return <AlertsScreen />;
      case 'crop_diagnosis':
        return <CropDiagnosisScreen />;
      case 'purchases':
        return <PurchasesScreen />;
      case 'market':
        return <MarketScreen />;
      case 'ai_help':
        return <AiHelpScreen />;
      case 'price_history':
        return <PriceHistoryScreen />;
      case 'fertilizer_help':
        return <FertilizerHelpScreen />;
      case 'safety_guide':
        return <SafetyGuideScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className={`flex-grow flex flex-col h-full bg-background ${isDark ? 'dark' : ''}`}>
      <Header />
      <div className="flex-grow overflow-y-auto">
        {renderActiveScreen()}
      </div>
      <NavBar />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MobileFrame>
        <ScreenContent />
      </MobileFrame>
    </AppProvider>
  );
}

export default App;
