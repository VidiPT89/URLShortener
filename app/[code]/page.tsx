'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectPageProps {
  params: Promise<{ code: string }>;
}

export default function RedirectPage({ params }: RedirectPageProps) {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const { code } = await params;

      try {
        // Faz a requisição para a API que vai buscar a URL e contar clique
        const response = await fetch(`/api/redirect/${code}`, {
          redirect: 'follow',
        });

        // A API retorna um redirect, mas como estamos no cliente,
        // fazemos manualmente aqui
        if (response.ok && response.url) {
          window.location.href = response.url;
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Erro ao redirecionar:', error);
        router.push('/');
      }
    };

    redirect();
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
}
