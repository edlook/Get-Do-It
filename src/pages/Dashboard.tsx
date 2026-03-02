import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLang } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, Camera, Mail, Edit2, Plus, Clock, Shield, Settings, ArrowRight, X, Upload, CreditCard, Check, Wallet } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Tables } from '@/integrations/supabase/types';
import blogBestProvider from '@/assets/blog-best-provider.png';
import blogFirstTask from '@/assets/blog-first-task.png';
import blogOnlineSafety from '@/assets/blog-online-safety.png';

type Profile = Tables<'profiles'>;
type Task = Tables<'tasks'>;

const blogPosts = [
  { slug: 'best-provider', image: blogBestProvider, de: 'Wie man den besten Dienstleister findet', en: 'How to Find the Best Provider' },
  { slug: 'first-task', image: blogFirstTask, de: 'Tipps für die erste Auftragsstellung', en: 'Tips for Your First Task' },
  { slug: 'online-safety', image: blogOnlineSafety, de: 'Sicherheit bei Online-Aufträgen', en: 'Safety with Online Tasks' },
];

const socialProviders = [
  { name: 'Google', icon: 'G', color: 'bg-red-50 text-red-500' },
  { name: 'Apple ID', icon: '', color: 'bg-gray-100 text-gray-800' },
  { name: 'Facebook', icon: 'f', color: 'bg-blue-50 text-blue-600' },
];

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileViews, setProfileViews] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [docVerifyOpen, setDocVerifyOpen] = useState(false);
  const [docCountry, setDocCountry] = useState('');
  const [docStep, setDocStep] = useState(0); // 0=intro, 1=upload, 2=payment, 3=done
  const [docFiles, setDocFiles] = useState<File[]>([]);
  const [tariffOpen, setTariffOpen] = useState(false);
  const [tariffType, setTariffType] = useState<'unlimited' | 'basic' | null>(null);
  const [tariffStep, setTariffStep] = useState(0); // 0=categories, 1=pricing, 2=balance
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<'25' | '50' | '100'>('50');
  const [selectedUnlimitedDays, setSelectedUnlimitedDays] = useState<'15' | '30' | '90'>('30');
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const [settingsSubTab, setSettingsSubTab] = useState(searchParams.get('sub') || 'general');
  const activeTab = searchParams.get('tab') || 'about';

  useEffect(() => {
    const sub = searchParams.get('sub');
    if (sub) setSettingsSubTab(sub);
  }, [searchParams]);
  const [editLastName, setEditLastName] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPhone, setSavingPhone] = useState(false);
  const docFileRef = useRef<HTMLInputElement>(null);

  const tr = {
    de: {
      greeting: 'Hallo',
      noRatings: 'Keine Bewertungen',
      aboutMe: 'Über mich',
      account: 'Konto',
      insurance: 'Versicherung',
      aboutMeTitle: 'Ein wenig über mich',
      add: 'Hinzufügen',
      noRatingsTitle: 'Sie haben derzeit keine Bewertungen',
      noRatingsDesc: 'Auftraggeber bewerten alle Dienstleister nach verschiedenen Kriterien wie Preis, Qualität, Höflichkeit',
      noReviewsTitle: 'Noch keine Bewertungen',
      noReviewsDesc: 'Bewertungen erscheinen, nachdem Sie einen Auftrag erstellt oder ausgeführt haben',
      becomeProvider: 'Werden Sie Dienstleister und verdienen Sie Geld.',
      becomeProviderBtn: 'Ich möchte Dienstleister werden',
      verifiedContacts: 'Bestätigte Kontakte',
      trustDesc: 'Erhöhen Sie das Vertrauen der Nutzer — verknüpfen Sie Ihre Konten sozialer Netzwerke mit Ihrem GetDoIt-Profil. Wir verpflichten uns, Ihre Kontakte nicht offenzulegen.',
      link: 'Verknüpfen',
      changePhoto: 'Foto ändern',
      edit: 'Bearbeiten',
      save: 'Speichern',
      cancel: 'Abbrechen',
      name: 'Name',
      city: 'Stadt',
      saved: 'Profil gespeichert',
      myTasks: 'Meine Aufträge',
      noTasks: 'Sie haben noch keine Aufträge erstellt.',
      createTask: 'Auftrag erstellen',
      logout: 'Abmelden',
      budget: 'Budget',
      status: { open: 'Offen', in_progress: 'In Bearbeitung', completed: 'Erledigt', cancelled: 'Storniert' },
      profileViews: 'Profilaufrufe',
      balance: 'Ihr Guthaben',
      bonuses: 'Bonuspunkte',
      history: 'Transaktionsverlauf',
      noTransactions: 'Für diesen Zeitraum liegen keine Transaktionen vor.',
      insuranceTitle: 'Versicherung — Schutz bei Schäden',
      insuranceDesc: 'Aktivieren Sie die Versicherung und zahlen Sie nicht für versehentliche Schäden während der Arbeit. Bis zu 10.000 € Erstattung für Ihre Auftraggeber. Gültig für 30 Tage.',
      blogTitle: 'Neue Artikel im Blog',
      allArticles: 'Alle Artikel',
      roleUpdated: 'Rolle aktualisiert',
      years: 'Jahre',
      experienceYears: 'Berufserfahrung',
      experienceWarning: 'Auftraggeber wissen nichts über Sie. Fügen Sie Informationen über Ihre Erfahrung hinzu.',
      portfolioTitle: 'Beispiele Ihrer Arbeit',
      portfolioDesc: 'Wenn Sie Beispiele Ihrer ausgeführten Arbeiten haben, fügen Sie diese unbedingt hinzu. Das zeigt Sie im besten Licht vor den Auftraggebern und schafft mehr Vertrauen.',
      createAlbum: 'Fotoalbum erstellen',
      videoTitle: 'Fügen Sie ein Video über sich hinzu',
      videoDesc: 'Profile mit Video erhalten mehr Aufmerksamkeit und wecken Vertrauen. Dienstleister mit Video werden 25% häufiger gewählt.',
      videoPlaceholder: 'Link zum YouTube-Video',
      videoAdd: 'Hinzufügen',
      settingsGeneral: 'Allgemeine Einstellungen',
      settingsNotifications: 'Benachrichtigungen',
      settingsSubscriptions: 'Auftragsabonnements',
      settingsSecurity: 'Sicherheit',
      personalData: 'Persönliche Daten',
      lastName: 'Nachname',
      dateOfBirth: 'Geburtsdatum',
      gender: 'Geschlecht',
      male: 'Männlich',
      female: 'Weiblich',
      email: 'E-Mail',
      emailHint: 'Ihre E-Mail ist nur für Sie sichtbar',
      savePersonalData: 'Persönliche Daten speichern',
      phoneNumber: 'Telefonnummer',
      contactNumber: 'Kontaktnummer',
      phoneHint: 'Ihre Telefonnummer ist nur für Sie sichtbar',
      savePhone: 'Telefonnummer speichern',
      businessStatus: 'Business-Status',
      businessDesc: 'Business-Dienstleister können auf Aufträge von Unternehmen reagieren.',
      activateBusiness: 'Business-Status aktivieren',
      deleteProfile: 'Profil löschen',
      notifSettings: 'Stellen Sie hier ein, welche Benachrichtigungen Sie erhalten möchten.',
      subSettings: 'Verwalten Sie Ihre Auftragsabonnements und Kategorien.',
      securitySettings: 'Verwalten Sie Ihre Sicherheitseinstellungen und Passwort.',
      changePassword: 'Passwort ändern',
      twoFactor: 'Zwei-Faktor-Authentifizierung',
      twoFactorDesc: 'Aktivieren Sie die Zwei-Faktor-Authentifizierung für zusätzliche Sicherheit.',
      activate: 'Aktivieren',
      dataSaved: 'Daten gespeichert',
      phoneSaved: 'Telefonnummer gespeichert',
    },
    en: {
      greeting: 'Hello',
      noRatings: 'No ratings',
      aboutMe: 'About me',
      account: 'Account',
      insurance: 'Insurance',
      aboutMeTitle: 'A little about me',
      add: 'Add',
      noRatingsTitle: 'You have no ratings at the moment',
      noRatingsDesc: 'Clients rate all service providers on various criteria such as price, quality, politeness',
      noReviewsTitle: 'No reviews yet',
      noReviewsDesc: 'Reviews will appear after you create or complete a task',
      becomeProvider: 'Become a service provider and start earning.',
      becomeProviderBtn: 'I want to become a provider',
      verifiedContacts: 'Verified contacts',
      trustDesc: 'Increase user trust — link your social network accounts to your GetDoIt profile. We pledge not to disclose your contacts.',
      link: 'Link',
      changePhoto: 'Change photo',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      name: 'Name',
      city: 'City',
      saved: 'Profile saved',
      myTasks: 'My Tasks',
      noTasks: "You haven't created any tasks yet.",
      createTask: 'Create Task',
      logout: 'Log out',
      budget: 'Budget',
      status: { open: 'Open', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' },
      profileViews: 'profile views',
      balance: 'Your balance',
      bonuses: 'bonus points',
      history: 'Transaction history',
      noTransactions: 'No transactions for this period.',
      insuranceTitle: 'Insurance — damage protection',
      insuranceDesc: 'Activate insurance and don\'t pay for accidental damage during work. Up to €10,000 reimbursement for your clients. Valid for 30 days.',
      blogTitle: 'New blog posts',
      allArticles: 'All articles',
      roleUpdated: 'Role updated',
      years: 'years',
      experienceYears: 'Experience',
      experienceWarning: 'Clients don\'t know anything about you. Add information about your experience.',
      portfolioTitle: 'Work examples',
      portfolioDesc: 'If you have examples of your completed work, be sure to attach them. This will show you in the best light to task creators and build more trust.',
      createAlbum: 'Create photo album',
      videoTitle: 'Add a video about yourself',
      videoDesc: 'Profiles with video get more attention and build trust. Providers with video are chosen 25% more often.',
      videoPlaceholder: 'Link to YouTube video',
      videoAdd: 'Add',
      settingsGeneral: 'General settings',
      settingsNotifications: 'Notifications',
      settingsSubscriptions: 'Task subscriptions',
      settingsSecurity: 'Security',
      personalData: 'Personal data',
      lastName: 'Last name',
      dateOfBirth: 'Date of birth',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      email: 'Email',
      emailHint: 'Your email is only visible to you',
      savePersonalData: 'Save personal data',
      phoneNumber: 'Phone number',
      contactNumber: 'Contact number',
      phoneHint: 'Your phone number is only visible to you',
      savePhone: 'Save phone number',
      businessStatus: 'Business status',
      businessDesc: 'Business providers can respond to tasks from companies.',
      activateBusiness: 'Activate business status',
      deleteProfile: 'Delete profile',
      notifSettings: 'Configure which notifications you want to receive.',
      subSettings: 'Manage your task subscriptions and categories.',
      securitySettings: 'Manage your security settings and password.',
      changePassword: 'Change password',
      twoFactor: 'Two-factor authentication',
      twoFactorDesc: 'Enable two-factor authentication for additional security.',
      activate: 'Activate',
      dataSaved: 'Data saved',
      phoneSaved: 'Phone number saved',
    },
  };
  const t = tr[lang];

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, tasksRes, viewsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('profile_views').select('id', { count: 'exact', head: true }).eq('profile_id', user.id),
      ]);
      if (profileRes.data) {
        setProfile(profileRes.data);
        setEditName(profileRes.data.name);
        setEditCity(profileRes.data.city || '');
        setEditLastName(profileRes.data.last_name || '');
        setEditDob(profileRes.data.date_of_birth || '');
        setEditPhone(profileRes.data.phone || '');
        setEditEmail(user.email || '');
      }
      if (tasksRes.data) setTasks(tasksRes.data);
      setProfileViews(viewsRes.count ?? 0);
    };
    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ name: editName, city: editCity }).eq('id', user.id);
    if (!error) {
      setProfile((p) => p ? { ...p, name: editName, city: editCity } : p);
      setEditing(false);
      toast({ title: t.saved });
    }
    setSaving(false);
  };

  const handleSavePersonalData = async () => {
    if (!user) return;
    setSavingSettings(true);
    const { error } = await supabase.from('profiles').update({
      name: editName,
      last_name: editLastName,
      date_of_birth: editDob,
      city: editCity,
    }).eq('id', user.id);
    if (!error) {
      setProfile((p) => p ? { ...p, name: editName, last_name: editLastName, date_of_birth: editDob, city: editCity } : p);
      toast({ title: t.dataSaved });
    }
    setSavingSettings(false);
  };

  const handleSavePhone = async () => {
    if (!user) return;
    setSavingPhone(true);
    const { error } = await supabase.from('profiles').update({ phone: editPhone }).eq('id', user.id);
    if (!error) {
      setProfile((p) => p ? { ...p, phone: editPhone } : p);
      toast({ title: t.phoneSaved });
    }
    setSavingPhone(false);
  };


  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (uploadError) {
        toast({ title: 'Upload error', description: uploadError.message, variant: 'destructive' });
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      const avatarUrl = urlData.publicUrl + '?t=' + Date.now();
      await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
      setProfile((p) => p ? { ...p, avatar_url: avatarUrl } : p);
    } catch (err) {
      console.error('Avatar upload failed', err);
    }
    setUploading(false);
  };

  const handleBecomeProvider = () => {
    navigate('/become-provider');
  };

  if (authLoading || !user) return null;

  const statusColor: Record<string, string> = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
  };

  const displayName = profile?.name || user.email?.split('@')[0] || '';

  // Calculate age from date_of_birth
  const calculateAge = (dob: string | null) => {
    if (!dob) return null;
    const parts = dob.includes('.') ? dob.split('.').reverse() : dob.split('-');
    const birth = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age;
  };
  const userAge = calculateAge(profile?.date_of_birth ?? null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-display font-bold text-foreground">
                {t.greeting}, {displayName}!
              </h1>
              <span className="text-sm text-muted-foreground">👁 {profileViews} {t.profileViews}</span>
            </div>

            {/* Avatar + Info */}
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-40 h-40 rounded-lg overflow-hidden bg-muted border border-border">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-secondary rounded-lg px-4 py-2"
                >
                  <Camera className="w-4 h-4" />
                  {uploading ? '...' : t.changePhoto}
                </button>
              </div>

              <div className="flex flex-col justify-center gap-1">
                {editing ? (
                  <div className="space-y-3">
                    <div>
                      <Label>{t.name}</Label>
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label>{t.city}</Label>
                      <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} className="mt-1" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave} disabled={saving}>{t.save}</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditing(false)}>{t.cancel}</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-base text-muted-foreground flex items-center gap-2 flex-wrap">
                      {userAge && <span>{userAge} {t.years}</span>}
                      {profile?.city && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-green-500" /> {profile.city}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{t.noRatings}</p>
                    {/* Badge shields */}
                    <TooltipProvider delayDuration={200}>
                      <div className="flex items-center gap-3 mt-3">
                        {/* TOP badge */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-14 h-14 cursor-help relative">
                              <svg viewBox="0 0 60 60" className="w-full h-full">
                                {/* Shield shape with dashed border */}
                                <path
                                  d="M30 4 L52 14 L52 30 Q52 48 30 56 Q8 48 8 30 L8 14 Z"
                                  fill="none"
                                  stroke="hsl(var(--muted-foreground) / 0.3)"
                                  strokeWidth="2"
                                  strokeDasharray="4 3"
                                />
                                <text x="30" y="34" textAnchor="middle" className="fill-muted-foreground text-[11px] font-bold">TOP</text>
                              </svg>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[220px] text-center p-3">
                            <p className="font-semibold mb-1">{lang === 'de' ? 'TOP-Dienstleister' : 'TOP Provider Badge'}</p>
                            <p className="text-xs">{lang === 'de' ? 'Wird vergeben, wenn Sie die Top 50 im Ranking Ihrer Kategorie erreichen.' : 'Awarded when you reach the top 50 in your category ranking.'}</p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Completed tasks badge */}
                        {(() => {
                          const completedCount = tasks.filter(t2 => t2.status === 'completed').length;
                          const isActive = completedCount >= 50;
                          const badgeColor = completedCount >= 150
                            ? { stroke: 'hsl(45, 93%, 47%)', fill: 'hsl(45, 93%, 47%, 0.1)', glow: '0 0 12px hsl(45, 93%, 47%, 0.5)' } // gold
                            : completedCount >= 100
                            ? { stroke: 'hsl(262, 83%, 58%)', fill: 'hsl(262, 83%, 58%, 0.1)', glow: '0 0 12px hsl(262, 83%, 58%, 0.5)' } // purple
                            : completedCount >= 50
                            ? { stroke: 'hsl(142, 71%, 45%)', fill: 'hsl(142, 71%, 45%, 0.1)', glow: '0 0 12px hsl(142, 71%, 45%, 0.5)' } // green
                            : null;
                          const levelLabel = completedCount >= 150 ? '150+' : completedCount >= 100 ? '100+' : completedCount >= 50 ? '50+' : '';
                          return (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="w-14 h-14 cursor-help relative transition-all duration-300" style={isActive ? { filter: 'none' } : {}}>
                                  <svg viewBox="0 0 60 60" className="w-full h-full" style={isActive ? { filter: `drop-shadow(${badgeColor!.glow})` } : {}}>
                                    <path
                                      d="M30 4 L52 14 L52 30 Q52 48 30 56 Q8 48 8 30 L8 14 Z"
                                      fill={isActive ? badgeColor!.fill : 'none'}
                                      stroke={isActive ? badgeColor!.stroke : 'hsl(var(--muted-foreground) / 0.3)'}
                                      strokeWidth="2"
                                      strokeDasharray={isActive ? 'none' : '4 3'}
                                    />
                                    <text x="30" y="35" textAnchor="middle" className={isActive ? 'text-[16px]' : 'fill-muted-foreground/40 text-[16px]'} style={isActive ? {} : { filter: 'grayscale(1)' }}>👍</text>
                                  </svg>
                                  {isActive && (
                                    <span className="absolute -bottom-1 -right-1 text-[9px] font-bold rounded-full px-1" style={{ background: badgeColor!.stroke, color: 'white' }}>{levelLabel}</span>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[220px] text-center p-3">
                                <p className="font-semibold mb-1">{lang === 'de' ? 'Abgeschlossene Aufträge' : 'Completed Tasks Badge'}</p>
                                <p className="text-xs">{lang === 'de'
                                  ? `Wird vergeben bei 50, 100, 150 abgeschlossenen Aufträgen. Aktuell: ${completedCount}`
                                  : `Awarded at 50, 100, 150 completed tasks. Current: ${completedCount}`}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })()}

                        {/* Success rate badge */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-14 h-14 cursor-help relative">
                              <svg viewBox="0 0 60 60" className="w-full h-full">
                                <path
                                  d="M30 4 L52 14 L52 30 Q52 48 30 56 Q8 48 8 30 L8 14 Z"
                                  fill="none"
                                  stroke="hsl(var(--muted-foreground) / 0.3)"
                                  strokeWidth="2"
                                  strokeDasharray="4 3"
                                />
                                <text x="30" y="35" textAnchor="middle" className="fill-muted-foreground text-[14px] font-bold">%</text>
                              </svg>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[220px] text-center p-3">
                            <p className="font-semibold mb-1">{lang === 'de' ? 'Erfolgsquote' : 'Success Rate Badge'}</p>
                            <p className="text-xs">{lang === 'de' ? 'Wird vergeben bei Abschluss von 10 Aufträgen.' : 'Awarded after completing 10 tasks.'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                    <button onClick={() => setEditing(true)} className="text-sm text-primary hover:underline mt-3 self-start flex items-center gap-1">
                      <Edit2 className="w-3.5 h-3.5" /> {t.edit}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(val) => navigate(`/dashboard?tab=${val}`, { replace: true })} className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
                <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base">
                  {t.aboutMe}
                </TabsTrigger>
                <TabsTrigger value="tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base">
                  {t.myTasks}
                </TabsTrigger>
                <TabsTrigger value="account" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base">
                  {t.account}
                </TabsTrigger>
                <TabsTrigger value="tariffs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base flex items-center gap-1">
                  {lang === 'de' ? 'Tarife' : 'Tariffs'}
                  <span className="text-xs bg-accent text-accent-foreground rounded-full px-1.5 py-0.5 font-bold">-50%</span>
                </TabsTrigger>
                <TabsTrigger value="insurance" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base">
                  {t.insurance}
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3">
                  <Settings className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              {/* About Me */}
              <TabsContent value="about" className="pt-8 space-y-10">
                {/* About me + experience */}
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                    {t.aboutMeTitle}
                    <button className="text-sm font-normal text-primary hover:underline flex items-center gap-1">
                      <Edit2 className="w-3.5 h-3.5" /> {t.add}
                    </button>
                  </h2>
                  {profile?.experience_years && (
                    <p className="text-foreground mt-2">
                      {t.experienceYears} {profile.experience_years} {t.years}
                    </p>
                  )}
                  {profile?.about ? (
                    <p className="text-muted-foreground mt-1">{profile.about}</p>
                  ) : (
                    <p className="text-destructive mt-2 text-sm">{t.experienceWarning}</p>
                  )}
                </div>

                {/* Portfolio */}
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground mb-2">{t.portfolioTitle}</h2>
                  <p className="text-muted-foreground mb-4">{t.portfolioDesc}</p>
                  <Button variant="default" className="gap-2">
                    <Camera className="w-4 h-4" /> {t.createAlbum}
                  </Button>
                </div>

                {/* Video */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">{t.videoTitle}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{t.videoDesc}</p>
                  <div className="flex gap-2">
                    <Input placeholder={t.videoPlaceholder} className="flex-1" />
                    <Button variant="outline">{t.videoAdd}</Button>
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground mb-2">{t.noRatingsTitle}</h2>
                  <p className="text-muted-foreground">{t.noRatingsDesc}</p>
                </div>

                {/* Reviews */}
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground mb-2">{t.noReviewsTitle}</h2>
                  <p className="text-muted-foreground">{t.noReviewsDesc}</p>
                </div>

                {profile?.role === 'client' && (
                  <div className="bg-secondary rounded-xl p-6">
                    <p className="text-foreground mb-4">{t.becomeProvider}</p>
                    <Button onClick={handleBecomeProvider} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {t.becomeProviderBtn}
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Tasks */}
              <TabsContent value="tasks" className="pt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-bold text-foreground">{t.myTasks}</h2>
                  <Button size="sm" asChild>
                    <a href="/create-task"><Plus className="w-4 h-4 mr-1" /> {t.createTask}</a>
                  </Button>
                </div>
                {tasks.length === 0 ? (
                  <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                    {t.noTasks}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="bg-card rounded-xl border border-border p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{task.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              {task.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{task.city}</span>}
                              {(task.budget_from || task.budget_to) && (
                                <span>{t.budget}: {task.budget_from}–{task.budget_to} €</span>
                              )}
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(task.created_at).toLocaleDateString(lang)}</span>
                            </div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusColor[task.status] || ''}`}>
                            {t.status[task.status as keyof typeof t.status]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Account */}
              <TabsContent value="account" className="pt-8">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">{t.balance} 0 {t.bonuses}</h2>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">{t.history}</h3>
                  <p className="text-muted-foreground">{t.noTransactions}</p>
                </div>
              </TabsContent>

              {/* Tariffs */}
              <TabsContent value="tariffs" className="pt-8">
                {!tariffType ? (
                  <>
                    <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                      {lang === 'de' ? 'Tarifauswahl' : 'Choose a plan'}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
                      <div className="bg-card rounded-xl border border-border p-6 text-center shadow-sm">
                        <h3 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                          {lang === 'de' ? 'Unbegrenzt' : 'Unlimited'}
                          <span className="text-xs bg-accent text-accent-foreground rounded-full px-2 py-0.5 font-bold">-50%</span>
                        </h3>
                        <p className="text-muted-foreground mt-3 mb-5">
                          {lang === 'de'
                            ? 'Unbegrenzte Anzahl an Bewerbungen für 15, 30 oder 90 Tage.'
                            : 'Unlimited responses for 15, 30 or 90 days.'}
                        </p>
                        <Button className="w-full" onClick={() => { setTariffType('unlimited'); setTariffStep(0); setSelectedCategories([]); }}>
                          {lang === 'de' ? 'Mit 50% Rabatt aktivieren' : 'Activate with 50% off'}
                        </Button>
                      </div>
                      <div className="bg-card rounded-xl border border-border p-6 text-center shadow-sm">
                        <h3 className="text-xl font-bold text-foreground">
                          {lang === 'de' ? 'Basis' : 'Basic'}
                        </h3>
                        <p className="text-muted-foreground mt-3 mb-5">
                          {lang === 'de'
                            ? 'Festgelegte Anzahl an Bewerbungen: 25, 50 oder 100 pro Monat.'
                            : 'Fixed number of responses: 25, 50 or 100 per month.'}
                        </p>
                        <Button variant="outline" className="w-full" onClick={() => { setTariffType('basic'); setTariffStep(0); setSelectedCategories([]); }}>
                          {lang === 'de' ? 'Aktivieren' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Category selection */}
                    {(() => {
                      const categories = [
                        {
                          id: 'moving', de: 'Umzug & Transport', en: 'Moving & Transport',
                          subs: [
                            { id: 'moving_all', de: 'Alle Unterkategorien', en: 'All subcategories', price: 29, oldPrice: 58, best: true },
                            { id: 'moving_local', de: 'Lokaler Umzug', en: 'Local moving', price: 15, oldPrice: 30 },
                            { id: 'moving_long', de: 'Fernumzug', en: 'Long-distance moving', price: 19, oldPrice: 38 },
                            { id: 'moving_furniture', de: 'Möbelmontage', en: 'Furniture assembly', price: 12, oldPrice: 24 },
                          ]
                        },
                        {
                          id: 'cleaning', de: 'Reinigung', en: 'Cleaning',
                          subs: [
                            { id: 'cleaning_all', de: 'Alle Unterkategorien', en: 'All subcategories', price: 25, oldPrice: 50, best: true },
                            { id: 'cleaning_home', de: 'Wohnungsreinigung', en: 'Home cleaning', price: 14, oldPrice: 28 },
                            { id: 'cleaning_office', de: 'Büroreinigung', en: 'Office cleaning', price: 16, oldPrice: 32 },
                            { id: 'cleaning_window', de: 'Fensterreinigung', en: 'Window cleaning', price: 10, oldPrice: 20 },
                          ]
                        },
                        {
                          id: 'repair', de: 'Reparatur & Handwerk', en: 'Repair & Crafts',
                          subs: [
                            { id: 'repair_all', de: 'Alle Unterkategorien', en: 'All subcategories', price: 35, oldPrice: 70, best: true },
                            { id: 'repair_plumbing', de: 'Sanitär & Klempner', en: 'Plumbing', price: 18, oldPrice: 36 },
                            { id: 'repair_electric', de: 'Elektroinstallation', en: 'Electrical', price: 20, oldPrice: 40 },
                            { id: 'repair_paint', de: 'Malerarbeiten', en: 'Painting', price: 15, oldPrice: 30 },
                            { id: 'repair_general', de: 'Allgemeine Reparatur', en: 'General repair', price: 14, oldPrice: 28 },
                          ]
                        },
                        {
                          id: 'it', de: 'IT & Webentwicklung', en: 'IT & Web Development',
                          subs: [
                            { id: 'it_all', de: 'Alle Unterkategorien', en: 'All subcategories', price: 49, oldPrice: 98, best: true },
                            { id: 'it_web', de: 'Webentwicklung', en: 'Web development', price: 25, oldPrice: 50 },
                            { id: 'it_mobile', de: 'App-Entwicklung', en: 'App development', price: 28, oldPrice: 56 },
                            { id: 'it_support', de: 'IT-Support', en: 'IT support', price: 15, oldPrice: 30 },
                          ]
                        },
                        {
                          id: 'design', de: 'Design', en: 'Design',
                          subs: [
                            { id: 'design_all', de: 'Alle Unterkategorien', en: 'All subcategories', price: 39, oldPrice: 78, best: true },
                            { id: 'design_graphic', de: 'Grafikdesign', en: 'Graphic design', price: 20, oldPrice: 40 },
                            { id: 'design_interior', de: 'Innenarchitektur', en: 'Interior design', price: 22, oldPrice: 44 },
                            { id: 'design_logo', de: 'Logo & Branding', en: 'Logo & Branding', price: 18, oldPrice: 36 },
                          ]
                        },
                        {
                          id: 'assistant', de: 'Virtueller Assistent', en: 'Virtual Assistant',
                          subs: [
                            { id: 'assistant_all', de: 'Alle Unterkategorien', en: 'All subcategories', price: 29, oldPrice: 58, best: true },
                            { id: 'assistant_text', de: 'Textarbeit & Copywriting', en: 'Copywriting', price: 15, oldPrice: 30 },
                            { id: 'assistant_research', de: 'Recherche', en: 'Research', price: 12, oldPrice: 24 },
                            { id: 'assistant_data', de: 'Datenverarbeitung', en: 'Data processing', price: 14, oldPrice: 28 },
                            { id: 'assistant_social', de: 'Social-Media-Betreuung', en: 'Social media management', price: 16, oldPrice: 32 },
                          ]
                        },
                        {
                          id: 'beauty', de: 'Schönheit & Gesundheit', en: 'Beauty & Health',
                          subs: [
                            { id: 'beauty_all', de: 'Alle Unterkategorien', en: 'All subcategories', price: 32, oldPrice: 64, best: true },
                            { id: 'beauty_hair', de: 'Friseur', en: 'Hair styling', price: 16, oldPrice: 32 },
                            { id: 'beauty_nails', de: 'Nageldesign', en: 'Nail design', price: 14, oldPrice: 28 },
                            { id: 'beauty_massage', de: 'Massage', en: 'Massage', price: 15, oldPrice: 30 },
                          ]
                        },
                        {
                          id: 'tutoring', de: 'Nachhilfe & Unterricht', en: 'Tutoring & Lessons',
                          subs: [
                            { id: 'tutoring_all', de: 'Alle Unterkategorien', en: 'All subcategories', price: 35, oldPrice: 70, best: true },
                            { id: 'tutoring_school', de: 'Schulfächer', en: 'School subjects', price: 18, oldPrice: 36 },
                            { id: 'tutoring_lang', de: 'Sprachunterricht', en: 'Language lessons', price: 20, oldPrice: 40 },
                            { id: 'tutoring_music', de: 'Musikunterricht', en: 'Music lessons', price: 16, oldPrice: 32 },
                          ]
                        },
                        {
                          id: 'events', de: 'Events & Veranstaltungen', en: 'Events',
                          subs: [
                            { id: 'events_all', de: 'Alle Unterkategorien', en: 'All subcategories', price: 39, oldPrice: 78, best: true },
                            { id: 'events_photo', de: 'Fotografie', en: 'Photography', price: 20, oldPrice: 40 },
                            { id: 'events_video', de: 'Videografie', en: 'Videography', price: 22, oldPrice: 44 },
                            { id: 'events_dj', de: 'DJ & Musik', en: 'DJ & Music', price: 18, oldPrice: 36 },
                          ]
                        },
                      ];

                      const allSubIds = categories.flatMap(c => c.subs.map(s => s.id));
                      const totalPrice = selectedCategories.reduce((sum, subId) => {
                        for (const cat of categories) {
                          const sub = cat.subs.find(s => s.id === subId);
                          if (sub) return sum + sub.price;
                        }
                        return sum;
                      }, 0);
                      const tierMultiplier = tariffType === 'basic'
                        ? (selectedTier === '25' ? 1 : selectedTier === '50' ? 1.78 : 3.12)
                        : (selectedUnlimitedDays === '15' ? 1 : selectedUnlimitedDays === '30' ? 1.7 : selectedUnlimitedDays === '90' ? 3.4 : 1);
                      const finalPrice = Math.round(totalPrice * tierMultiplier);

                      // expandedCats is declared at component top level

                      return (
                        <div className="relative">
                          <div className="flex items-center gap-4 mb-6">
                            <button onClick={() => { setTariffType(null); setTariffStep(0); }} className="text-primary hover:underline text-sm flex items-center gap-1">
                              ← {lang === 'de' ? 'Zurück' : 'Back'}
                            </button>
                            <h2 className="text-2xl font-display font-bold text-foreground">
                              {tariffType === 'unlimited'
                                ? (lang === 'de' ? 'Unbegrenzter Tarif' : 'Unlimited Plan')
                                : (lang === 'de' ? 'Basis-Tarif' : 'Basic Plan')}
                            </h2>
                          </div>

                          <p className="text-muted-foreground mb-6">
                            {tariffType === 'basic'
                              ? (lang === 'de'
                                ? 'Wirtschaftliche Variante mit festgelegter Anzahl an Bewerbungen auf 30 Tage. Wählen Sie Kategorien und Unterkategorien.'
                                : 'Economical option with a fixed number of responses for 30 days. Select categories and subcategories.')
                              : (lang === 'de'
                                ? 'Unbegrenzte Bewerbungen in den ausgewählten Kategorien. Wählen Sie Kategorien und Unterkategorien.'
                                : 'Unlimited responses in selected categories. Choose categories and subcategories.')}
                          </p>

                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground font-medium">
                              {lang === 'de' ? 'Kategorieliste' : 'Category list'}
                            </span>
                            <button
                              onClick={() => {
                                if (selectedCategories.length === allSubIds.length) {
                                  setSelectedCategories([]);
                                } else {
                                  setSelectedCategories([...allSubIds]);
                                }
                              }}
                              className="text-sm text-primary hover:underline font-medium"
                            >
                              {selectedCategories.length === allSubIds.length
                                ? (lang === 'de' ? 'Alle abwählen' : 'Deselect all')
                                : (lang === 'de' ? 'Alle auswählen' : 'Select all')}
                            </button>
                          </div>

                          <div className="border border-border rounded-xl overflow-hidden mb-24">
                            {categories.map((cat) => {
                              const isExpanded = expandedCats.includes(cat.id);
                              const catSubIds = cat.subs.map(s => s.id);
                              const selectedInCat = catSubIds.filter(id => selectedCategories.includes(id)).length;
                              const catTotal = cat.subs.reduce((s, sub) => s + (selectedCategories.includes(sub.id) ? sub.price : 0), 0);

                              return (
                                <div key={cat.id} className="border-b border-border last:border-0">
                                  <button
                                    onClick={() => setExpandedCats(prev => isExpanded ? prev.filter(id => id !== cat.id) : [...prev, cat.id])}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="font-semibold text-foreground">{cat[lang as 'de' | 'en']}</span>
                                      {selectedInCat > 0 && (
                                        <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
                                          {selectedInCat}
                                        </span>
                                      )}
                                    </div>
                                    <svg className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                  </button>

                                  {isExpanded && (
                                    <div className="bg-muted/20">
                                      {cat.subs.map((sub) => {
                                        const isSelected = selectedCategories.includes(sub.id);
                                        return (
                                          <label
                                            key={sub.id}
                                            className={`flex items-center justify-between px-5 py-3.5 cursor-pointer border-t border-border/50 transition-colors ${isSelected ? 'bg-accent/20' : 'hover:bg-muted/40'}`}
                                          >
                                            <div className="flex items-center gap-3 pl-4">
                                              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-accent border-accent' : 'border-muted-foreground/30'}`}>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-accent-foreground" />}
                                              </div>
                                              <div className="flex flex-col">
                                                <span className={`font-medium text-foreground ${sub.best ? 'text-sm' : 'text-sm'}`}>{sub[lang as 'de' | 'en']}</span>
                                                {sub.best && (
                                                  <span className="text-xs text-accent font-semibold">{lang === 'de' ? 'Günstiger Variante' : 'Best value'}</span>
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-foreground text-sm font-medium">{lang === 'de' ? 'ab' : 'from'} {sub.price} €</span>
                                              {sub.oldPrice && (
                                                <span className="text-muted-foreground text-xs line-through">{sub.oldPrice} €</span>
                                              )}
                                            </div>
                                            <input
                                              type="checkbox"
                                              className="hidden"
                                              checked={isSelected}
                                              onChange={() => {
                                                setSelectedCategories(prev =>
                                                  isSelected ? prev.filter(c => c !== sub.id) : [...prev, sub.id]
                                                );
                                              }}
                                            />
                                          </label>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Sticky bottom bar */}
                          {selectedCategories.length > 0 && (
                            <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-4 flex items-center justify-between z-40 shadow-lg">
                              <p className="text-sm text-foreground">
                                {lang === 'de'
                                  ? `${selectedCategories.length} ausgewählt, ab ${totalPrice} €`
                                  : `${selectedCategories.length} selected, from ${totalPrice} €`}
                              </p>
                              <Button onClick={() => { setTariffOpen(true); setTariffStep(1); }}>
                                {lang === 'de' ? 'Weiter' : 'Next'}
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </>
                )}
              </TabsContent>

              <TabsContent value="insurance" className="pt-8">
                <h2 className="text-xl font-display font-bold text-foreground mb-4">{t.insuranceTitle}</h2>
                <p className="text-muted-foreground">{t.insuranceDesc}</p>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings" className="pt-8">
                {/* Sub-tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {(['general', 'notifications', 'subscriptions', 'security'] as const).map((tab) => {
                    const labels = {
                      general: t.settingsGeneral,
                      notifications: t.settingsNotifications,
                      subscriptions: t.settingsSubscriptions,
                      security: t.settingsSecurity,
                    };
                    return (
                      <button
                        key={tab}
                        onClick={() => setSettingsSubTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          settingsSubTab === tab
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                      >
                        {labels[tab]}
                      </button>
                    );
                  })}
                </div>

                {/* General Settings */}
                {settingsSubTab === 'general' && (
                  <div className="space-y-10">
                    {/* Personal Data */}
                    <div>
                      <h2 className="text-2xl font-display font-bold text-foreground mb-6">{t.personalData}</h2>
                      <div className="space-y-4 max-w-lg">
                        <div>
                          <Label>{t.name}</Label>
                          <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
                        </div>
                        <div>
                          <Label>{t.lastName}</Label>
                          <Input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className="mt-1" />
                        </div>
                        <div>
                          <Label>{t.dateOfBirth}</Label>
                          <Input value={editDob} onChange={(e) => setEditDob(e.target.value)} placeholder="01.02.1975" className="mt-1" />
                        </div>
                        <div>
                          <Label>{t.gender}</Label>
                          <div className="flex items-center gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="gender" value="male" className="accent-primary w-4 h-4" />
                              <span className="text-sm text-foreground">{t.male}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="gender" value="female" className="accent-primary w-4 h-4" />
                              <span className="text-sm text-foreground">{t.female}</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <Label>{t.city}</Label>
                          <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} className="mt-1" />
                        </div>
                        <div>
                          <Label>{t.email}</Label>
                          <Input value={editEmail} disabled className="mt-1 bg-muted" />
                          <p className="text-xs text-muted-foreground mt-1">{t.emailHint}</p>
                        </div>
                        <Button onClick={handleSavePersonalData} disabled={savingSettings} className="mt-2">
                          {savingSettings ? '...' : t.savePersonalData}
                        </Button>
                      </div>
                    </div>

                    <div className="border-t border-border" />

                    {/* Phone */}
                    <div>
                      <h2 className="text-2xl font-display font-bold text-foreground mb-6">{t.phoneNumber}</h2>
                      <div className="space-y-4 max-w-lg">
                        <div>
                          <Label>{t.contactNumber}</Label>
                          <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+49 172 1234567" className="mt-1" />
                          <p className="text-xs text-muted-foreground mt-1">{t.phoneHint}</p>
                        </div>
                        <Button onClick={handleSavePhone} disabled={savingPhone}>
                          {savingPhone ? '...' : t.savePhone}
                        </Button>
                      </div>
                    </div>

                    <div className="border-t border-border" />

                    {/* Business Status */}
                    <div>
                      <h2 className="text-2xl font-display font-bold text-foreground mb-2">{t.businessStatus}</h2>
                      <p className="text-muted-foreground mb-4">{t.businessDesc}</p>
                      <Button>{t.activateBusiness}</Button>
                    </div>

                    <div className="border-t border-border" />

                    {/* Delete Profile */}
                    <div>
                      <Button variant="outline" className="text-muted-foreground">{t.deleteProfile}</Button>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {settingsSubTab === 'notifications' && (
                  <div>
                    <p className="text-muted-foreground">{t.notifSettings}</p>
                    <div className="mt-6 space-y-4">
                      {['Email', 'Push', 'SMS'].map((channel) => (
                        <div key={channel} className="flex items-center justify-between py-3 border-b border-border">
                          <span className="text-foreground">{channel}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-background after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subscriptions */}
                {settingsSubTab === 'subscriptions' && (
                  <div>
                    <p className="text-muted-foreground">{t.subSettings}</p>
                  </div>
                )}

                {/* Security */}
                {settingsSubTab === 'security' && (
                  <div className="space-y-8">
                    <p className="text-muted-foreground">{t.securitySettings}</p>
                    <div className="flex items-center justify-between py-4 border-b border-border">
                      <div>
                        <p className="font-medium text-foreground">{t.changePassword}</p>
                      </div>
                      <Button variant="outline" size="sm">{t.changePassword}</Button>
                    </div>
                    <div className="flex items-center justify-between py-4 border-b border-border">
                      <div>
                        <p className="font-medium text-foreground">{t.twoFactor}</p>
                        <p className="text-sm text-muted-foreground">{t.twoFactorDesc}</p>
                      </div>
                      <Button variant="outline" size="sm">{t.activate}</Button>
                    </div>
                    <div className="mt-6">
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={signOut}>{t.logout}</Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            {/* Provider profile card */}
            <div className="bg-card rounded-xl border border-border p-6">
              {profile?.role === 'provider' ? (
                <>
                  <h3 className="text-lg font-display font-bold text-foreground mb-1">
                    {lang === 'de' ? 'Dienstleister' : 'Provider'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    {lang === 'de' ? 'auf GetDoIt seit' : 'on GetDoIt since'} {new Date(profile.created_at).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>

                  <p className="text-sm text-muted-foreground mb-4">
                    {lang === 'de'
                      ? 'Um das Abzeichen «Dokumente bestätigt» zu erhalten, senden Sie Ihren Ausweis und ein Selfie mit Dokument zur Prüfung. '
                      : 'To get the "Documents verified" badge, submit your ID and a selfie with your document for review. '}
                    <Link to="/help/document-verification" className="text-primary hover:underline">
                      {lang === 'de' ? 'Mehr erfahren' : 'Learn more'}
                    </Link>
                  </p>

                  {/* Documents */}
                  <div className="flex items-center gap-3 py-3 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{lang === 'de' ? 'Dokumente' : 'Documents'}</p>
                      <button onClick={() => setDocVerifyOpen(true)} className="text-sm text-primary hover:underline">{lang === 'de' ? 'Prüfung starten' : 'Start verification'}</button>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 py-3 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{lang === 'de' ? 'Telefon' : 'Phone'}</p>
                      <p className="text-sm text-muted-foreground">{profile.phone || (lang === 'de' ? 'Nicht angegeben' : 'Not provided')}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 py-3 border-t border-border">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={handleBecomeProvider}>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm text-foreground">{t.becomeProvider}</p>
                </div>
              )}
            </div>

            {/* Social links */}
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-4">{t.trustDesc}</p>

              {socialProviders.map((provider) => (
                <div key={provider.name} className="flex items-center justify-between py-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${provider.color}`}>
                      {provider.icon || provider.name[0]}
                    </div>
                    <span className="text-sm text-foreground">{provider.name}</span>
                  </div>
                  <button className="text-sm text-primary hover:underline">{t.link}</button>
                </div>
              ))}
            </div>

            {/* Blog */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-display font-bold text-foreground mb-1">{t.blogTitle}</h3>
              <div className="space-y-4 mt-4">
                {blogPosts.map((post) => (
                  <Link key={post.slug} to={`/blog/${post.slug}`} className="flex gap-3 group">
                    <img src={post.image} alt={post[lang]} className="w-16 h-12 rounded object-cover shrink-0" />
                    <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">{post[lang]}</p>
                  </Link>
                ))}
              </div>
              <Link to="/blog" className="flex items-center gap-1 text-sm text-primary hover:underline mt-4">
                {t.allArticles} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Document verification dialog */}
      <Dialog open={docVerifyOpen} onOpenChange={(open) => { setDocVerifyOpen(open); if (!open) { setDocStep(0); setDocCountry(''); setDocFiles([]); } }}>
        <DialogContent className="sm:max-w-lg p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold text-foreground text-center">
              {docStep === 0 && (lang === 'de' ? 'Dokumentenprüfung' : 'Document Verification')}
              {docStep === 1 && (lang === 'de' ? 'Dokumente hochladen' : 'Upload Documents')}
              {docStep === 2 && (lang === 'de' ? 'Zahlung' : 'Payment')}
              {docStep === 3 && (lang === 'de' ? 'Abgeschlossen' : 'Complete')}
            </DialogTitle>
          </DialogHeader>

          {/* Step 0: Intro + Country */}
          {docStep === 0 && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-center">
                {lang === 'de'
                  ? 'Dienstleister mit dem Abzeichen «Dokumente bestätigt» erhalten durchschnittlich 20% mehr Aufträge.'
                  : 'Providers with "Documents Verified" badge receive 20% more tasks on average.'}
              </p>
              <div>
                <Label>{lang === 'de' ? 'Staatsangehörigkeit' : 'Country of citizenship'}</Label>
                <Select value={docCountry} onValueChange={setDocCountry}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={lang === 'de' ? 'Land wählen...' : 'Select country...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {['Deutschland', 'Österreich', 'Schweiz', 'Russland', 'Ukraine', 'Kasachstan', 'Türkei', 'Polen', 'Rumänien', 'Bulgarien', 'Serbien', 'Kroatien', 'Bosnien', 'Moldawien', 'Georgien', 'Armenien'].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" className="w-full" disabled={!docCountry} onClick={() => setDocStep(1)}>
                {lang === 'de' ? 'Weiter' : 'Continue'}
              </Button>
            </div>
          )}

          {/* Step 1: Upload Documents */}
          {docStep === 1 && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                {lang === 'de'
                  ? 'Laden Sie Ihren Reisepass oder Personalausweis hoch. Sie können auch ein Selfie mit dem Dokument hinzufügen.'
                  : 'Upload your passport or ID card. You can also add a selfie with the document.'}
              </p>
              <input ref={docFileRef} type="file" accept="image/*,.pdf" multiple className="hidden" onChange={(e) => {
                if (e.target.files) setDocFiles(prev => [...prev, ...Array.from(e.target.files!)]);
              }} />
              <div
                onClick={() => docFileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  {lang === 'de' ? 'Klicken oder Dateien hierher ziehen' : 'Click or drag files here'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG</p>
              </div>
              {docFiles.length > 0 && (
                <div className="space-y-2">
                  {docFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-secondary rounded-lg px-3 py-2">
                      <span className="text-sm text-foreground truncate">{f.name}</span>
                      <button onClick={() => setDocFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDocStep(0)} className="flex-1">
                  {lang === 'de' ? 'Zurück' : 'Back'}
                </Button>
                <Button onClick={() => setDocStep(2)} disabled={docFiles.length === 0} className="flex-1">
                  {lang === 'de' ? 'Weiter' : 'Continue'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {docStep === 2 && (
            <div className="space-y-4 text-center">
              <CreditCard className="w-12 h-12 mx-auto text-primary" />
              <p className="text-foreground font-medium">
                {lang === 'de'
                  ? 'Die Prüfung wird von unserem Partner durchgeführt und kostet 9,99 €.'
                  : 'Verification is conducted by our partner and costs €9.99.'}
              </p>
              <div className="bg-secondary rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{lang === 'de' ? 'Dokumentenprüfung' : 'Document verification'}</span>
                  <span className="text-foreground font-medium">9,99 €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{lang === 'de' ? 'Dokumente' : 'Documents'}</span>
                  <span className="text-foreground">{docFiles.length} {lang === 'de' ? 'Datei(en)' : 'file(s)'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{lang === 'de' ? 'Land' : 'Country'}</span>
                  <span className="text-foreground">{docCountry}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDocStep(1)} className="flex-1">
                  {lang === 'de' ? 'Zurück' : 'Back'}
                </Button>
                <Button onClick={() => {
                  setDocStep(3);
                  toast({ title: lang === 'de' ? 'Zahlung erfolgreich' : 'Payment successful' });
                }} className="flex-1">
                  {lang === 'de' ? 'Jetzt bezahlen — 9,99 €' : 'Pay now — €9.99'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {lang === 'de'
                  ? 'Mit dem Klick stimmen Sie den Prüfungsregeln zu.'
                  : 'By clicking you agree to the verification rules.'}
              </p>
            </div>
          )}

          {/* Step 3: Done */}
          {docStep === 3 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <p className="text-foreground font-medium">
                {lang === 'de'
                  ? 'Ihre Dokumente wurden eingereicht. Die Prüfung dauert in der Regel 1–3 Werktage.'
                  : 'Your documents have been submitted. Verification usually takes 1–3 business days.'}
              </p>
              <Button onClick={() => { setDocVerifyOpen(false); setDocStep(0); setDocCountry(''); setDocFiles([]); }}>
                {lang === 'de' ? 'Schließen' : 'Close'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tariff pricing dialog */}
      <Dialog open={tariffOpen} onOpenChange={(open) => { setTariffOpen(open); if (!open) setTariffStep(1); }}>
        <DialogContent className="sm:max-w-lg p-8">
          {tariffStep === 1 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold text-foreground text-center">
                  {lang === 'de' ? 'Tarifbedingungen wählen' : 'Choose plan terms'}
                </DialogTitle>
              </DialogHeader>
              {tariffType === 'basic' ? (
                <div className="mt-4">
                  <div className="grid grid-cols-3 gap-0 border border-border rounded-xl overflow-hidden">
                    {(['25', '50', '100'] as const).map((tier) => {
                      const prices = { '25': 49, '50': 89, '100': 149 };
                      const perResponse = { '25': '1,96', '50': '1,78', '100': '1,49' };
                      const isSelected = selectedTier === tier;
                      const isBest = tier === '50';
                      return (
                        <button
                          key={tier}
                          onClick={() => setSelectedTier(tier)}
                          className={`py-5 px-3 text-center transition-all relative ${isSelected ? 'bg-accent/15 border-2 border-accent rounded-xl z-10 shadow-md -mx-px' : 'bg-card'}`}
                        >
                          <p className="text-sm font-medium text-foreground mb-3">{tier} {lang === 'de' ? 'Bewerbungen' : 'responses'}</p>
                          {isBest && (
                            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
                              {lang === 'de' ? 'BESTSELLER' : 'BEST SELLER'}
                            </p>
                          )}
                          <p className="text-2xl font-bold text-foreground">{prices[tier]} €</p>
                          <p className="text-xs text-muted-foreground mt-1">{perResponse[tier]} €/{lang === 'de' ? 'Bewerbung' : 'response'}</p>
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={() => {
                      const prices = { '25': 49, '50': 89, '100': 149 };
                      const price = prices[selectedTier];
                      if ((profile?.balance ?? 0) < price) {
                        setTariffStep(2);
                      } else {
                        setTariffOpen(false);
                        toast({ title: lang === 'de' ? 'Tarif aktiviert!' : 'Plan activated!' });
                      }
                    }}
                  >
                    {lang === 'de' ? `Bezahlen ${({ '25': 49, '50': 89, '100': 149 } as Record<string, number>)[selectedTier]} €` : `Pay ${({ '25': 49, '50': 89, '100': 149 } as Record<string, number>)[selectedTier]} €`}
                  </Button>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="grid grid-cols-3 gap-0 border border-border rounded-xl overflow-hidden">
                    {(['15', '30', '90'] as const).map((days) => {
                      const prices = { '15': 29, '30': 49, '90': 99 };
                      const isSelected = selectedUnlimitedDays === days;
                      const isBest = days === '30';
                      return (
                        <button
                          key={days}
                          onClick={() => setSelectedUnlimitedDays(days)}
                          className={`py-5 px-3 text-center transition-all relative ${isSelected ? 'bg-accent/15 border-2 border-accent rounded-xl z-10 shadow-md -mx-px' : 'bg-card'}`}
                        >
                          <p className="text-sm font-medium text-foreground mb-3">{days} {lang === 'de' ? 'Tage' : 'days'}</p>
                          {isBest && (
                            <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
                              {lang === 'de' ? 'BESTSELLER' : 'BEST SELLER'}
                            </p>
                          )}
                          <p className="text-2xl font-bold text-foreground">
                            <span className="line-through text-muted-foreground text-base mr-1">{prices[days] * 2} €</span>
                            {prices[days]} €
                          </p>
                          <p className="text-xs text-accent font-bold mt-1">-50%</p>
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={() => {
                      const prices = { '15': 29, '30': 49, '90': 99 };
                      const price = prices[selectedUnlimitedDays];
                      if ((profile?.balance ?? 0) < price) {
                        setTariffStep(2);
                      } else {
                        setTariffOpen(false);
                        toast({ title: lang === 'de' ? 'Tarif aktiviert!' : 'Plan activated!' });
                      }
                    }}
                  >
                    {lang === 'de' ? `Bezahlen ${({ '15': 29, '30': 49, '90': 99 } as Record<string, number>)[selectedUnlimitedDays]} €` : `Pay ${({ '15': 29, '30': 49, '90': 99 } as Record<string, number>)[selectedUnlimitedDays]} €`}
                  </Button>
                </div>
              )}
            </>
          )}

          {tariffStep === 2 && (() => {
            const price = tariffType === 'basic'
              ? ({ '25': 49, '50': 89, '100': 149 } as Record<string, number>)[selectedTier]
              : ({ '15': 29, '30': 49, '90': 99 } as Record<string, number>)[selectedUnlimitedDays];
            const needed = price - (profile?.balance ?? 0);
            return (
              <div className="text-center space-y-5 py-4">
                <h2 className="text-xl font-display font-bold text-foreground">
                  {lang === 'de'
                    ? `Für das gewählte Paket fehlen Ihnen ${needed} €`
                    : `You are short ${needed} € for the selected package`}
                </h2>
                <div className="flex items-center justify-center gap-3 text-muted-foreground">
                  <Wallet className="w-5 h-5" />
                  <span>
                    {lang === 'de'
                      ? `Aktuell auf Ihrem Konto: ${profile?.balance ?? 0} € und 0 Bonuspunkte`
                      : `Currently on your account: ${profile?.balance ?? 0} € and 0 bonus points`}
                  </span>
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setTariffOpen(false);
                    setTariffStep(1);
                    // Open wallet top-up from header — navigate to account tab
                    navigate('/dashboard?tab=account', { replace: true });
                    toast({ title: lang === 'de' ? 'Bitte laden Sie Ihr Guthaben auf' : 'Please top up your balance' });
                  }}
                >
                  {lang === 'de' ? `Konto aufladen um ${needed} €` : `Top up account by ${needed} €`}
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

