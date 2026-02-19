import { useLang } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {tr.categories[key]}
                </span>
              </motion.a>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <a href="#" className="text-sm font-semibold text-primary hover:underline">
            {tr.categories.viewAll} →
          </a>
        </div>
      </div>
    </section>
  );
}
