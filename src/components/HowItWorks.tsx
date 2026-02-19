import { useLang } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, UserCheck } from 'lucide-react';
import GeometricPattern from '@/components/GeometricPattern';

export default function HowItWorks() {
  const { tr } = useLang();

  const steps = [
    { icon: FileText, title: tr.howItWorks.step1title, desc: tr.howItWorks.step1desc, num: '01' },
    { icon: MessageSquare, title: tr.howItWorks.step2title, desc: tr.howItWorks.step2desc, num: '02' },
    { icon: UserCheck, title: tr.howItWorks.step3title, desc: tr.howItWorks.step3desc, num: '03' },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-brand-light overflow-hidden">
      <GeometricPattern color="hsl(37 84% 53% / 0.12)" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            {tr.howItWorks.title}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            {tr.howItWorks.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <span className="block text-5xl font-display font-bold text-accent/15 select-none mb-2">
                {step.num}
              </span>
              <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-5 border-2 border-accent/20">
                <step.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
