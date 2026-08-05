'use client';

import { useState } from 'react';

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
        throw new Error(error.error || 'Erro ao encurtar URL');
      }

      const data = await response.json();
      setSuccess(data);
      setUrl('');
      onSuccess?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
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
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Cole sua URL aqui
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemplo.com/pagina-muito-longa"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !url}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors"
        >
          {isLoading ? 'Encurtando...' : 'Encurtar URL 🔗'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">URL encurtada com sucesso!</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={success.shortUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm font-mono"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              {copied ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Cliques: {success.createdAt ? new Date(success.createdAt).toLocaleDateString('pt-BR') : 'Agora'}
          </p>
        </div>
      )}
    </div>
  );
}
