import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, Upload, Camera } from 'lucide-react';

const TOTAL_STEPS = 5;

const categoryOptions = {
  de: [
    { name: 'Kurierdienste', subs: ['Dokumentenlieferung', 'Paketlieferung', 'Einkaufsservice', 'Sonstiges'] },
    { name: 'Renovierung & Bau', subs: ['Malerarbeiten', 'Fliesenlegen', 'Elektrik', 'Sanitär', 'Trockenbau', 'Sonstiges'] },
    { name: 'Umzüge & Transport', subs: ['Privatumzüge', 'Büroumzüge', 'Möbeltransport', 'Entrümpelung', 'Sonstiges'] },
    { name: 'Reinigung & Haushalt', subs: ['Wohnungsreinigung', 'Büroreinigung', 'Fensterreinigung', 'Gartenarbeit', 'Sonstiges'] },
    { name: 'Virtueller Assistent', subs: ['Datenerfassung', 'Recherche', 'E-Mail-Management', 'Terminplanung', 'Sonstiges'] },
    { name: 'IT & Computer-Hilfe', subs: ['PC-Reparatur', 'Netzwerkeinrichtung', 'Softwareinstallation', 'Virenentfernung', 'Sonstiges'] },
    { name: 'Events & Promotion', subs: ['Eventplanung', 'Catering', 'Moderation', 'Flyerverteilung', 'Sonstiges'] },
    { name: 'Design & Grafik', subs: ['Logo & Corporate Identity', 'Webdesign', 'Printdesign', 'Illustrationen', 'Social-Media-Design', '3D-Grafik & Animation', 'Sonstiges'] },
    { name: 'Softwareentwicklung', subs: ['Webentwicklung', 'App-Entwicklung', 'Datenbanken', 'API-Integration', 'Sonstiges'] },
    { name: 'Foto, Video & Audio', subs: ['Fotografie', 'Videoproduktion', 'Audiobearbeitung', 'Livestreaming', 'Sonstiges'] },
    { name: 'Geräte-Installation & Reparatur', subs: ['Haushaltsgeräte', 'Klimaanlagen', 'Heizungen', 'Sonstiges'] },
    { name: 'Schönheit & Gesundheit', subs: ['Friseur', 'Kosmetik', 'Massage', 'Personal Training', 'Sonstiges'] },
    { name: 'Digitale Geräte-Reparatur', subs: ['Smartphone-Reparatur', 'Tablet-Reparatur', 'Laptop-Reparatur', 'Sonstiges'] },
    { name: 'Recht & Buchhaltung', subs: ['Rechtsberatung', 'Buchhaltung', 'Steuererklärung', 'Sonstiges'] },
    { name: 'Nachhilfe & Unterricht', subs: ['Mathematik', 'Sprachen', 'Musik', 'Naturwissenschaften', 'Sonstiges'] },
    { name: 'Fahrzeugreparatur', subs: ['KFZ-Mechanik', 'Reifenwechsel', 'Lackierung', 'Sonstiges'] },
  ],
  en: [
    { name: 'Courier Services', subs: ['Document Delivery', 'Package Delivery', 'Shopping Service', 'Other'] },
    { name: 'Renovation & Construction', subs: ['Painting', 'Tiling', 'Electrical', 'Plumbing', 'Drywall', 'Other'] },
    { name: 'Moving & Transport', subs: ['Home Moving', 'Office Moving', 'Furniture Transport', 'Junk Removal', 'Other'] },
    { name: 'Cleaning & Household', subs: ['Home Cleaning', 'Office Cleaning', 'Window Cleaning', 'Gardening', 'Other'] },
    { name: 'Virtual Assistant', subs: ['Data Entry', 'Research', 'Email Management', 'Scheduling', 'Other'] },
    { name: 'IT & Computer Help', subs: ['PC Repair', 'Network Setup', 'Software Installation', 'Virus Removal', 'Other'] },
    { name: 'Events & Promotions', subs: ['Event Planning', 'Catering', 'Hosting', 'Flyer Distribution', 'Other'] },
    { name: 'Design & Graphics', subs: ['Logo & Branding', 'Web Design', 'Print Design', 'Illustrations', 'Social Media Design', '3D & Animation', 'Other'] },
    { name: 'Software Development', subs: ['Web Development', 'App Development', 'Databases', 'API Integration', 'Other'] },
    { name: 'Photo, Video & Audio', subs: ['Photography', 'Video Production', 'Audio Editing', 'Live Streaming', 'Other'] },
    { name: 'Appliance Installation & Repair', subs: ['Home Appliances', 'Air Conditioning', 'Heating', 'Other'] },
    { name: 'Beauty & Health', subs: ['Hairdressing', 'Cosmetics', 'Massage', 'Personal Training', 'Other'] },
    { name: 'Digital Device Repair', subs: ['Phone Repair', 'Tablet Repair', 'Laptop Repair', 'Other'] },
    { name: 'Legal & Accounting', subs: ['Legal Advice', 'Bookkeeping', 'Tax Returns', 'Other'] },
    { name: 'Tutoring & Education', subs: ['Mathematics', 'Languages', 'Music', 'Science', 'Other'] },
    { name: 'Vehicle Repair', subs: ['Car Mechanics', 'Tire Change', 'Painting', 'Other'] },
  ],
};

