import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Upload, Phone, User, MapPin, Briefcase, ArrowRight, Shield } from 'lucide-react';

const categoryOptions = {
  de: [
    'Kurierdienste', 'Renovierung & Bau', 'Umzüge & Transport', 'Reinigung & Haushalt',
    'IT & Computer-Hilfe', 'Foto, Video & Audio', 'Softwareentwicklung', 'Geräte-Installation & Reparatur',
    'Events & Promotion', 'Design & Grafik', 'Virtueller Assistent', 'Digitale Geräte-Reparatur',
    'Schönheit & Gesundheit', 'Recht & Buchhaltung', 'Fahrzeugreparatur', 'Nachhilfe & Unterricht',
  ],
  en: [
    'Courier Services', 'Renovation & Construction', 'Moving & Transport', 'Cleaning & Household',
    'IT & Computer Help', 'Photo, Video & Audio', 'Software Development', 'Appliance Installation & Repair',
    'Events & Promotions', 'Design & Graphics', 'Virtual Assistant', 'Digital Device Repair',
    'Beauty & Health', 'Legal & Accounting', 'Vehicle Repair', 'Tutoring & Education',
  ],
};

const tr = {
  de: {
    title: 'Dienstleister werden',
    subtitle: 'Füllen Sie die folgenden Schritte aus, um als Dienstleister verifiziert zu werden und Aufträge zu erhalten.',
    step1: 'Persönliche Daten',
    step2: 'Dienstleistungen',
    step3: 'Verifizierung',
    fullName: 'Vollständiger Name',
    fullNamePlaceholder: 'Max Mustermann',
    phone: 'Telefonnummer',
    phonePlaceholder: '+49 170 1234567',
    city: 'Stadt',
    cityPlaceholder: 'z.B. Berlin',
    aboutYou: 'Über Sie',
    aboutYouPlaceholder: 'Erzählen Sie potenziellen Auftraggebern etwas über sich, Ihre Erfahrung und Fähigkeiten...',
    selectCategories: 'Wählen Sie Ihre Dienstleistungen',
    selectCategoriesDesc: 'Markieren Sie die Kategorien, in denen Sie arbeiten möchten',
    uploadId: 'Ausweisdokument hochladen',
    uploadIdDesc: 'Laden Sie ein Foto Ihres Personalausweises oder Reisepasses hoch. Ihre Daten werden vertraulich behandelt.',
    uploadBtn: 'Dokument hochladen',
    terms: 'Ich stimme den Nutzungsbedingungen für Dienstleister zu',
    next: 'Weiter',
    back: 'Zurück',
    submit: 'Verifizierung abschließen',
    success: 'Verifizierung eingereicht! Wir prüfen Ihre Angaben und schalten Ihr Profil frei.',
    minCategories: 'Bitte wählen Sie mindestens eine Kategorie',
    requiredFields: 'Bitte füllen Sie alle Pflichtfelder aus',
  },
  en: {
    title: 'Become a Provider',
    subtitle: 'Complete the following steps to get verified as a service provider and start receiving tasks.',
    step1: 'Personal Info',
    step2: 'Services',
    step3: 'Verification',
    fullName: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    phone: 'Phone Number',
    phonePlaceholder: '+49 170 1234567',
    city: 'City',
    cityPlaceholder: 'e.g. Berlin',
    aboutYou: 'About You',
    aboutYouPlaceholder: 'Tell potential clients about yourself, your experience and skills...',
    selectCategories: 'Select Your Services',
    selectCategoriesDesc: 'Check the categories you want to work in',
    uploadId: 'Upload ID Document',
    uploadIdDesc: 'Upload a photo of your ID card or passport. Your data will be treated confidentially.',
    uploadBtn: 'Upload Document',
    terms: 'I agree to the Terms of Service for providers',
    next: 'Next',
    back: 'Back',
    submit: 'Complete Verification',
    success: 'Verification submitted! We will review your details and activate your profile.',
    minCategories: 'Please select at least one category',
    requiredFields: 'Please fill in all required fields',
  },
};

export default function Verification() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const { toast } = useToast();
  const t = tr[lang];
  const cats = categoryOptions[lang];

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return null;
  if (!user) {
    navigate('/auth');
    return null;
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleNext = () => {
    if (step === 1 && (!fullName.trim() || !phone.trim() || !city.trim())) {
      toast({ title: t.requiredFields, variant: 'destructive' });
      return;
    }
    if (step === 2 && selectedCategories.length === 0) {
      toast({ title: t.minCategories, variant: 'destructive' });
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!agreedTerms) return;
    setSubmitting(true);
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'provider' as any, name: fullName, city })
      .eq('id', user.id);
    if (!error) {
      toast({ title: t.success });
      setTimeout(() => navigate('/dashboard'), 2000);
    }
    setSubmitting(false);
  };

  const steps = [
    { num: 1, label: t.step1, icon: User },
    { num: 2, label: t.step2, icon: Briefcase },
    { num: 3, label: t.step3, icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-display font-bold text-foreground text-center mb-2">{t.title}</h1>
        <p className="text-muted-foreground text-center mb-10">{t.subtitle}</p>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s.num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-sm hidden sm:inline ${step >= s.num ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border p-6 sm:p-8">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <Label>{t.fullName} *</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t.fullNamePlaceholder} className="mt-1" />
              </div>
              <div>
                <Label>{t.phone} *</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phonePlaceholder} className="pl-10" />
                </div>
              </div>
              <div>
                <Label>{t.city} *</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t.cityPlaceholder} className="pl-10" />
                </div>
              </div>
              <div>
                <Label>{t.aboutYou}</Label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder={t.aboutYouPlaceholder}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>
          )}

          {/* Step 2: Categories */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">{t.selectCategories}</h2>
              <p className="text-sm text-muted-foreground mb-5">{t.selectCategoriesDesc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cats.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                      selectedCategories.includes(cat)
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border bg-background text-foreground hover:border-primary/50'
                    }`}
                  >
                    {selectedCategories.includes(cat) && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">{t.uploadId}</h2>
                <p className="text-sm text-muted-foreground mb-4">{t.uploadIdDesc}</p>
                <button className="flex items-center gap-2 px-5 py-3 rounded-lg border border-dashed border-border hover:border-primary text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Upload className="w-5 h-5" />
                  {t.uploadBtn}
                </button>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-foreground">{t.terms}</span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>{t.back}</Button>
            ) : <div />}
            {step < 3 ? (
              <Button onClick={handleNext}>
                {t.next} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!agreedTerms || submitting}>
                {t.submit}
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
