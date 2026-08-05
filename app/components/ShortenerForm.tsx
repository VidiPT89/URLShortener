'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/hooks/useLanguage';

interface ShortenedUrlResponse {
  id: string;
  code: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
}

interface ShortenerFormProps {
  token?: string | null;
  onSuccess?: (url: ShortenedUrlResponse) => void;
}

export function ShortenerForm({ token, onSuccess }: ShortenerFormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<ShortenedUrlResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/urls', {
        method: 'POST',
        headers,
        body: JSON.stringify({ originalUrl: url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t.form.error);
      }

      const data = await response.json();
      setSuccess(data);
      setUrl('');
      onSuccess?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.form.error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!success) return;
    try {
      await navigator.clipboard.writeText(success.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Erro ao copiar para área de transferência');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-semibold text-gray-200">
            {t.form.placeholder}
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t.form.placeholder}
            className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/50 backdrop-blur-sm transition-all"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading || !url}
          className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/50 hover:shadow-orange-500/75 disabled:shadow-none"
        >
          {isLoading ? t.form.buttonLoading : `🔗 ${t.form.button}`}
        </motion.button>
      </form>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl backdrop-blur-sm"
        >
          <p className="text-red-400 text-sm font-medium">{error}</p>
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-6 bg-green-500/10 border border-green-500/50 rounded-xl backdrop-blur-sm space-y-4"
        >
          <p className="text-green-400 text-sm font-semibold">{t.form.success}</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={success.shortUrl}
              readOnly
              className="flex-1 px-4 py-3 bg-black/30 border border-green-500/30 rounded-lg text-green-300 text-sm font-mono focus:outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyToClipboard}
              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                copied
                  ? 'bg-green-500/30 text-green-300'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/40'
              }`}
            >
              {copied ? '✓ ' : '📋 '}
              {copied ? t.form.copied : t.form.copy}
            </motion.button>
          </div>
          <p className="text-xs text-gray-400">
            {t.urls.clicks}: 0 | Criada em: {new Date(success.createdAt).toLocaleDateString()}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
