'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/hooks/useLanguage';

interface ShortenedUrl {
  id: string;
  code: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

interface UrlListProps {
  token: string | null;
  refresh?: boolean;
}

export function UrlList({ token, refresh }: UrlListProps) {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    if (!token) return;

    const fetchUrls = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/urls', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(t.urls.empty);
        }

        const data = await response.json();
        setUrls(data.urls || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrls();
  }, [token, refresh, t.urls.empty]);

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-6 bg-blue-500/10 border border-blue-500/50 rounded-xl backdrop-blur-sm"
      >
        <p className="text-blue-400 font-medium">{t.urls.loginRequired}</p>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
        <p className="text-gray-400 mt-2 text-sm">Carregando...</p>
      </div>
    );
  }

  if (error && urls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-6 bg-yellow-500/10 border border-yellow-500/50 rounded-xl backdrop-blur-sm"
      >
        <p className="text-yellow-400">{t.urls.empty}</p>
      </motion.div>
    );
  }

  if (urls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-6 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm"
      >
        <p className="text-gray-400">{t.urls.empty}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <h3 className="text-2xl font-bold text-white mb-6">{t.urls.title}</h3>
      <div className="grid gap-4">
        {urls.map((url, index) => (
          <motion.div
            key={url.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:border-orange-400/50 transition-all hover:shadow-lg hover:shadow-orange-500/20"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <a
                  href={`/${url.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-mono text-sm break-all transition-colors"
                >
                  🔗 {url.code}
                </a>
                <p className="text-xs text-gray-400 mt-1 truncate" title={url.originalUrl}>
                  {url.originalUrl}
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Cliques</p>
                  <p className="text-lg font-bold text-yellow-400">{url.clicks}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Criada</p>
                  <p className="text-xs text-gray-300">
                    {new Date(url.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