const tr = {
  de: {
    introTitle: 'Erzählen Sie von sich',
    introDesc: 'Geben Sie Ihre Kontaktdaten an und wählen Sie die Kategorien, in denen Sie arbeiten möchten. Das dauert etwa 3 Minuten.',
    introBtn: 'Los geht\'s',
    step1Label: 'Über Sie',
    step1Title: 'Wie sollen Auftraggeber Sie sehen?',
    step1Desc: 'Diese Daten werden für die Arbeit auf der Plattform und die Kommunikation mit Auftraggebern benötigt. Der Auftraggeber sieht nur Ihren Namen und Telefonnummer.',
    city: 'Ihre Stadt',
    cityPlaceholder: 'z.B. Berlin',
    firstName: 'Vorname',
    firstNamePlaceholder: 'Max',
    lastName: 'Nachname',
    lastNamePlaceholder: 'Mustermann',
    birthDate: 'Geburtsdatum',
    birthDatePlaceholder: 'TT.MM.JJJJ',
    step2Label: 'Kontakte',
    step2Title: ', wie kann man Sie erreichen?',
    step2Desc: 'Auftraggeber werden Sie per Telefon oder Chat kontaktieren. Per E-Mail senden wir Benachrichtigungen.',
    email: 'E-Mail-Adresse',
    phone: 'Telefonnummer',
    phonePlaceholder: '+49 170 1234567',
    step3Label: 'Profilfoto',
    step3PhotoDesc: 'Nutzer mit einem guten Foto erhalten mehr Vertrauen. Sie können das Foto auch später hinzufügen.',
    uploadPhoto: 'Foto hochladen',
    step4Label: 'Aufgabenkategorien',
    step4Title: 'Was möchten Sie tun?',
    step4Desc: 'Wählen Sie die Kategorien, in denen Sie arbeiten möchten. Sie können mehrere auswählen — ändern können Sie sie jederzeit im Profil.',
    selectAll: 'Alle Unterkategorien auswählen',
    step5Label: 'Über sich erzählen',
    step5Title: 'Erzählen Sie über sich',
    step5Desc: 'Erklären Sie, warum man Sie wählen sollte — das erhöht Ihre Chancen, Aufträge zu bekommen. Den Text können Sie später im Profil ändern oder ergänzen.',
    experienceYears: 'Berufserfahrung (in Jahren)',
    aboutPlaceholder: 'Schreiben Sie über sich und Ihre Fähigkeiten, über die Vorteile der Zusammenarbeit mit Ihnen...',
    aboutLabel: 'Erfahrung, Fähigkeiten und Vorteile',
    charLimit: '50 bis 4000 Zeichen',
    canFillLater: 'Sie können den Text über sich später ausfüllen.',
    next: 'Weiter',
    back: 'Zurück',
    submit: 'Dienstleister werden',
    disclaimer: 'Mit der Fortsetzung der Verifizierung bestätigen Sie, dass Sie diese zum ersten Mal durchführen, wahrheitsgemäße Angaben gemacht haben und der Verarbeitung personenbezogener Daten zustimmen.',
    requiredFields: 'Bitte füllen Sie alle Pflichtfelder aus',
    minCategories: 'Bitte wählen Sie mindestens eine Kategorie',
    success: 'Verifizierung abgeschlossen! Ihr Profil wird freigeschaltet.',
  },
  en: {
    introTitle: 'Tell us about yourself',
    introDesc: 'Provide your contact details and choose the task categories you want to work in. It takes about 3 minutes.',
    introBtn: 'Let\'s go',
    step1Label: 'About You',
    step1Title: 'How should clients see you?',
    step1Desc: 'This information is needed for working on the platform and communicating with clients. Clients will only see your name and phone number.',
    city: 'Your City',
    cityPlaceholder: 'e.g. Berlin',
    firstName: 'First Name',
    firstNamePlaceholder: 'John',
    lastName: 'Last Name',
    lastNamePlaceholder: 'Doe',
    birthDate: 'Date of Birth',
    birthDatePlaceholder: 'DD.MM.YYYY',
    step2Label: 'Contacts',
    step2Title: ', how can we reach you?',
    step2Desc: 'Clients will contact you by phone or chat. We\'ll send notifications to your email.',
    email: 'Email Address',
    phone: 'Phone Number',
    phonePlaceholder: '+49 170 1234567',
    step3Label: 'Profile Photo',
    step3PhotoDesc: 'Users with a good photo get more trust. You can add a photo later.',
    uploadPhoto: 'Upload Photo',
    step4Label: 'Task Categories',
    step4Title: 'What do you want to do?',
    step4Desc: 'Choose the task categories you want to work in. You can select multiple — you can always change them in your profile.',
    selectAll: 'Select all subcategories',
    step5Label: 'About Yourself',
    step5Title: 'Tell about yourself',
    step5Desc: 'Explain why someone should choose you — this increases your chances of getting tasks. You can change or fill in the text later in your profile.',
    experienceYears: 'Experience (in years)',
    aboutPlaceholder: 'Write about yourself and your skills, about the benefits of working with you...',
    aboutLabel: 'Experience, skills and advantages',
    charLimit: '50 to 4000 characters',
    canFillLater: 'You can fill in the text about yourself later.',
    next: 'Next',
    back: 'Back',
    submit: 'Become a Provider',
    disclaimer: 'By continuing verification, you confirm that you are doing this for the first time, have provided accurate information, and agree to the processing of personal data.',
    requiredFields: 'Please fill in all required fields',
    minCategories: 'Please select at least one category',
    success: 'Verification complete! Your profile will be activated.',
  },
};

