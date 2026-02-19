import { useLang } from '@/contexts/LanguageContext';
import { CheckCircle, Shield, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsBar() {
  const { tr } = useLang();

  const stats = [
    { icon: Users, title: tr.stats.providers, desc: tr.stats.providersDesc },
    { icon: Briefcase, title: tr.stats.services, desc: tr.stats.servicesDesc },
    { icon: CheckCircle, title: tr.stats.years, desc: tr.stats.yearsDesc },
    { icon: Shield, title: tr.stats.payment, desc: tr.stats.paymentDesc },
  ];

  return (
    <section className="bg-card border-y border-border">
      <div className="container mx-auto px-4 py-10">
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
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
