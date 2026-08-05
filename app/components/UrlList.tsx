'use client';

import { useEffect, useState } from 'react';

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
          throw new Error('Erro ao carregar URLs');
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
  }, [token, refresh]);

  if (!token) {
    return (
      <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700">Faça login para ver suas URLs encurtadas</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center text-gray-500">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">Nenhuma URL encurtada ainda. Comece criando uma!</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Minhas URLs Encurtadas</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-4 py-2 text-left font-semibold text-gray-700">URL Curta</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">URL Original</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Cliques</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Criada em</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <a
                    href={`/${url.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-mono text-sm break-all"
                  >
                    {url.code}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 truncate" title={url.originalUrl}>
                  {url.originalUrl}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  {url.clicks}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(url.createdAt).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
