'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/app/hooks/useLanguage';
import type { Locale } from '@/app/i18n';

export function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage();

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'pt', label: 'PT', flag: '🇵🇹' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:border-orange-400/50 transition-colors"
    >
      {languages.map((lang) => (
        <motion.button
          key={lang.code}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLocale(lang.code)}
          className={`px-3 py-1.5 rounded-full transition-all text-sm font-medium flex items-center gap-1 ${
            locale === lang.code
              ? 'bg-gradient-to-r from-orange-400 to-yellow-500 text-white shadow-lg shadow-orange-500/50'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
