'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import { useLanguage } from '@/app/hooks/useLanguage';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      setEmail('');
      setPassword('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 mb-8"
        >
          {mode === 'login' ? t.auth.login : t.auth.register}
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-200">
              {t.auth.email}
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/50 backdrop-blur-sm transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
              {t.auth.password}
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.passwordMin}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/50 backdrop-blur-sm transition-all"
              required
              minLength={6}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full mt-6 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 disabled:shadow-none"
          >
            {isLoading ? t.auth.processing : t.auth.submit}
          </motion.button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg backdrop-blur-sm"
          >
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 pt-6 border-t border-white/10 text-center"
        >
          <p className="text-sm text-gray-400 mb-3">
            {mode === 'login' ? t.auth.noAccount : t.auth.hasAccount}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
          >
            {mode === 'login' ? t.auth.signUp : t.auth.signIn}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
