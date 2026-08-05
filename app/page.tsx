'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/app/components/Header';
import { ShortenerForm } from '@/app/components/ShortenerForm';
import { UrlList } from '@/app/components/UrlList';
import { AuthForm } from '@/app/components/AuthForm';
import { useAuth } from '@/app/hooks/useAuth';

export default function Home() {
  const { user, token, logout, isLoading } = useAuth();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        isAuthenticated={!!user}
        userEmail={user?.email}
        onLogout={logout}
        onShowAuth={() => setShowAuthModal(true)}
      />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Encurtador de URLs 🔗
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Crie URLs encurtadas em segundos, acompanhe cliques e gerencie seus links
            </p>
          </section>

          {/* Features Section */}
          <section id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-bold text-gray-900 mb-2">Código Único</h3>
              <p className="text-sm text-gray-600">Gera códigos curtos únicos automaticamente</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-bold text-gray-900 mb-2">Redirecionamento</h3>
              <p className="text-sm text-gray-600">Redirecionamento rápido via API</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-gray-900 mb-2">Contador</h3>
              <p className="text-sm text-gray-600">Acompanhe quantos cliques cada link recebeu</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-bold text-gray-900 mb-2">Autenticação</h3>
              <p className="text-sm text-gray-600">Login opcional para gerenciar suas URLs</p>
            </div>
          </section>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Encurte sua URL</h2>
              <ShortenerForm token={token} onSuccess={handleUrlCreated} />
            </div>

            {/* Auth Section */}
            {!user && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-gray-600 text-center mb-6">
                  Faça login para gerenciar suas URLs
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Entrar / Cadastrar →
                </button>
              </div>
            )}
          </div>

          {/* URL List Section */}
          {user && (
            <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
              <UrlList token={token} refresh={refreshList} />
            </div>
          )}
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <AuthForm onSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">🔗 URLShortener - Encurtador de URLs</p>
          <p className="text-sm">
            Feito com Next.js + PostgreSQL + Prisma
          </p>
        </div>
      </footer>
    </div>
  );
}
