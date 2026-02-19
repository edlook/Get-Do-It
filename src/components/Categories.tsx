import { useLang } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
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
  courier: Package,
  renovation: Hammer,
  moving: Truck,
  cleaning: Sparkles,
  computer: Monitor,
  photo: Camera,
  software: Code,
  appliance: Wrench,
  events: PartyPopper,
  design: Palette,
  assistant: Headphones,
  repair: Smartphone,
  beauty: Heart,
  legal: Scale,
  auto: Car,
  tutoring: GraduationCap,
};

export default function Categories() {
  const { tr } = useLang();

  return (
    <section className="relative py-16 md:py-24 bg-background overflow-hidden">
      <GeometricPattern color="hsl(0 0% 80% / 0.2)" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            {tr.categories.title}
          </h2>
          <p className="text-muted-foreground mt-2">{tr.categories.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {categoryIcons.map((key, i) => {
            const Icon = iconMap[key];
            return (
              <motion.a
                href="#"
                key={key}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  {tr.categories[key]}
                </span>
              </motion.a>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <a href="/categories" className="text-sm font-semibold text-accent hover:underline cursor-pointer">
            {tr.categories.viewAll} →
          </a>
        </div>
      </div>
    </section>
  );
}
