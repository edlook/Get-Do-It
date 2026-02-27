import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLang } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Upload, Camera, CheckCircle, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const tr = {
  de: {
    breadcrumb: ['Hilfe', 'Mein Profil', 'Für Dienstleister'],
    title: 'Wie verifiziere ich meine Dokumente auf GetDoIt?',
    subtitle: 'Lassen Sie Ihren Ausweis prüfen und erhalten Sie das Abzeichen "Dokumente bestätigt", damit Auftraggeber Ihnen mehr Aufträge anvertrauen.',
    intro: 'Wenn Sie die Effektivität Ihres Profils steigern und mehr Aufträge erhalten möchten, empfehlen wir Ihnen, die automatische Dokumentenprüfung durchzuführen und das Abzeichen "Dokumente bestätigt" zu erhalten.',
    benefit: 'Dieses Abzeichen gibt Ihnen permanente Bonuspunkte für Ihr Ranking, und Ihre Angebote werden höher angezeigt als die von Dienstleistern ohne bestätigte Dokumente.',
    howTitle: 'So bestätigen Sie Ihre Dokumente',
    howIntro: 'Die Dokumentenprüfung ist für Bürger der EU und der Schweiz verfügbar. Sie erfolgt online und dauert nur wenige Minuten.',
    howPrepare: 'Bereiten Sie hochwertige Fotos Ihres Ausweises und ein Selfie mit dem Dokument vor.',
    steps: [
      'Erhalten Sie den Status als Dienstleister auf GetDoIt.',
      'Fügen Sie Ihr erstes Angebot zu einem Auftrag hinzu.',
      'Gehen Sie zu Ihrem Profil und klicken Sie auf «Prüfung starten».',
      'Laden Sie ein Foto Ihres Ausweises hoch.',
      'Laden Sie ein Selfie mit dem Dokument hoch.',
    ],
    requirementsTitle: 'Anforderungen an die Dokumente',
    requirements: [
      'Die Prüfung kann nur mit einem gültigen Personalausweis oder Reisepass durchgeführt werden.',
      'Auf dem Bild müssen die Hauptseite mit Foto und die Informationen zum Ausstellungsdatum sichtbar sein.',
      'Das Bild muss hochwertig und ohne Blendungen sein. Bearbeiten Sie es nicht in Bildbearbeitungsprogrammen.',
      'Bildformat: JPG oder PNG.',
    ],
    resultText: 'Warten Sie auf die Ergebnisse der Prüfung. Normalerweise dauert sie nicht mehr als 5 Minuten, kann aber bis zu 24 Stunden dauern. Nach erfolgreicher Bestätigung erscheint in Ihrem Profil das Abzeichen "Dokumente bestätigt".',
    startBtn: 'Dokumentenprüfung starten',
    faqTitle: 'Häufige Fragen',
    faqs: [
      { q: 'Wie funktioniert die Prüfung und wo werden meine Daten gespeichert?', a: 'Für die Prüfung der Ausweisdaten verwenden wir einen zertifizierten Dienst. Dieser prüft die Dokumente auf Aktualität und Gültigkeit. GetDoIt speichert keine Ausweisdaten.' },
      { q: 'Das Foto lässt sich nicht hochladen — was tun?', a: 'Prüfen Sie, ob das Bild den Anforderungen entspricht. Wenn das Foto die richtige Qualität und das richtige Format hat, aber nicht hochgeladen werden kann, wenden Sie sich an den Support.' },
      { q: 'Was passiert, wenn ich die Prüfung nicht durchführe?', a: 'Wer seine Dokumente nicht bestätigt hat, kann den Service normal nutzen. Aber ihre Angebote werden niedriger als die von geprüften Dienstleistern angezeigt.' },
      { q: 'Ich habe die Prüfung beim ersten Mal nicht bestanden — was tun?', a: 'Schauen Sie sich den Grund im Bereich "Benachrichtigungen" an. Wenn die Prüfung wegen der Fotoqualität fehlgeschlagen ist, können Sie die Dokumente beliebig oft erneut einreichen.' },
    ],
  },
  en: {
    breadcrumb: ['Help', 'My Profile', 'For Providers'],
    title: 'How to verify your documents on GetDoIt?',
    subtitle: 'Verify your ID and get the "Documents Verified" badge so clients trust you with more tasks.',
    intro: 'If you want to increase your profile effectiveness and get more tasks, we recommend going through the automatic document verification and getting the "Documents Verified" badge.',
    benefit: 'This badge gives you permanent bonus points to your ranking, and your offers will be displayed higher than those of providers without verified documents.',
    howTitle: 'How to verify your documents',
    howIntro: 'Document verification is available for EU and Swiss citizens. It\'s done online and takes just a few minutes.',
    howPrepare: 'Prepare high-quality photos of your ID and a selfie with the document.',
    steps: [
      'Get provider status on GetDoIt.',
      'Add your first offer to a task.',
      'Go to your profile and click "Start Verification".',
      'Upload a photo of your ID.',
      'Upload a selfie with the document.',
    ],
    requirementsTitle: 'Document requirements',
    requirements: [
      'Verification can only be done with a valid national ID card or passport.',
      'The image must show the main page with photo and the issuance information.',
      'The image must be high quality, without glare. Do not edit it in photo editors.',
      'Image format: JPG or PNG.',
    ],
    resultText: 'Wait for the verification results. It usually takes no more than 5 minutes but can take up to 24 hours. After successful verification, the "Documents Verified" badge will appear on your profile.',
    startBtn: 'Start document verification',
    faqTitle: 'Frequently asked questions',
    faqs: [
      { q: 'How does the verification work and where is my data stored?', a: 'We use a certified service for ID verification. It checks documents for validity and authenticity. GetDoIt does not store any ID data.' },
      { q: 'The photo won\'t upload — what should I do?', a: 'Check if the image meets the requirements. If the photo has the right quality and format but can\'t be uploaded, contact support.' },
      { q: 'What happens if I don\'t do the verification?', a: 'Those who haven\'t verified their documents can use the service normally. But their offers will be displayed lower than those of verified providers.' },
      { q: 'I didn\'t pass verification the first time — what should I do?', a: 'Check the reason in the "Notifications" section. If verification failed due to photo quality, you can resubmit documents an unlimited number of times.' },
    ],
  },
};

