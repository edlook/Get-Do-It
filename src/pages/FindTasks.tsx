import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLang } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, MessageSquare, Euro, Search, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categoryKeys = [
  'courier', 'renovation', 'moving', 'cleaning', 'computer', 'photo',
  'software', 'appliance', 'events', 'design', 'assistant', 'repair',
  'beauty', 'legal', 'auto', 'tutoring',
] as const;

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_from: number | null;
  budget_to: number | null;
  city: string;
  deadline: string | null;
  responses_count: number;
  created_at: string;
};

function timeAgo(dateStr: string, lang: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return lang === 'de' ? `vor ${mins} Min.` : `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return lang === 'de' ? `vor ${hrs} Std.` : `${hrs} hrs ago`;
  const days = Math.floor(hrs / 24);
  return lang === 'de' ? `vor ${days} Tagen` : `${days} days ago`;
}

export default function FindTasks() {
  const { lang, tr } = useLang();
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeSearch, setActiveSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    fetchTasks();
  }, [categoryFilter, activeSearch]);

  const fetchTasks = async () => {
    setLoading(true);
    let query = supabase.from('tasks').select('*').eq('status', 'open').order('created_at', { ascending: false });
    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }
    if (activeSearch.trim()) {
      query = query.or(`title.ilike.%${activeSearch}%,description.ilike.%${activeSearch}%`);
    }
    const { data } = await query;
    setTasks((data as Task[]) || []);
    setLoading(false);
  };

  const handleSearch = () => {
    setActiveSearch(searchQuery);
  };

  const foundText = lang === 'de' ? `${tasks.length} Aufträge gefunden` : `${tasks.length} tasks found`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Page title */}
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            {tr.findTasks.title}
          </h1>

          {/* Search bar */}
          <div className="mt-6 flex items-center bg-card rounded-lg border border-border shadow-sm overflow-hidden max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={lang === 'de' ? 'Suche nach Stichworten' : 'Search by keywords'}
              className="flex-1 px-5 py-4 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
            />
            <Button
              onClick={handleSearch}
              className="m-1.5 px-8 py-3 h-auto rounded-md bg-accent text-accent-foreground font-bold text-base hover:opacity-90 transition-opacity"
            >
              <Search className="h-4 w-4 mr-2" />
              {lang === 'de' ? 'Finden' : 'Find'}
            </Button>
          </div>

          {/* Results count */}
          <p className="mt-4 text-sm text-muted-foreground">{foundText}</p>

          {/* Two-column layout */}
          <div className="mt-8 flex flex-col lg:flex-row gap-8">
            {/* Tasks list */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground rounded-xl border border-border bg-card">
                  <p className="text-lg">{tr.findTasks.noTasks}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.id} className="rounded-xl bg-card border border-border p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-primary hover:underline cursor-pointer">{task.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                            {task.city && (
                              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{task.city}</span>
                            )}
                            {(task.budget_from || task.budget_to) && (
                              <span className="flex items-center gap-1">
                                <Euro className="h-3.5 w-3.5" />
                                {task.budget_from && task.budget_to
                                  ? `${task.budget_from}–${task.budget_to} €`
                                  : task.budget_to
                                    ? `${lang === 'de' ? 'bis' : 'up to'} ${task.budget_to} €`
                                    : `${lang === 'de' ? 'ab' : 'from'} ${task.budget_from} €`}
                              </span>
                            )}
                            {task.deadline && (
                              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(task.deadline).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')}</span>
                            )}
                            <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{task.responses_count} {tr.findTasks.responses}</span>
                          </div>
                          {task.category && (
                            <span className="inline-block mt-3 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                              {(tr.categories as any)[task.category] || task.category}
                            </span>
                          )}
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(task.created_at, lang)}</span>
                          <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground whitespace-nowrap">
                            {tr.findTasks.respond}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="rounded-xl border border-border bg-card p-4 sticky top-20">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    categoryFilter === 'all' ? 'text-primary bg-primary/5' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Check className={`h-4 w-4 ${categoryFilter === 'all' ? 'text-primary' : 'text-muted-foreground'}`} />
                  {tr.findTasks.allCategories}
                </button>
                {categoryKeys.map(key => (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      categoryFilter === key ? 'text-primary font-medium bg-primary/5' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Check className={`h-4 w-4 ${categoryFilter === key ? 'text-primary' : 'text-muted-foreground'}`} />
                    {(tr.categories as any)[key]}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
