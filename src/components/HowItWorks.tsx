import { useLang } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, UserCheck } from 'lucide-react';

export default function HowItWorks() {
  const { tr } = useLang();

  const steps = [
    { icon: FileText, title: tr.howItWorks.step1title, desc: tr.howItWorks.step1desc, num: '01' },
    { icon: MessageSquare, title: tr.howItWorks.step2title, desc: tr.howItWorks.step2desc, num: '02' },
    { icon: UserCheck, title: tr.howItWorks.step3title, desc: tr.howItWorks.step3desc, num: '03' },
  ];

  return (
    <section className="py-16 md:py-24 bg-brand-light">
      <div className="container mx-auto px-4">
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
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <span className="absolute -top-2 right-1/2 translate-x-10 text-5xl font-display font-bold text-primary/10">
                {step.num}
              </span>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
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
