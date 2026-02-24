import { useLang } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import GeometricPattern from '@/components/GeometricPattern';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const reviews = {
  de: [
    { task: 'Waschmaschine installieren', time: 'Dienstleister gefunden in 3 Min.', price: '95 €', payMethod: 'Überweisung', review: 'Arbeit wurde hervorragend erledigt, keine Beanstandungen. Super Service!', date: '28. September 2025', name: 'Thomas M.', rating: 5, tasks: 312 },
    { task: 'Paket abholen und liefern', time: 'Dienstleister gefunden in 1 Std.', price: '45 €', payMethod: 'Bar', review: 'Schnell, freundlich und zuverlässig. Genau wie gewünscht! Ein toller Service, den ich gerne weiterempfehle.', date: '19. Oktober 2025', name: 'Sarah K.', rating: 5, tasks: 856 },
    { task: 'Mathe-Nachhilfe Klasse 7–8', time: 'Dienstleister gefunden in 15 Min.', price: '35 €/Std.', payMethod: 'Überweisung', review: 'Großartiger Lehrer. Mein Kind versteht endlich Mathematik. Erklärt sehr verständlich und geduldig.', date: '24. September 2025', name: 'Anna L.', rating: 5, tasks: 142 },
    { task: 'Logo-Design erstellen', time: 'Dienstleister gefunden in 1 Tag', price: '180 €', payMethod: 'Überweisung', review: '6 verschiedene Entwürfe, alles sehr schnell und schön gemacht. Vielen Dank!', date: '10. August 2025', name: 'Michael F.', rating: 4.9, tasks: 567 },
    { task: 'Generalreinigung 70 m²', time: 'Dienstleister gefunden in 5 Std.', price: '120 €', payMethod: 'Bar', review: 'Sehr gründlich und freundlich. Die Wohnung glänzt wieder! Alles tip-top sauber.', date: '5. November 2025', name: 'Julia R.', rating: 4.8, tasks: 203 },
    { task: 'Umzugshilfe', time: 'Dienstleister gefunden in 30 Min.', price: '250 €', payMethod: 'Überweisung', review: 'Super schnell und unkompliziert umgezogen. Sehr zu empfehlen! Alles heil angekommen.', date: '12. Dezember 2025', name: 'Stefan W.', rating: 5, tasks: 445 },
    { task: 'Herd anschließen', time: 'Dienstleister gefunden in 2 Std.', price: '75 €', payMethod: 'Bar', review: 'Pünktlich, sauber und professionell. Gerne wieder!', date: '3. Januar 2026', name: 'Klaus B.', rating: 5, tasks: 189 },
    { task: 'Gartenpflege', time: 'Dienstleister gefunden in 4 Std.', price: '150 €', payMethod: 'Überweisung', review: 'Garten sieht fantastisch aus. Sehr sorgfältige Arbeit!', date: '18. Januar 2026', name: 'Petra H.', rating: 4.9, tasks: 324 },
  ],
  en: [
    { task: 'Install washing machine', time: 'Provider found in 3 min.', price: '€95', payMethod: 'Bank transfer', review: 'Work was done excellently, no complaints. Great service!', date: 'Sep 28, 2025', name: 'Thomas M.', rating: 5, tasks: 312 },
    { task: 'Pick up and deliver package', time: 'Provider found in 1 hr.', price: '€45', payMethod: 'Cash', review: 'Fast, friendly and reliable. Exactly as requested! A great service I happily recommend.', date: 'Oct 19, 2025', name: 'Sarah K.', rating: 5, tasks: 856 },
    { task: 'Math tutoring grades 7–8', time: 'Provider found in 15 min.', price: '€35/hr', payMethod: 'Bank transfer', review: 'Excellent teacher. My child finally understands math. Explains very clearly and patiently.', date: 'Sep 24, 2025', name: 'Anna L.', rating: 5, tasks: 142 },
    { task: 'Create logo design', time: 'Provider found in 1 day', price: '€180', payMethod: 'Bank transfer', review: '6 different drafts, everything done quickly and beautifully. Thank you so much!', date: 'Aug 10, 2025', name: 'Michael F.', rating: 4.9, tasks: 567 },
    { task: 'Deep cleaning 70 m²', time: 'Provider found in 5 hrs.', price: '€120', payMethod: 'Cash', review: 'Very thorough and friendly. The apartment shines again! Everything squeaky clean.', date: 'Nov 5, 2025', name: 'Julia R.', rating: 4.8, tasks: 203 },
    { task: 'Moving help', time: 'Provider found in 30 min.', price: '€250', payMethod: 'Bank transfer', review: 'Super fast and hassle-free move. Highly recommended! Everything arrived safely.', date: 'Dec 12, 2025', name: 'Stefan W.', rating: 5, tasks: 445 },
    { task: 'Connect stove', time: 'Provider found in 2 hrs.', price: '€75', payMethod: 'Cash', review: 'On time, clean and professional. Would use again!', date: 'Jan 3, 2026', name: 'Klaus B.', rating: 5, tasks: 189 },
    { task: 'Garden maintenance', time: 'Provider found in 4 hrs.', price: '€150', payMethod: 'Bank transfer', review: 'Garden looks fantastic. Very careful work!', date: 'Jan 18, 2026', name: 'Petra H.', rating: 4.9, tasks: 324 },
  ],
};

export default function Testimonials() {
  const { lang, tr } = useLang();
  const items = reviews[lang];
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1, dragFree: true },
    [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

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
      </div>

      {/* Full-width carousel with edge fade */}
      <div className="relative z-10">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to right, hsl(var(--background)), transparent)' }}
        />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to left, hsl(var(--background)), transparent)' }}
        />
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4 pl-4">
            {items.map((item, i) => (
              <div key={i} className="min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[48%] md:basis-[35%] lg:basis-[26%] xl:basis-[22%]">
                <div className="rounded-xl bg-card border border-border p-5 hover:shadow-md transition-shadow h-full flex flex-col">
                  <h3 className="font-semibold text-sm text-foreground leading-snug">{item.task}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>

                  <div className="mt-3">
                    <span className="text-base font-bold text-primary">{item.price}</span>
                    <span className="text-xs text-muted-foreground ml-1.5">{item.payMethod}</span>
                  </div>

                  <p className="text-sm text-foreground mt-3 leading-relaxed flex-1">{item.review}</p>
                  <p className="text-xs text-muted-foreground mt-3">{item.date}</p>

                  <div className="border-t border-border mt-4 pt-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0">
                      {item.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-muted-foreground">{lang === 'de' ? 'Bewertung:' : 'Rating:'}</span>
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="text-xs font-medium text-foreground">{item.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {lang === 'de' ? `${item.tasks} Aufträge` : `${item.tasks} tasks completed`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
