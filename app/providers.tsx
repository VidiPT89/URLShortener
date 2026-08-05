'use client';

import { LanguageProvider } from "@/app/hooks/useLanguage";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
