'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale, defaultLocale } from '@/app/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof translations)[Locale];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Carrega o idioma salvo no localStorage ou usa o padrão
    const saved = localStorage.getItem('language') as Locale | null;
    if (saved && (saved === 'pt' || saved === 'en')) {
      setLocale(saved);
    }
    setIsClient(true);
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('language', newLocale);
  };

  if (!isClient) {
    return children;
  }

  return React.createElement(
    LanguageContext.Provider,
    { value: { locale, setLocale: handleSetLocale, t: translations[locale] } },
    children
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return default translation during SSR
    return {
      locale: defaultLocale,
      setLocale: () => {},
      t: translations[defaultLocale],
    };
  }
  return context;
}
