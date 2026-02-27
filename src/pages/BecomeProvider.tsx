import { useNavigate } from 'react-router-dom';
import { useLang } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Wallet, Clock, ShieldCheck, Megaphone, ArrowRight,
  CheckCircle2, Star, ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const tr = {
  de: {
    heroTitle: 'Werden Sie Dienstleister bei GetDoIt',
    heroSubtitle: 'GetDoIt hilft Ihnen, neue Kunden zu finden und mit jeder Dienstleistung Geld zu verdienen.',
    heroCta: 'Dienstleister werden',
    benefitsTitle: 'Vorteile',
    benefitsSubtitle: 'Werden Sie Dienstleister und erledigen Sie interessante Aufträge von Auftraggebern – in Ihrer freien Zeit.',
    benefit1: 'Guter Verdienst',
    benefit2: 'Freier Zeitplan',
    benefit3: 'Sicherer Service',
    benefit4: 'Keine Werbekosten',
    howTitle: 'So erhalten Sie einen Auftrag',
    howSubtitle: 'Bei GetDoIt wählen Dienstleister selbst ihre Aufträge und Kunden. Es ist ganz einfach.',
    step1: 'Werden Sie Dienstleister und füllen Sie Ihr Profil aus',
    step2: 'Wählen Sie einen Auftrag und bewerben Sie sich',
    step3: 'Erhalten Sie die Bezahlung sofort nach Erledigung',
    ctaBecome: 'Dienstleister werden',
    earningsTitle: 'Guter Verdienst',
    earningsDesc: 'Verdienen Sie mit Aufträgen auf GetDoIt ohne Einschränkungen. Nutzen Sie den Service für Nebenjobs oder starten Sie Ihr eigenes Geschäft.',
    earningsTestimonial: 'Mein größter Auftrag auf GetDoIt war fast 5.000 €. Ich habe mehrere Tage an einem Problem gearbeitet, das niemand sonst übernehmen wollte.',
    earningsAuthor: 'Thomas – Umzüge & Transport',
    earningsStats: '48 Bewertungen, 45 erledigte Aufträge',
    earningsCta: 'Jetzt verdienen',
    scheduleTitle: 'Freier Zeitplan',
    scheduleDesc: 'Bei GetDoIt arbeiten Sie für sich selbst und wählen Ihre Kunden. Erledigen Sie Aufträge, wann es Ihnen passt, und machen Sie Urlaub, wann Sie wollen.',
    scheduleTestimonial: 'GetDoIt ist ein einzigartiger Service. Der größte Vorteil ist, dass Sie Ihren Arbeitsplan, Ihre Aufträge und Kunden selbst bestimmen können.',
    scheduleAuthor: 'Anna – Reinigung',
    scheduleStats: '120 Bewertungen, 98 erledigte Aufträge',
    scheduleCta: 'Selbstständig arbeiten',
    safetyTitle: 'Sicherheit des Services',
    safetyDesc: 'Lesen Sie Bewertungen über Auftraggeber und erledigen Sie Aufträge mit unserer sicheren Zahlungsabwicklung: Bei erfolgreicher Erledigung erhalten Sie garantiert Ihre Bezahlung.',
    safetyTestimonial: 'Mit der sicheren Zahlung muss man sich keine Sorgen machen, dass die Bezahlung nicht ankommt. Das System funktioniert einwandfrei.',
    safetyAuthor: 'Markus – IT-Hilfe',
    safetyStats: '85 Bewertungen, 80 erledigte Aufträge',
    safetyCta: 'Dienstleisterstatus erhalten',
    adTitle: 'Keine Werbekosten',
    adDesc: 'Kein eigener Webauftritt und keine Werbung mehr nötig – wählen Sie Aufträge und senden Sie Angebote an Kunden, die den Service jetzt brauchen.',
    adTestimonial: 'Der Service hat mir sehr geholfen, einen Kundenstamm aufzubauen. Viele Kunden kommen mittlerweile zum dritten oder vierten Mal.',
    adAuthor: 'Sophie – Friseurin',
    adStats: '65 Bewertungen, 62 erledigte Aufträge',
    adCta: 'Dienstleister werden',
    faqTitle: 'Häufige Fragen',
    faq1q: 'Ist GetDoIt seriös?',
    faq1a: 'Ja, GetDoIt ist ein vertrauenswürdiger Marktplatz für Dienstleistungen. Tausende Dienstleister nutzen den Service erfolgreich.',
    faq2q: 'Wer erstellt die Aufträge?',
    faq2a: 'Die Auftraggeber bei GetDoIt sind Privatpersonen und Unternehmen, die eine Dienstleistung benötigen. Sie können das Profil und die Bewertungen jedes Auftraggebers einsehen.',
    faq3q: 'Wie erfolgt die Bezahlung?',
    faq3a: 'Sie vereinbaren die Bezahlung direkt mit dem Auftraggeber. Bei der sicheren Zahlungsabwicklung wird das Geld nach erfolgreicher Erledigung auf Ihre Karte überwiesen.',
    faq4q: 'Wie kann ich als Neuling erfolgreich sein?',
    faq4a: 'Beginnen Sie mit einfachen Aufträgen und bewerben Sie sich aktiv. Sobald die ersten positiven Bewertungen eingehen, wird es deutlich einfacher, Aufträge zu bekommen.',
    faq5q: 'Wie wähle ich die richtigen Aufträge?',
    faq5a: 'Lesen Sie die Bewertungen der Auftraggeber und achten Sie auf die Auftragsbeschreibung. Unser Support-Team steht Ihnen jederzeit zur Verfügung.',
    startTitle: 'Beginnen Sie Ihre Erfolgsgeschichte',
    startSubtitle: 'Lassen Sie sich von unseren erfolgreichen Dienstleistern inspirieren. Sie nutzen GetDoIt täglich für Nebenjobs, finden neue Kunden und bauen ihr Geschäft aus.',
  },
  en: {
    heroTitle: 'Become a Service Provider at GetDoIt',
    heroSubtitle: 'GetDoIt helps you find new clients and earn money providing any service.',
    heroCta: 'Become a Provider',
    benefitsTitle: 'Benefits',
    benefitsSubtitle: 'Become a provider and complete interesting tasks from clients – on your own schedule.',
    benefit1: 'Great Earnings',
    benefit2: 'Flexible Schedule',
    benefit3: 'Safe Service',
    benefit4: 'No Ad Costs',
    howTitle: 'How to Get an Order',
    howSubtitle: 'At GetDoIt, providers choose their own orders and clients. It\'s simple.',
    step1: 'Become a provider and fill out your profile',
    step2: 'Choose a task and apply for it',
    step3: 'Get paid immediately after completion',
    ctaBecome: 'Become a Provider',
    earningsTitle: 'Great Earnings',
    earningsDesc: 'Earn with GetDoIt orders without limits. Use the service for side jobs or start building your own business.',
    earningsTestimonial: 'My biggest order on GetDoIt was almost €5,000. I worked for several days on a problem nobody else wanted to take on.',
    earningsAuthor: 'Thomas – Moving & Transport',
    earningsStats: '48 reviews, 45 completed tasks',
    earningsCta: 'Start Earning',
    scheduleTitle: 'Flexible Schedule',
    scheduleDesc: 'At GetDoIt you work for yourself and choose your clients. Complete tasks when it suits you and take time off whenever you want.',
    scheduleTestimonial: 'GetDoIt is a unique service. The biggest advantage is that you can determine your own work schedule, orders, and clients.',
    scheduleAuthor: 'Anna – Cleaning',
    scheduleStats: '120 reviews, 98 completed tasks',
    scheduleCta: 'Work Independently',
    safetyTitle: 'Service Safety',
    safetyDesc: 'Read reviews about clients and complete tasks with our secure payment processing: upon successful completion, you\'re guaranteed to receive your payment.',
    safetyTestimonial: 'With secure payment, you don\'t have to worry about not getting paid. The system works flawlessly.',
    safetyAuthor: 'Marcus – IT Help',
    safetyStats: '85 reviews, 80 completed tasks',
    safetyCta: 'Get Provider Status',
    adTitle: 'No Advertising Costs',
    adDesc: 'No need for your own website or advertising – choose tasks and send offers to clients who need the service right now.',
    adTestimonial: 'The service really helped me build a client base. Many clients now come back for the third or fourth time.',
    adAuthor: 'Sophie – Hairdresser',
    adStats: '65 reviews, 62 completed tasks',
    adCta: 'Become a Provider',
    faqTitle: 'Frequently Asked Questions',
    faq1q: 'Is GetDoIt trustworthy?',
    faq1a: 'Yes, GetDoIt is a trusted marketplace for services. Thousands of providers use the service successfully.',
    faq2q: 'Who creates the tasks?',
    faq2a: 'Clients on GetDoIt are individuals and businesses who need a service. You can view the profile and reviews of every client.',
    faq3q: 'How does payment work?',
    faq3a: 'You arrange payment directly with the client. With secure payment processing, money is transferred to your card after successful completion.',
    faq4q: 'How can I succeed as a newcomer?',
    faq4a: 'Start with simple tasks and apply actively. Once you get your first positive reviews, it becomes much easier to get orders.',
    faq5q: 'How do I choose the right tasks?',
    faq5a: 'Read client reviews and pay attention to the task description. Our support team is always available to help.',
    startTitle: 'Start Your Success Story',
    startSubtitle: 'Get inspired by our successful providers. They use GetDoIt daily for side jobs, find new clients, and grow their business with us.',
  },
};

