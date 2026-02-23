import { useLang } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import GeometricPattern from '@/components/GeometricPattern';
import blogBestProvider from '@/assets/blog-best-provider.png';
import blogFirstTask from '@/assets/blog-first-task.png';
import blogOnlineSafety from '@/assets/blog-online-safety.png';

const posts = [
  {
    slug: 'best-provider',
    image: blogBestProvider,
    de: { title: 'Wie man den besten Dienstleister findet', excerpt: 'Die Wahl des richtigen Dienstleisters kann den Unterschied zwischen einer stressfreien Erfahrung und einem Albtraum ausmachen.', date: '15. Februar 2026' },
    en: { title: 'How to Find the Best Service Provider', excerpt: 'Choosing the right service provider can make the difference between a stress-free experience and a nightmare.', date: 'February 15, 2026' },
  },
  {
    slug: 'first-task',
    image: blogFirstTask,
    de: { title: 'Tipps für die erste Auftragsstellung', excerpt: 'Sie möchten zum ersten Mal einen Auftrag erstellen? Mit diesen Tipps erhalten Sie schnell die besten Angebote.', date: '10. Februar 2026' },
    en: { title: 'Tips for Your First Task', excerpt: 'Want to create your first task? With these tips, you\'ll quickly receive the best offers.', date: 'February 10, 2026' },
  },
  {
    slug: 'online-safety',
    image: blogOnlineSafety,
    de: { title: 'Sicherheit bei Online-Aufträgen', excerpt: 'Online-Plattformen bieten viele Vorteile, aber Sicherheit sollte immer an erster Stelle stehen.', date: '5. Februar 2026' },
    en: { title: 'Safety with Online Tasks', excerpt: 'Online platforms offer many advantages, but safety should always come first.', date: 'February 5, 2026' },
  },
];

export default function BlogPreview() {
  const { lang } = useLang();

  return (
    <section className="relative py-16 md:py-24 bg-muted/30 overflow-hidden">
      <GeometricPattern color="hsl(0 0% 80% / 0.15)" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-4"
        >
          Blog
        </motion.h2>
        <p className="text-center text-muted-foreground mb-12">
          {lang === 'de' ? 'Tipps, Ratgeber und Neuigkeiten' : 'Tips, guides and news'}
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {posts.map((post, i) => {
            const content = post[lang];
            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <div className="rounded-xl bg-card border border-border overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={content.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-base font-display font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {content.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
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
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary border border-primary/40 rounded-full px-6 py-2.5 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {lang === 'de' ? 'Alle Artikel ansehen' : 'View all articles'} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
