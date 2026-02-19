import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLang } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar, MessageSquare, Euro } from 'lucide-react';
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

function timeAgo(dateStr: string, tr: any) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${tr.findTasks.postedAgo} ${mins} ${tr.findTasks.minutes}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${tr.findTasks.postedAgo} ${hrs} ${tr.findTasks.hours}`;
  const days = Math.floor(hrs / 24);
  return `${tr.findTasks.postedAgo} ${days} ${tr.findTasks.days}`;
}

export default function FindTasks() {
  const { tr } = useLang();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, [categoryFilter]);

  const fetchTasks = async () => {
    setLoading(true);
    let query = supabase.from('tasks').select('*').eq('status', 'open').order('created_at', { ascending: false });
    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }
    const { data } = await query;
    setTasks((data as Task[]) || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">{tr.findTasks.title}</h1>
          <p className="text-muted-foreground mb-8">{tr.findTasks.subtitle}</p>

          <div className="flex gap-3 mb-8">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tr.findTasks.allCategories}</SelectItem>
                {categoryKeys.map(key => (
                  <SelectItem key={key} value={key}>{(tr.categories as any)[key]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">{tr.findTasks.noTasks}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="rounded-xl bg-card border border-border p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{task.title}</h3>
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
                                ? `${tr.findTasks.budget}: ${task.budget_to} €`
                                : `ab ${task.budget_from} €`}
                          </span>
                        )}
                        {task.deadline && (
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(task.deadline).toLocaleDateString('de-DE')}</span>
                        )}
                        <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{task.responses_count} {tr.findTasks.responses}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground">{timeAgo(task.created_at, tr)}</span>
                      <Button size="sm" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                        {tr.findTasks.respond}
                      </Button>
                    </div>
                  </div>
                  {task.category && (
                    <span className="inline-block mt-3 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {(tr.categories as any)[task.category] || task.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
