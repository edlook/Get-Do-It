import { useLang } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import GeometricPattern from '@/components/GeometricPattern';
import { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const reviews = {
  de: [
    { task: 'Waschmaschine installieren', time: 'Dienstleister gefunden in 3 Min.', price: '95 €', review: 'Arbeit wurde hervorragend erledigt, keine Beanstandungen. Super Service!', name: 'Thomas M.', rating: 5, tasks: 312 },
    { task: 'Paket abholen und liefern', time: 'Dienstleister gefunden in 1 Std.', price: '45 €', review: 'Schnell, freundlich und zuverlässig. Genau wie gewünscht!', name: 'Sarah K.', rating: 5, tasks: 856 },
    { task: 'Mathe-Nachhilfe Klasse 7–8', time: 'Dienstleister gefunden in 15 Min.', price: '35 €/Std.', review: 'Großartiger Lehrer. Mein Kind versteht endlich Mathematik!', name: 'Anna L.', rating: 5, tasks: 142 },
    { task: 'Logo-Design erstellen', time: 'Dienstleister gefunden in 1 Tag', price: '180 €', review: '6 verschiedene Entwürfe, alles sehr schnell und schön gemacht.', name: 'Michael F.', rating: 4.9, tasks: 567 },
    { task: 'Generalreinigung 70 m²', time: 'Dienstleister gefunden in 5 Std.', price: '120 €', review: 'Sehr gründlich und freundlich. Die Wohnung glänzt wieder!', name: 'Julia R.', rating: 4.8, tasks: 203 },
    { task: 'Umzugshilfe', time: 'Dienstleister gefunden in 30 Min.', price: '250 €', review: 'Super schnell und unkompliziert umgezogen. Sehr zu empfehlen!', name: 'Stefan W.', rating: 5, tasks: 445 },
  ],
  en: [
    { task: 'Install washing machine', time: 'Provider found in 3 min.', price: '€95', review: 'Work was done excellently, no complaints. Great service!', name: 'Thomas M.', rating: 5, tasks: 312 },
    { task: 'Pick up and deliver package', time: 'Provider found in 1 hr.', price: '€45', review: 'Fast, friendly and reliable. Exactly as requested!', name: 'Sarah K.', rating: 5, tasks: 856 },
    { task: 'Math tutoring grades 7–8', time: 'Provider found in 15 min.', price: '€35/hr', review: 'Excellent teacher. My child finally understands math!', name: 'Anna L.', rating: 5, tasks: 142 },
    { task: 'Create logo design', time: 'Provider found in 1 day', price: '€180', review: '6 different drafts, everything done quickly and beautifully.', name: 'Michael F.', rating: 4.9, tasks: 567 },
    { task: 'Deep cleaning 70 m²', time: 'Provider found in 5 hrs.', price: '€120', review: 'Very thorough and friendly. The apartment shines again!', name: 'Julia R.', rating: 4.8, tasks: 203 },
    { task: 'Moving help', time: 'Provider found in 30 min.', price: '€250', review: 'Super fast and hassle-free move. Highly recommended!', name: 'Stefan W.', rating: 5, tasks: 445 },
  ],
};

export default function Testimonials() {
  const { lang, tr } = useLang();
  const items = reviews[lang];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative py-16 md:py-24 bg-background overflow-hidden">
      <GeometricPattern color="hsl(0 0% 80% / 0.2)" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-12"
        >
          {tr.testimonials.title}
        </motion.h2>

        <div className="relative max-w-5xl mx-auto">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -ml-4">
              {items.map((item, i) => (
                <div key={i} className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-4">
                  <div className="rounded-xl bg-card border border-border p-5 hover:shadow-md transition-shadow h-full">
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
