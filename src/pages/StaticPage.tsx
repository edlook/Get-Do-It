import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLang } from '@/contexts/LanguageContext';

interface StaticPageProps {
  titleKey: string;
  children?: React.ReactNode;
}

const staticContent: Record<string, { de: string; en: string }> = {
  faq: { de: 'Häufige Fragen', en: 'FAQ' },
  contact: { de: 'Kontakt', en: 'Contact' },
  terms: { de: 'Nutzungsbedingungen', en: 'Terms of Service' },
  privacy: { de: 'Datenschutz', en: 'Privacy Policy' },
  about: { de: 'Über uns', en: 'About Us' },
  blog: { de: 'Blog', en: 'Blog' },
};

export default function StaticPage({ titleKey }: StaticPageProps) {
  const { lang } = useLang();
  const title = staticContent[titleKey]?.[lang] ?? titleKey;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-3xl font-display font-bold mb-6">{title}</h1>
        <p className="text-muted-foreground">
          {lang === 'de'
            ? 'Diese Seite wird in Kürze verfügbar sein.'
            : 'This page will be available soon.'}
        </p>
      </main>
      <Footer />
    </div>
  );
}