export default function Verification() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const { toast } = useToast();
  const t = tr[lang];
  const cats = categoryOptions[lang];

  const [step, setStep] = useState(0); // 0 = intro
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<number>>(new Set());
  const [selectedSubs, setSelectedSubs] = useState<Set<string>>(new Set());
  const [experienceYears, setExperienceYears] = useState('');
  const [about, setAbout] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (authLoading) return null;
  if (!user) {
    navigate('/auth');
    return null;
  }

  const userEmail = user.email || '';

  const progressPercent = step === 0 ? 0 : (step / TOTAL_STEPS) * 100;

  const stepLabels = [
    '', t.step1Label, t.step2Label, t.step3Label, t.step4Label, t.step5Label,
  ];

  const toggleCat = (idx: number) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const toggleSub = (sub: string) => {
    setSelectedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(sub)) next.delete(sub); else next.add(sub);
      return next;
    });
  };

  const selectAllSubs = (catIdx: number) => {
    const cat = cats[catIdx];
    setSelectedSubs((prev) => {
      const next = new Set(prev);
      const allSelected = cat.subs.every((s) => next.has(`${cat.name}::${s}`));
      cat.subs.forEach((s) => {
        const key = `${cat.name}::${s}`;
        if (allSelected) next.delete(key); else next.add(key);
      });
      return next;
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleNext = () => {
    if (step === 1 && (!firstName.trim() || !city.trim())) {
      toast({ title: t.requiredFields, variant: 'destructive' });
      return;
    }
    if (step === 2 && !phone.trim()) {
      toast({ title: t.requiredFields, variant: 'destructive' });
      return;
    }
    if (step === 4 && selectedSubs.size === 0) {
      toast({ title: t.minCategories, variant: 'destructive' });
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `${user.id}/avatar.${ext}`;
        await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true });
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }

      await supabase.from('profiles').update({
        name: firstName,
        last_name: lastName,
        city,
        phone,
        date_of_birth: birthDate,
        about,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
        role: 'provider' as any,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      } as any).eq('id', user.id);

      toast({ title: t.success });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Progress bar */}
        {step > 0 && (
          <div className="w-full max-w-3xl mx-auto px-4 pt-6">
            <p className="text-sm text-muted-foreground text-center mb-2">
              {lang === 'de' ? `Schritt ${step} von ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`} - {stepLabels[step]}
            </p>
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="max-w-xl mx-auto px-4 py-10">
          {/* Step 0: Intro */}
          {step === 0 && (
            <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{t.introTitle}</h1>
              <p className="text-muted-foreground mb-8 leading-relaxed">{t.introDesc}</p>
              <Button
                size="lg"
                className="w-full max-w-xs mx-auto text-base py-6"
                onClick={() => setStep(1)}
              >
                {t.introBtn}
              </Button>
            </div>
          )}

          {/* Step 1: Personal info */}
          {step === 1 && (
            <div className="bg-card rounded-2xl border border-border p-8 sm:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-2">{t.step1Title}</h2>
              <p className="text-sm text-muted-foreground text-center mb-8">{t.step1Desc}</p>
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground">{t.city} *</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={t.cityPlaceholder} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">{t.firstName} *</label>
                  <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t.firstNamePlaceholder} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">{t.lastName}</label>
                  <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t.lastNamePlaceholder} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">{t.birthDate}</label>
                  <Input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder={t.birthDatePlaceholder} className="mt-1" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="outline" className="flex-1 py-5" onClick={() => setStep(0)}>{t.back}</Button>
                <Button className="flex-1 py-5" onClick={handleNext}>{t.next}</Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">{t.disclaimer}</p>
            </div>
          )}

          {/* Step 2: Contacts */}
          {step === 2 && (
            <div className="bg-card rounded-2xl border border-border p-8 sm:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-2">
                {firstName}{t.step2Title}
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-8">{t.step2Desc}</p>
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground">{t.email}</label>
                  <Input value={userEmail} disabled className="mt-1 bg-muted/50" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">{t.phone} *</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phonePlaceholder} className="mt-1" />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="outline" className="flex-1 py-5" onClick={() => setStep(1)}>{t.back}</Button>
                <Button className="flex-1 py-5" onClick={handleNext}>{t.next}</Button>
              </div>
            </div>
          )}

          {/* Step 3: Photo */}
          {step === 3 && (
            <div className="bg-card rounded-2xl border border-border p-8 sm:p-10 text-center">
              <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4 overflow-hidden flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-muted-foreground" />
                )}
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">{firstName} {lastName}</h2>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-3 mb-6"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                {t.uploadPhoto}
              </Button>
              <p className="text-sm text-muted-foreground mb-6">{t.step3PhotoDesc}</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 py-5" onClick={() => setStep(2)}>{t.back}</Button>
                <Button className="flex-1 py-5" onClick={handleNext}>{t.next}</Button>
              </div>
            </div>
          )}

          {/* Step 4: Categories */}
          {step === 4 && (
            <div className="bg-card rounded-2xl border border-border p-8 sm:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-2">{t.step4Title}</h2>
              <p className="text-sm text-muted-foreground text-center mb-8">{t.step4Desc}</p>
              <div className="divide-y divide-border">
                {cats.map((cat, idx) => {
                  const isOpen = expandedCats.has(idx);
                  const catSubKeys = cat.subs.map((s) => `${cat.name}::${s}`);
                  const selectedCount = catSubKeys.filter((k) => selectedSubs.has(k)).length;
                  return (
                    <div key={cat.name}>
                      <button
                        onClick={() => toggleCat(idx)}
                        className="w-full flex items-center justify-between py-4 text-left"
                      >
                        <span className="font-medium text-foreground">
                          {cat.name}
                          {selectedCount > 0 && (
                            <span className="ml-2 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              {selectedCount}
                            </span>
                          )}
                        </span>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                      </button>
                      {isOpen && (
                        <div className="pb-4 flex flex-wrap gap-2">
                          <button
                            onClick={() => selectAllSubs(idx)}
                            className="px-4 py-2 rounded-full border border-border text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            {t.selectAll}
                          </button>
                          {cat.subs.map((sub) => {
                            const key = `${cat.name}::${sub}`;
                            const selected = selectedSubs.has(key);
                            return (
                              <button
                                key={key}
                                onClick={() => toggleSub(key)}
                                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                                  selected
                                    ? 'border-primary bg-primary/10 text-primary font-medium'
                                    : 'border-border text-foreground hover:bg-muted'
                                }`}
                              >
                                {sub}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="outline" className="flex-1 py-5" onClick={() => setStep(3)}>{t.back}</Button>
                <Button className="flex-1 py-5" onClick={handleNext}>{t.next}</Button>
              </div>
            </div>
          )}

          {/* Step 5: About */}
          {step === 5 && (
            <div className="bg-card rounded-2xl border border-border p-8 sm:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center mb-2">{t.step5Title}</h2>
              <p className="text-sm text-muted-foreground text-center mb-8">{t.step5Desc}</p>
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground">{t.experienceYears}</label>
                  <Input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="mt-1"
                    min={0}
                    max={60}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">{t.aboutLabel}</label>
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder={t.aboutPlaceholder}
                    rows={5}
                    maxLength={4000}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t.charLimit}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="outline" className="flex-1 py-5" onClick={() => setStep(4)}>{t.back}</Button>
                <Button className="flex-1 py-5" onClick={handleSubmit} disabled={submitting}>
                  {t.submit}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">{t.canFillLater}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
