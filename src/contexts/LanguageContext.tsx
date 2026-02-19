import { createContext, useContext, useState, ReactNode } from 'react';
import { Lang, t, Translations } from '@/lib/i18n';

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tr: Translations;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('de');
  const tr = t(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
