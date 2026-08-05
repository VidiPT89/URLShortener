import { pt } from './pt';
import { en } from './en';

export type Locale = 'pt' | 'en';

export const translations = {
  pt,
  en,
};

export const defaultLocale: Locale = 'pt';

export function getTranslation(locale: Locale = defaultLocale) {
  return translations[locale] || translations[defaultLocale];
}
