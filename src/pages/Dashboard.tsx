import { useEffect, useState } from 'react';
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
import { User, MapPin, Edit2, Plus, Clock, CheckCircle } from 'lucide-react';
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

  const tr = {
    de: {
      title: 'Mein Konto',
      role: { client: 'Auftraggeber', provider: 'Dienstleister' },
      name: 'Name',
      city: 'Stadt',
      edit: 'Bearbeiten',
      save: 'Speichern',
      cancel: 'Abbrechen',
      myTasks: 'Meine Aufträge',
      noTasks: 'Sie haben noch keine Aufträge erstellt.',
      createTask: 'Auftrag erstellen',
      logout: 'Abmelden',
      saved: 'Profil gespeichert',
      budget: 'Budget',
      status: { open: 'Offen', in_progress: 'In Bearbeitung', completed: 'Erledigt', cancelled: 'Storniert' },
    },
    en: {
      title: 'My Account',
      role: { client: 'Client', provider: 'Service Provider' },
      name: 'Name',
      city: 'City',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      myTasks: 'My Tasks',
      noTasks: "You haven't created any tasks yet.",
      createTask: 'Create Task',
      logout: 'Log out',
      saved: 'Profile saved',
      budget: 'Budget',
      status: { open: 'Open', in_progress: 'In Progress', completed: 'Completed', cancelled: 'Cancelled' },
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

  if (authLoading || !user) return null;

  const statusColor: Record<string, string> = {
    open: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">{t.title}</h1>

        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <User className="w-8 h-8 text-accent" />
              </div>
              <div>
                {editing ? (
                  <div className="space-y-2">
                    <div>
                      <Label>{t.name}</Label>
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label>{t.city}</Label>
                      <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} className="mt-1" />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-foreground">{profile?.name || user.email}</h2>
                    {profile?.city && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {profile.city}
                      </p>
                    )}
                    <span className="inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                      {t.role[profile?.role || 'client']}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button size="sm" onClick={handleSave} disabled={saving}>{t.save}</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>{t.cancel}</Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-1" /> {t.edit}
                </Button>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={signOut}>{t.logout}</Button>
          </div>
        </div>

        {/* Tasks */}
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
      </main>
      <Footer />
    </div>
  );
}
