'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/hooks/useLanguage';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout?: () => void;
  onShowAuth?: () => void;
}

export function Header({ isAuthenticated, userEmail, onLogout, onShowAuth }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="text-3xl">🔗</div>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
              URLShortener
            </h1>
            <p className="text-xs text-gray-400">v1.0</p>
          </div>
        </motion.div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-gray-300 hover:text-orange-400 transition-colors text-sm font-medium">
            {t.nav.home}
          </a>
          <a href="#features" className="text-gray-300 hover:text-orange-400 transition-colors text-sm font-medium">
            {t.nav.features}
          </a>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <LanguageSelector />

          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-medium text-gray-200 border border-white/10 hover:border-orange-400/50"
            >
              {isAuthenticated ? (
                <>
                  <span className="hidden sm:inline">{userEmail}</span>
                  <span>👤</span>
                </>
              ) : (
                <>
                  <span>{t.auth.toggle}</span>
                  <span>→</span>
                </>
              )}
            </motion.button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-black/80 backdrop-blur-xl text-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/10"
                >
                  <div className="p-4 space-y-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-white/10 mb-2">
                          <p className="text-xs text-gray-400">{t.auth.email}</p>
                          <p className="text-sm font-medium text-orange-400">{userEmail}</p>
                        </div>
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}
                          onClick={() => {
                            onLogout?.();
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 rounded-lg text-red-400 hover:text-red-300 font-medium transition-all"
                        >
                          {t.auth.logout}
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}
                        onClick={() => {
                          onShowAuth?.();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg text-orange-400 hover:text-orange-300 font-medium transition-all"
                      >
                        {t.auth.toggle}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
