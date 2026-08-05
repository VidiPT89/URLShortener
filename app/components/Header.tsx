'use client';

import { useState } from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
  userEmail?: string;
  onLogout?: () => void;
  onShowAuth?: () => void;
}

export function Header({ isAuthenticated, userEmail, onLogout, onShowAuth }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">🔗 URLShortener</h1>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded">v1.0</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="hover:text-blue-200 transition">
            Home
          </a>
          <a href="#features" className="hover:text-blue-200 transition">
            Recursos
          </a>
        </nav>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded transition"
          >
            {isAuthenticated ? (
              <>
                <span className="hidden sm:inline text-sm">{userEmail}</span>
                <span>👤</span>
              </>
            ) : (
              <>
                <span>Entrar</span>
                <span>→</span>
              </>
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden z-10">
              <div className="p-2">
                {isAuthenticated ? (
                  <>
                    <p className="px-4 py-2 text-sm text-gray-600">{userEmail}</p>
                    <button
                      onClick={() => {
                        onLogout?.();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 font-medium transition"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      onShowAuth?.();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600 font-medium transition"
                  >
                    Entrar / Cadastrar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