export default function DocumentVerification() {
  const { lang } = useLang();
  const t = tr[lang];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Header bar */}
        <div className="bg-muted/50 border-b border-border">
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              {t.breadcrumb.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span>›</span>}
                  <span>{item}</span>
                </span>
              ))}
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">{t.title}</h1>
          <p className="text-muted-foreground mb-6">{t.subtitle}</p>

          <p className="text-foreground mb-4">{t.intro}</p>
          <p className="text-foreground mb-8">{t.benefit}</p>

          {/* How to verify */}
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">{t.howTitle}</h2>
          <p className="text-foreground mb-2">{t.howIntro}</p>
          <p className="text-foreground mb-6">{t.howPrepare}</p>

          <ol className="space-y-3 mb-8">
            {t.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-foreground">{step}</span>
              </li>
            ))}
          </ol>

          {/* Visual guide */}
          <div className="bg-muted/30 rounded-xl border border-border p-8 mb-8 flex flex-col items-center gap-6">
            <div className="flex gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground text-center">{lang === 'de' ? 'Ausweis-Foto' : 'ID Photo'}</span>
              </div>
              <div className="flex items-center text-muted-foreground text-2xl">+</div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground text-center">Selfie</span>
              </div>
              <div className="flex items-center text-muted-foreground text-2xl">=</div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <span className="text-sm text-muted-foreground text-center">{lang === 'de' ? 'Bestätigt' : 'Verified'}</span>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">{t.requirementsTitle}</h2>
          <ul className="space-y-2 mb-8">
            {t.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-foreground">
                <span className="text-primary mt-1">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>

          <p className="text-foreground mb-8">{t.resultText}</p>

          <div className="flex justify-center mb-12">
            <Button size="lg" asChild className="text-base px-8 py-6 gap-2">
              <Link to="/dashboard">
                <Shield className="w-5 h-5" />
                {t.startBtn}
              </Link>
            </Button>
          </div>

          {/* FAQ */}
          <h2 className="text-2xl font-display font-bold text-foreground mb-4">{t.faqTitle}</h2>
          <Accordion type="single" collapsible className="mb-12">
            {t.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
