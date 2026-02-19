import { useLang } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GeometricPattern from '@/components/GeometricPattern';
import {
  Truck, Hammer, Package, Sparkles, Monitor, Camera,
  Code, Wrench, PartyPopper, Palette, Headphones, Smartphone,
  Heart, Scale, Car, GraduationCap
} from 'lucide-react';

const categoryIcons = [
  'courier', 'renovation', 'moving', 'cleaning', 'computer', 'photo',
  'software', 'appliance', 'events', 'design', 'assistant', 'repair',
  'beauty', 'legal', 'auto', 'tutoring'
] as const;

const iconMap: Record<string, any> = {
  courier: Package, renovation: Hammer, moving: Truck, cleaning: Sparkles,
  computer: Monitor, photo: Camera, software: Code, appliance: Wrench,
  events: PartyPopper, design: Palette, assistant: Headphones, repair: Smartphone,
  beauty: Heart, legal: Scale, auto: Car, tutoring: GraduationCap,
};

export default function AllCategories() {
  const { tr } = useLang();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 relative overflow-hidden">
        <GeometricPattern color="hsl(0 0% 80% / 0.2)" />
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground">
              {tr.categories.title}
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">{tr.categories.subtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {categoryIcons.map((key, i) => {
              const Icon = iconMap[key];
              return (
                <motion.a
                  href="#"
                  key={key}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl bg-card border border-border hover:border-accent/40 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                    {tr.categories[key]}
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
