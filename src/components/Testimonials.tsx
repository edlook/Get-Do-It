import { useLang } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = {
  de: [
    {
      task: 'Waschmaschine installieren',
      time: 'Dienstleister gefunden in 3 Min.',
      price: '95 €',
      review: 'Arbeit wurde hervorragend erledigt, keine Beanstandungen. Super Service!',
      name: 'Thomas M.',
      rating: 5,
      tasks: 312,
    },
    {
      task: 'Paket abholen und liefern',
      time: 'Dienstleister gefunden in 1 Std.',
      price: '45 €',
      review: 'Schnell, freundlich und zuverlässig. Genau wie gewünscht!',
      name: 'Sarah K.',
      rating: 5,
      tasks: 856,
    },
    {
      task: 'Mathe-Nachhilfe Klasse 7–8',
      time: 'Dienstleister gefunden in 15 Min.',
      price: '35 €/Std.',
      review: 'Großartiger Lehrer. Mein Kind versteht endlich Mathematik! Sehr empfehlenswert.',
      name: 'Anna L.',
      rating: 5,
      tasks: 142,
    },
    {
      task: 'Logo-Design erstellen',
      time: 'Dienstleister gefunden in 1 Tag',
      price: '180 €',
      review: '6 verschiedene Entwürfe, alles sehr schnell und schön gemacht. Vielen Dank!',
      name: 'Michael F.',
      rating: 4.9,
      tasks: 567,
    },
    {
      task: 'Generalreinigung 70 m²',
      time: 'Dienstleister gefunden in 5 Std.',
      price: '120 €',
      review: 'Sehr gründlich und freundlich. Die Wohnung glänzt wieder!',
      name: 'Julia R.',
      rating: 4.8,
      tasks: 203,
    },
    {
      task: 'Umzugshilfe',
      time: 'Dienstleister gefunden in 30 Min.',
      price: '250 €',
      review: 'Super schnell und unkompliziert umgezogen. Sehr zu empfehlen!',
      name: 'Stefan W.',
      rating: 5,
      tasks: 445,
    },
  ],
  en: [
    {
      task: 'Install washing machine',
      time: 'Provider found in 3 min.',
      price: '€95',
      review: 'Work was done excellently, no complaints. Great service!',
      name: 'Thomas M.',
      rating: 5,
      tasks: 312,
    },
    {
      task: 'Pick up and deliver package',
      time: 'Provider found in 1 hr.',
      price: '€45',
      review: 'Fast, friendly and reliable. Exactly as requested!',
      name: 'Sarah K.',
      rating: 5,
      tasks: 856,
    },
    {
      task: 'Math tutoring grades 7–8',
      time: 'Provider found in 15 min.',
      price: '€35/hr',
      review: 'Excellent teacher. My child finally understands math! Highly recommended.',
      name: 'Anna L.',
      rating: 5,
      tasks: 142,
    },
    {
      task: 'Create logo design',
      time: 'Provider found in 1 day',
      price: '€180',
      review: '6 different drafts, everything done quickly and beautifully. Thank you!',
      name: 'Michael F.',
      rating: 4.9,
      tasks: 567,
    },
    {
      task: 'Deep cleaning 70 m²',
      time: 'Provider found in 5 hrs.',
      price: '€120',
      review: 'Very thorough and friendly. The apartment shines again!',
      name: 'Julia R.',
      rating: 4.8,
      tasks: 203,
    },
    {
      task: 'Moving help',
      time: 'Provider found in 30 min.',
      price: '€250',
      review: 'Super fast and hassle-free move. Highly recommended!',
      name: 'Stefan W.',
      rating: 5,
      tasks: 445,
    },
  ],
};

export default function Testimonials() {
  const { lang, tr } = useLang();
  const items = reviews[lang];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12"
        >
          {tr.testimonials.title}
        </motion.h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl bg-card border border-border p-5 hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-sm text-foreground">{item.task}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
              <p className="text-xs font-medium text-primary mt-0.5">{item.price}</p>
              <p className="text-sm text-foreground mt-3 leading-relaxed">"{item.review}"</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="text-xs font-medium text-foreground">{item.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">· {item.tasks} {lang === 'de' ? 'Aufträge' : 'tasks'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