const benefits = [
  { icon: Wallet, key: 'benefit1' as const },
  { icon: Clock, key: 'benefit2' as const },
  { icon: ShieldCheck, key: 'benefit3' as const },
  { icon: Megaphone, key: 'benefit4' as const },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function BecomeProvider() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const t = tr[lang];

  const goToVerification = () => navigate('/verification');

  const testimonialSections = [
    {
      title: t.earningsTitle,
      desc: t.earningsDesc,
      quote: t.earningsTestimonial,
      author: t.earningsAuthor,
      stats: t.earningsStats,
      cta: t.earningsCta,
      icon: Wallet,
      accent: 'from-amber-500 to-orange-500',
    },
    {
      title: t.scheduleTitle,
      desc: t.scheduleDesc,
      quote: t.scheduleTestimonial,
      author: t.scheduleAuthor,
      stats: t.scheduleStats,
      cta: t.scheduleCta,
      icon: Clock,
      accent: 'from-blue-500 to-cyan-500',
    },
    {
      title: t.safetyTitle,
      desc: t.safetyDesc,
      quote: t.safetyTestimonial,
      author: t.safetyAuthor,
      stats: t.safetyStats,
      cta: t.safetyCta,
      icon: ShieldCheck,
      accent: 'from-green-500 to-emerald-500',
    },
    {
      title: t.adTitle,
      desc: t.adDesc,
      quote: t.adTestimonial,
      author: t.adAuthor,
      stats: t.adStats,
      cta: t.adCta,
      icon: Megaphone,
      accent: 'from-purple-500 to-pink-500',
    },
  ];

  const faqItems = [
    { q: t.faq1q, a: t.faq1a },
    { q: t.faq2q, a: t.faq2a },
    { q: t.faq3q, a: t.faq3a },
    { q: t.faq4q, a: t.faq4a },
    { q: t.faq5q, a: t.faq5a },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[hsl(250,40%,25%)] via-[hsl(250,35%,35%)] to-[hsl(250,30%,45%)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="container mx-auto px-4 py-24 md:py-32 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {t.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={goToVerification}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 rounded-xl font-bold shadow-2xl"
            >
              {t.heroCta}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">{t.benefitsTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.benefitsSubtitle}</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.key}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <b.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="font-semibold text-foreground">{t[b.key]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">{t.howTitle}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.howSubtitle}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10">
            {[t.step1, t.step2, t.step3].map((step, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                  {i + 1}
                </div>
                <p className="text-foreground font-medium">{step}</p>
              </motion.div>
            ))}
          </div>
          <motion.div className="text-center" {...fadeUp}>
            <Button size="lg" onClick={goToVerification} className="text-lg px-8 py-5 rounded-xl">
              {t.ctaBecome} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonial sections */}
      {testimonialSections.map((section, i) => (
        <section
          key={i}
          className={`py-16 md:py-20 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}
        >
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              className="grid md:grid-cols-2 gap-10 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${section.accent} text-white text-sm font-medium mb-4`}>
                  <section.icon className="w-4 h-4" />
                  {section.title}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  {section.title}
                </h3>
                <p className="text-muted-foreground mb-6">{section.desc}</p>
                <Button onClick={goToVerification} variant="outline" className="rounded-xl">
                  {section.cta} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className={`bg-card border border-border rounded-2xl p-6 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-foreground italic mb-4 leading-relaxed">
                  „{section.quote}"
                </blockquote>
                <div>
                  <p className="font-semibold text-foreground">{section.author}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    {section.stats}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2
            className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-10"
            {...fadeUp}
          >
            {t.faqTitle}
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-5">
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[hsl(250,40%,25%)] via-[hsl(250,35%,35%)] to-[hsl(250,30%,45%)] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-display font-bold mb-4"
            {...fadeUp}
          >
            {t.startTitle}
          </motion.h2>
          <motion.p
            className="text-white/70 max-w-2xl mx-auto mb-8"
            {...fadeUp}
          >
            {t.startSubtitle}
          </motion.p>
          <motion.div {...fadeUp}>
            <Button
              size="lg"
              onClick={goToVerification}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-6 rounded-xl font-bold shadow-2xl"
            >
              {t.heroCta} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
