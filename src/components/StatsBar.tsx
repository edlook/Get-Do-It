import { useLang } from '@/contexts/LanguageContext';
import { CheckCircle, Shield, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import CitySkyline from '@/components/CitySkylline';

export default function StatsBar() {
  const { tr } = useLang();

  const stats = [
    { icon: Users, title: tr.stats.providers, desc: tr.stats.providersDesc },
    { icon: Briefcase, title: tr.stats.services, desc: tr.stats.servicesDesc },
    { icon: CheckCircle, title: tr.stats.years, desc: tr.stats.yearsDesc },
    { icon: Shield, title: tr.stats.payment, desc: tr.stats.paymentDesc },
  ];

  return (
    <section className="relative bg-accent text-accent-foreground overflow-hidden">
      <CitySkyline className="absolute bottom-0 left-0 w-full h-40 opacity-50" />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-foreground/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-display font-bold text-sm">{stat.title}</p>
                <p className="text-xs opacity-80 mt-0.5">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
