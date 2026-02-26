import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { MapPin, Camera, Mail, Star, MessageSquare, Edit2, Plus, Clock, CheckCircle, Shield } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type Task = Tables<'tasks'>;

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { lang } = useLang();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tr = {
    de: {
      greeting: 'Hallo',
      noRatings: 'Keine Bewertungen',
      aboutMe: 'Über mich',
      account: 'Konto',
      aboutMeTitle: 'Ein wenig über mich',
      add: 'Hinzufügen',
      noRatingsTitle: 'Sie haben derzeit keine Bewertungen',
      noRatingsDesc: 'Auftraggeber bewerten alle Dienstleister nach verschiedenen Kriterien wie Preis, Qualität, Höflichkeit',
      noReviewsTitle: 'Noch keine Bewertungen',
      noReviewsDesc: 'Bewertungen erscheinen, nachdem Sie einen Auftrag erstellt oder ausgeführt haben',
      becomeProvider: 'Werden Sie Dienstleister und verdienen Sie Geld.',
      becomeProviderBtn: 'Ich möchte Dienstleister werden',
      verifiedContacts: 'Bestätigte Kontakte',
      trustDesc: 'Erhöhen Sie das Vertrauen der Nutzer — verknüpfen Sie Ihre Konten.',
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
    },
    en: {
      greeting: 'Hello',
      noRatings: 'No ratings',
      aboutMe: 'About me',
      account: 'Account',
      aboutMeTitle: 'A little about me',
      add: 'Add',
      noRatingsTitle: 'You have no ratings at the moment',
      noRatingsDesc: 'Clients rate all service providers on various criteria such as price, quality, politeness',
      noReviewsTitle: 'No reviews yet',
      noReviewsDesc: 'Reviews will appear after you create or complete a task',
      becomeProvider: 'Become a service provider and start earning.',
      becomeProviderBtn: 'I want to become a provider',
      verifiedContacts: 'Verified contacts',
      trustDesc: 'Increase user trust — link your accounts.',
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
    },
  };
  const t = tr[lang];

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, tasksRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('tasks').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      if (profileRes.data) {
        setProfile(profileRes.data);
        setEditName(profileRes.data.name);
        setEditCity(profileRes.data.city || '');
      }
      if (tasksRes.data) setTasks(tasksRes.data);
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      const avatarUrl = urlData.publicUrl + '?t=' + Date.now();
      await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id);
      setProfile((p) => p ? { ...p, avatar_url: avatarUrl } : p);
    }
    setUploading(false);
  };

  if (authLoading || !user) return null;

  const statusColor: Record<string, string> = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
  };

  const displayName = profile?.name || user.email?.split('@')[0] || '';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        {/* Profile views counter */}
        <div className="flex justify-end mb-2">
          <span className="text-sm text-muted-foreground">👁 5 {t.profileViews}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Main content */}
          <div className="flex-1 min-w-0">
            {/* Greeting */}
            <h1 className="text-3xl font-display font-bold text-foreground mb-6">
              {t.greeting}, {displayName}!
            </h1>

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
                  {t.changePhoto}
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
                    <p className="text-base text-muted-foreground">
                      {profile?.city && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-green-500" /> {profile.city}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{t.noRatings}</p>
                    <button onClick={() => setEditing(true)} className="text-sm text-primary hover:underline mt-2 self-start flex items-center gap-1">
                      <Edit2 className="w-3.5 h-3.5" /> {t.edit}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-0">
                <TabsTrigger
                  value="about"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base"
                >
                  {t.aboutMe}
                </TabsTrigger>
                <TabsTrigger
                  value="tasks"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base"
                >
                  {t.myTasks}
                </TabsTrigger>
                <TabsTrigger
                  value="account"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-base"
                >
                  {t.account}
                </TabsTrigger>
              </TabsList>

              {/* About Me Tab */}
              <TabsContent value="about" className="pt-8 space-y-10">
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                    {t.aboutMeTitle}
                    <button className="text-sm font-normal text-primary hover:underline flex items-center gap-1">
                      <Edit2 className="w-3.5 h-3.5" /> {t.add}
                    </button>
                  </h2>
                </div>

                <div>
                  <h2 className="text-xl font-display font-bold text-foreground mb-2">{t.noRatingsTitle}</h2>
                  <p className="text-muted-foreground">{t.noRatingsDesc}</p>
                </div>

                <div>
                  <h2 className="text-xl font-display font-bold text-foreground mb-2">{t.noReviewsTitle}</h2>
                  <p className="text-muted-foreground">{t.noReviewsDesc}</p>
                </div>

                {profile?.role === 'client' && (
                  <div className="bg-secondary rounded-xl p-6">
                    <p className="text-foreground mb-4">{t.becomeProvider}</p>
                    <Button className="bg-[hsl(207,90%,60%)] hover:bg-[hsl(207,90%,50%)] text-white">
                      {t.becomeProviderBtn}
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Tasks Tab */}
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

              {/* Account Tab */}
              <TabsContent value="account" className="pt-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">{user.email}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={signOut}>{t.logout}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            {/* Become provider CTA */}
            {profile?.role === 'client' && (
              <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-foreground">{t.becomeProvider}</p>
              </div>
            )}

            {/* Verified contacts */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-display font-bold text-foreground mb-4">{t.verifiedContacts}</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[hsl(207,90%,60%)] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{t.trustDesc}</p>

              {['Google', 'Apple ID'].map((provider) => (
                <div key={provider} className="flex items-center justify-between py-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
                      {provider[0]}
                    </div>
                    <span className="text-sm text-foreground">{provider}</span>
                  </div>
                  <button className="text-sm text-primary hover:underline">{t.link}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
