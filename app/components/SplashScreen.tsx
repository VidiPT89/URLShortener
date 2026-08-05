'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/hooks/useLanguage';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Mostrar splash screen por 3.5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Dar tempo para a animação de saída
      setTimeout(onComplete, 500);
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-black via-black to-black"
        >
          {/* Logo/Título animado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <div className="text-6xl">🔗</div>
            </motion.div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 mb-2">
              URLShortener
            </h1>
            <p className="text-lg text-gray-400">{t.app.tagline}</p>
          </motion.div>

          {/* Descrição */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center text-gray-300 max-w-md mb-16 text-base leading-relaxed"
          >
            {t.app.description}
          </motion.p>

          {/* Créditos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-center space-y-6"
          >
            <div>
              <p className="text-sm text-gray-500 mb-1">{t.credits.developedBy}</p>
              <p className="text-lg font-semibold text-orange-400">David Arsénio Martins</p>
            </div>

            <div className="border-t border-gray-700 pt-6 flex flex-col gap-3 items-center">
              <a
                href="https://ividi.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                <span>{t.credits.website}</span>
                <span>→</span>
              </a>
              <a
                href="https://github.com/VidiPT89/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <span>{t.credits.github}</span>
                <span>→</span>
              </a>
            </div>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="absolute bottom-16 flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                className="w-1 h-6 bg-gradient-to-t from-orange-400 to-yellow-500 rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
