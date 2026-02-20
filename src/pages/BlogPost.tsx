import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLang } from '@/contexts/LanguageContext';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';

const blogPosts: Record<string, { de: BlogContent; en: BlogContent }> = {
  'best-provider': {
    de: {
      title: 'Wie man den besten Dienstleister findet',
      date: '15. Februar 2026',
      readTime: '5 Min. Lesezeit',
      author: 'GetDoIt Redaktion',
      image: '🔍',
      sections: [
        {
          heading: 'Warum die richtige Wahl entscheidend ist',
          text: 'Die Wahl des richtigen Dienstleisters kann den Unterschied zwischen einer stressfreien Erfahrung und einem Albtraum ausmachen. Ob Renovierung, Umzug oder IT-Support – mit der richtigen Herangehensweise finden Sie schnell den perfekten Partner für Ihr Projekt.',
        },
        {
          heading: '1. Bewertungen genau lesen',
          text: 'Achten Sie nicht nur auf die Gesamtbewertung, sondern lesen Sie die einzelnen Rezensionen. Besonders aufschlussreich sind Bewertungen, die konkrete Details zur Zusammenarbeit enthalten. Schauen Sie auf Pünktlichkeit, Kommunikation und Qualität der Arbeit.',
        },
        {
          heading: '2. Mehrere Angebote vergleichen',
          text: 'Holen Sie sich mindestens drei Angebote ein, bevor Sie sich entscheiden. So bekommen Sie ein Gefühl für den marktüblichen Preis und können die Leistungen besser vergleichen. Auf GetDoIt erhalten Sie in der Regel innerhalb von 30 Minuten die ersten Angebote.',
        },
        {
          heading: '3. Klare Aufgabenbeschreibung',
          text: 'Je präziser Sie Ihre Aufgabe beschreiben, desto passendere Angebote erhalten Sie. Geben Sie alle relevanten Details an: Umfang, gewünschter Zeitraum, besondere Anforderungen und Ihr Budget. So vermeiden Sie Missverständnisse und sparen Zeit.',
        },
        {
          heading: '4. Referenzen und Arbeitsbeispiele prüfen',
          text: 'Seriöse Dienstleister zeigen gerne ihre bisherigen Arbeiten. Fragen Sie nach Fotos abgeschlossener Projekte oder Kontaktdaten früherer Kunden. Auf GetDoIt können Dienstleister ihr Portfolio direkt in ihrem Profil präsentieren.',
        },
        {
          heading: '5. Auf Ihr Bauchgefühl hören',
          text: 'Die Kommunikation vor Auftragsbeginn sagt viel über die spätere Zusammenarbeit aus. Reagiert der Dienstleister schnell und professionell? Geht er auf Ihre Wünsche ein? Ein gutes erstes Gespräch ist oft der beste Indikator für eine erfolgreiche Zusammenarbeit.',
        },
      ],
    },
    en: {
      title: 'How to Find the Best Service Provider',
      date: 'February 15, 2026',
      readTime: '5 min read',
      author: 'GetDoIt Editorial',
      image: '🔍',
      sections: [
        {
          heading: 'Why the right choice matters',
          text: 'Choosing the right service provider can make the difference between a stress-free experience and a nightmare. Whether it\'s renovation, moving, or IT support – with the right approach, you\'ll quickly find the perfect partner for your project.',
        },
        {
          heading: '1. Read reviews carefully',
          text: 'Don\'t just look at the overall rating – read individual reviews. Reviews that contain specific details about the collaboration are particularly informative. Pay attention to punctuality, communication, and quality of work.',
        },
        {
          heading: '2. Compare multiple offers',
          text: 'Get at least three quotes before making a decision. This gives you a feel for the market price and allows you to compare services more effectively. On GetDoIt, you typically receive initial offers within 30 minutes.',
        },
        {
          heading: '3. Provide a clear task description',
          text: 'The more precisely you describe your task, the more relevant offers you\'ll receive. Include all relevant details: scope, preferred timeline, special requirements, and your budget. This avoids misunderstandings and saves time.',
        },
        {
          heading: '4. Check references and work samples',
          text: 'Reputable providers are happy to show their previous work. Ask for photos of completed projects or contact details of previous clients. On GetDoIt, providers can showcase their portfolio directly on their profile.',
        },
        {
          heading: '5. Trust your gut feeling',
          text: 'Communication before the job starts says a lot about future collaboration. Does the provider respond quickly and professionally? Do they address your needs? A good first conversation is often the best indicator of successful cooperation.',
        },
      ],
    },
  },
  'first-task': {
    de: {
      title: 'Tipps für die erste Auftragsstellung',
      date: '10. Februar 2026',
      readTime: '4 Min. Lesezeit',
      author: 'GetDoIt Redaktion',
      image: '📝',
      sections: [
        {
          heading: 'Ihr erster Auftrag auf GetDoIt',
          text: 'Sie möchten zum ersten Mal einen Auftrag auf GetDoIt erstellen? Keine Sorge – der Prozess ist einfach und intuitiv. Mit diesen Tipps stellen Sie sicher, dass Sie schnell die besten Angebote erhalten.',
        },
        {
          heading: '1. Wählen Sie die richtige Kategorie',
          text: 'GetDoIt bietet über 16 Hauptkategorien – von Renovierung über IT-Hilfe bis hin zu Kurierdiensten. Die richtige Kategorie sorgt dafür, dass Ihr Auftrag von den passenden Fachleuten gesehen wird.',
        },
        {
          heading: '2. Beschreiben Sie Ihre Aufgabe detailliert',
          text: 'Ein guter Titel wie „Waschmaschine in Berliner Altbau anschließen" ist besser als „Brauche Hilfe". Beschreiben Sie in der Detailbeschreibung den genauen Umfang, besondere Herausforderungen und Ihre Erwartungen.',
        },
        {
          heading: '3. Setzen Sie ein realistisches Budget',
          text: 'Wenn Sie unsicher über den Preis sind, schauen Sie sich ähnliche Aufträge auf der Plattform an. Sie können auch einen Budgetrahmen angeben (z.B. 50–100 €), um flexible Angebote zu erhalten.',
        },
        {
          heading: '4. Geben Sie einen Wunschtermin an',
          text: 'Dienstleister planen ihre Zeit im Voraus. Je früher Sie Ihren Wunschtermin angeben, desto eher finden Sie einen verfügbaren Fachmann. Flexible Termine führen oft zu günstigeren Angeboten.',
        },
        {
          heading: '5. Reagieren Sie schnell auf Angebote',
          text: 'Die besten Dienstleister sind gefragt. Wenn Sie ein gutes Angebot erhalten, zögern Sie nicht zu lange. Stellen Sie Rückfragen und vereinbaren Sie die Details direkt über die Plattform.',
        },
      ],
    },
    en: {
      title: 'Tips for Your First Task',
      date: 'February 10, 2026',
      readTime: '4 min read',
      author: 'GetDoIt Editorial',
      image: '📝',
      sections: [
        {
          heading: 'Your first task on GetDoIt',
          text: 'Want to create your first task on GetDoIt? Don\'t worry – the process is simple and intuitive. With these tips, you\'ll ensure you quickly receive the best offers.',
        },
        {
          heading: '1. Choose the right category',
          text: 'GetDoIt offers over 16 main categories – from renovation to IT help to courier services. The right category ensures your task is seen by the right professionals.',
        },
        {
          heading: '2. Describe your task in detail',
          text: 'A good title like "Connect washing machine in Berlin apartment" is better than "Need help." In the description, outline the exact scope, special challenges, and your expectations.',
        },
        {
          heading: '3. Set a realistic budget',
          text: 'If you\'re unsure about pricing, browse similar tasks on the platform. You can also set a budget range (e.g., €50–100) to receive flexible offers.',
        },
        {
          heading: '4. Set a preferred date',
          text: 'Providers plan their time in advance. The earlier you set your preferred date, the more likely you are to find an available professional. Flexible dates often lead to better prices.',
        },
        {
          heading: '5. Respond quickly to offers',
          text: 'The best providers are in demand. When you receive a good offer, don\'t wait too long. Ask follow-up questions and arrange details directly through the platform.',
        },
      ],
    },
  },
  'online-safety': {
    de: {
      title: 'Sicherheit bei Online-Aufträgen',
      date: '5. Februar 2026',
      readTime: '6 Min. Lesezeit',
      author: 'GetDoIt Sicherheitsteam',
      image: '🛡️',
      sections: [
        {
          heading: 'Sicher arbeiten auf GetDoIt',
          text: 'Online-Plattformen bieten viele Vorteile, aber Sicherheit sollte immer an erster Stelle stehen. Bei GetDoIt nehmen wir den Schutz unserer Nutzer sehr ernst. Hier erfahren Sie, wie Sie sich zusätzlich schützen können.',
        },
        {
          heading: '1. Kommunizieren Sie über die Plattform',
          text: 'Nutzen Sie die GetDoIt-Nachrichtenfunktion für alle Absprachen. So haben Sie im Streitfall einen dokumentierten Verlauf. Vermeiden Sie es, persönliche Kontaktdaten vor Auftragsbestätigung weiterzugeben.',
        },
        {
          heading: '2. Prüfen Sie Profile sorgfältig',
          text: 'Achten Sie auf verifizierte Profile, vollständige Informationen und eine Historie von Bewertungen. Neue Profile ohne Bewertungen sind nicht automatisch unseriös, aber extra Vorsicht schadet nie.',
        },
        {
          heading: '3. Vereinbaren Sie klare Konditionen',
          text: 'Bevor der Auftrag startet, sollten Umfang, Preis, Zeitrahmen und Zahlungsbedingungen schriftlich festgehalten werden. So vermeiden beide Seiten unangenehme Überraschungen.',
        },
        {
          heading: '4. Nutzen Sie sichere Zahlungsmethoden',
          text: 'Bevorzugen Sie die Zahlung über die Plattform oder nachweisbare Methoden. Vermeiden Sie Barzahlungen im Voraus. Bei GetDoIt arbeiten wir an einem integrierten Zahlungsschutz für noch mehr Sicherheit.',
        },
        {
          heading: '5. Vertrauen Sie Ihrem Instinkt',
          text: 'Wenn ein Angebot zu gut klingt, um wahr zu sein, ist es das wahrscheinlich auch. Seriöse Dienstleister haben faire Preise und scheuen keine Rückfragen. Im Zweifel: Lieber einen anderen Anbieter wählen.',
        },
        {
          heading: '6. Melden Sie verdächtiges Verhalten',
          text: 'Wenn Ihnen etwas auffällt, das nicht stimmt, melden Sie es sofort unserem Support-Team. Wir prüfen jeden Hinweis und handeln schnell, um unsere Community zu schützen.',
        },
      ],
    },
    en: {
      title: 'Safety with Online Tasks',
      date: 'February 5, 2026',
      readTime: '6 min read',
      author: 'GetDoIt Safety Team',
      image: '🛡️',
      sections: [
        {
          heading: 'Working safely on GetDoIt',
          text: 'Online platforms offer many advantages, but safety should always come first. At GetDoIt, we take user protection very seriously. Here\'s how you can additionally protect yourself.',
        },
        {
          heading: '1. Communicate through the platform',
          text: 'Use GetDoIt\'s messaging feature for all arrangements. This gives you a documented trail in case of disputes. Avoid sharing personal contact details before confirming the task.',
        },
        {
          heading: '2. Check profiles carefully',
          text: 'Look for verified profiles, complete information, and a history of reviews. New profiles without reviews aren\'t automatically suspicious, but extra caution never hurts.',
        },
        {
          heading: '3. Agree on clear terms',
          text: 'Before the task starts, scope, price, timeline, and payment terms should be documented in writing. This prevents unpleasant surprises for both parties.',
        },
        {
          heading: '4. Use secure payment methods',
          text: 'Prefer payment through the platform or traceable methods. Avoid cash payments in advance. At GetDoIt, we\'re working on integrated payment protection for even more security.',
        },
        {
          heading: '5. Trust your instincts',
          text: 'If an offer sounds too good to be true, it probably is. Reputable providers have fair prices and welcome questions. When in doubt: choose another provider.',
        },
        {
          heading: '6. Report suspicious behavior',
          text: 'If you notice something that doesn\'t seem right, report it immediately to our support team. We review every report and act quickly to protect our community.',
        },
      ],
    },
  },
};

interface BlogContent {
  title: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  sections: { heading: string; text: string }[];
}

export default function BlogPost() {
  const { slug } = useParams();
  const { lang } = useLang();
  const post = slug ? blogPosts[slug] : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">
            {lang === 'de' ? 'Artikel nicht gefunden' : 'Article not found'}
          </h1>
          <Link to="/blog" className="text-primary hover:underline">
            {lang === 'de' ? '← Zurück zum Blog' : '← Back to Blog'}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const content = post[lang];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'de' ? 'Alle Artikel' : 'All Articles'}
        </Link>

        <div className="text-6xl mb-6">{content.image}</div>

        <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
          {content.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-10">
          <span className="inline-flex items-center gap-1">
            <User className="h-4 w-4" /> {content.author}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4" /> {content.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" /> {content.readTime}
          </span>
        </div>

        <article className="space-y-8">
          {content.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-display font-semibold mb-3 text-foreground">
                {section.heading}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{section.text}</p>
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
}
