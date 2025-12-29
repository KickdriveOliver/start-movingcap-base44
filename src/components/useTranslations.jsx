import React, { useState, useEffect, createContext, useContext } from 'react';

// Import static translation data
import { en, de, it, fr } from './i18n/translations';

// Static translations map - loaded synchronously
const translationsMap = { en, de, it, fr };

// Create a context for translations
const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem('language') || 'en'
  );

  useEffect(() => {
    localStorage.setItem('language', currentLang);
  }, [currentLang]);

  const t = (key) => {
    const langData = translationsMap[currentLang] || translationsMap.en;
    return langData[key] || translationsMap.en[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, currentLang, setLanguage: setCurrentLang, isLoading: false }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    // Fallback for components outside provider - use English directly
    return {
      t: key => translationsMap.en[key] || key,
      currentLang: 'en',
      setLanguage: () => {},
      isLoading: false
    };
  }
  return context;
}

// Default export utility function
const translationsUtil = {
  useTranslations,
  TranslationProvider
};

export default translationsUtil;