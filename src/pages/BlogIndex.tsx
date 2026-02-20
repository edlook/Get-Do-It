import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLang } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar } from 'lucide-react';

const posts = [
  {
    slug: 'best-provider',
    image: '🔍',
    de: {
      title: 'Wie man den besten Dienstleister findet',
      excerpt: 'Die Wahl des richtigen Dienstleisters kann den Unterschied zwischen einer stressfreien Erfahrung und einem Albtraum ausmachen.',
      date: '15. Februar 2026',
    },
    en: {
      title: 'How to Find the Best Service Provider',
      excerpt: 'Choosing the right service provider can make the difference between a stress-free experience and a nightmare.',
      date: 'February 15, 2026',
    },
  },
  {
    slug: 'first-task',
    image: '📝',
    de: {
      title: 'Tipps für die erste Auftragsstellung',
      excerpt: 'Sie möchten zum ersten Mal einen Auftrag erstellen? Mit diesen Tipps erhalten Sie schnell die besten Angebote.',
      date: '10. Februar 2026',
    },
    en: {
      title: 'Tips for Your First Task',
      excerpt: 'Want to create your first task? With these tips, you\'ll quickly receive the best offers.',
      date: 'February 10, 2026',
    },
  },
  {
    slug: 'online-safety',
    image: '🛡️',
    de: {
      title: 'Sicherheit bei Online-Aufträgen',
      excerpt: 'Online-Plattformen bieten viele Vorteile, aber Sicherheit sollte immer an erster Stelle stehen.',
      date: '5. Februar 2026',
    },
    en: {
      title: 'Safety with Online Tasks',
      excerpt: 'Online platforms offer many advantages, but safety should always come first.',
      date: 'February 5, 2026',
    },
  },
];

export default function BlogIndex() {
  const { lang } = useLang();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-foreground">
          Blog
        </h1>
        <p className="text-muted-foreground mb-10">
          {lang === 'de'
            ? 'Tipps, Ratgeber und Neuigkeiten rund um GetDoIt'
            : 'Tips, guides and news about GetDoIt'}
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => {
            const content = post[lang];
            return (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="text-5xl mb-4">{post.image}</div>
                    <h2 className="text-lg font-display font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {content.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {content.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {content.date}
                      </span>
                      <span className="inline-flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {lang === 'de' ? 'Lesen' : 'Read'} <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
