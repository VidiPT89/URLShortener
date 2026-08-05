'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/app/components/Header';
import { ShortenerForm } from '@/app/components/ShortenerForm';
import { UrlList } from '@/app/components/UrlList';
import { AuthForm } from '@/app/components/AuthForm';
import { SplashScreen } from '@/app/components/SplashScreen';
import { useAuth } from '@/app/hooks/useAuth';
import { useLanguage } from '@/app/hooks/useLanguage';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { user, token, logout, isLoading } = useAuth();
  const { t } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setRefreshList(!refreshList);
  };

  const handleUrlCreated = () => {
    if (user) {
      setRefreshList(!refreshList);
    }
  };

  if (isLoading && showSplash) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <SplashScreen onComplete={() => setShowSplash(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-black text-white">
      <SplashScreen onComplete={() => setShowSplash(false)} />

      <Header
        isAuthenticated={!!user}
        userEmail={user?.email}
        onLogout={logout}
        onShowAuth={() => setShowAuthModal(true)}
      />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-20">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-400 mb-6"
            >
              {t.hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              {t.hero.subtitle}
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              href="#shortener"
              className="inline-block px-8 py-4 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-bold rounded-full shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 transition-all hover:scale-105"
            >
              {t.hero.cta} →
            </motion.a>
          </section>

          {/* Features Section */}
          <section id="features" className="mb-20">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center text-white mb-16"
            >
              {t.nav.features}
            </motion.h2>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { key: 'unique', icon: '✨' },
                { key: 'redirect', icon: '🚀' },
                { key: 'analytics', icon: '📊' },
                { key: 'auth', icon: '🔒' },
              ].map(({ key, icon }) => (
                <motion.div
                  key={key}
                  variants={item}
                  className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-orange-400/50 hover:bg-white/15 transition-all hover:shadow-lg hover:shadow-orange-500/20"
                >
                  <div className="text-4xl mb-4">{icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {t.features[key as keyof typeof t.features].title}
                  </h3>
                  <p className="text-gray-400">
                    {t.features[key as keyof typeof t.features].description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Main Content */}
          <section id="shortener" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 p-8 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl"
            >
              <h2 className="text-3xl font-bold text-white mb-8">{t.form.button}</h2>
              <ShortenerForm token={token} onSuccess={handleUrlCreated} />
            </motion.div>

            {/* Auth Section */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 bg-gradient-to-br from-orange-500/20 to-yellow-500/10 backdrop-blur-xl rounded-2xl border border-orange-400/30 shadow-2xl shadow-orange-500/20"
              >
                <h3 className="text-xl font-bold text-white mb-4">{t.auth.toggle}</h3>
                <p className="text-gray-300 text-sm mb-6">
                  Faça login para gerenciar e acompanhar suas URLs
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75"
                >
                  {t.auth.toggle} →
                </motion.button>
              </motion.div>
            )}
          </section>

          {/* URL List Section */}
          {user && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl"
            >
              <UrlList token={token} refresh={refreshList} />
            </motion.section>
          )}
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md"
          >
            <div className="relative">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-red-500/20 hover:bg-red-500/40 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-all border border-red-500/50"
              >
                ✕
              </button>
              <AuthForm onSuccess={handleAuthSuccess} />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-gray-400">
            {t.footer.madePossible}
          </p>
          <p className="text-xs text-gray-500">
            © 2026 {t.footer.rights}
          </p>
        </div>
      </footer>
    </div>
  );
}
