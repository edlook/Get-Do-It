import { useLang } from '@/contexts/LanguageContext';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImg from '@/assets/hero-illustration.png';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const { tr } = useLang();
  const [search, setSearch] = useState('');

  return (
    <section className="relative overflow-hidden bg-brand-light">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-display font-bold text-foreground leading-tight"
          >
            {tr.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            {tr.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex items-center bg-card rounded-xl shadow-lg border border-border overflow-hidden"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tr.hero.searchPlaceholder}
              className="flex-1 px-5 py-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
            />
            <Button className="m-1.5 px-6 py-3 h-auto rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              <Search className="h-4 w-4 mr-2" />
              {tr.hero.searchButton}
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-sm text-muted-foreground"
          >
            {tr.hero.example}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <a
              href="#"
              className="inline-block mt-6 text-sm font-medium text-accent border border-accent/30 rounded-full px-5 py-2.5 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {tr.hero.becomeProvider}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Hero illustration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] hidden lg:block">
        <motion.img
          src={heroImg}
          alt="Service professionals"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
