import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categoryKeys = [
  'courier', 'renovation', 'moving', 'cleaning', 'computer', 'photo',
  'software', 'appliance', 'events', 'design', 'assistant', 'repair',
  'beauty', 'legal', 'auto', 'tutoring',
] as const;

export default function CreateTask() {
  const { tr } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budgetFrom, setBudgetFrom] = useState('');
  const [budgetTo, setBudgetTo] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: tr.createTask.loginRequired, variant: 'destructive' });
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('tasks').insert({
        user_id: user.id,
        title,
        description,
        category,
        budget_from: budgetFrom ? parseInt(budgetFrom) : null,
        budget_to: budgetTo ? parseInt(budgetTo) : null,
        city,
        address: address || null,
        deadline: deadline || null,
      });
      if (error) throw error;
      toast({ title: tr.createTask.success });
      navigate('/tasks');
    } catch (err: any) {
      toast({ title: tr.createTask.error, description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">{tr.createTask.title}</h1>

          <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-xl p-6 border border-border shadow-sm">
            <div>
              <Label htmlFor="title">{tr.createTask.taskTitle}</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder={tr.createTask.taskTitlePlaceholder} required />
            </div>
            <div>
              <Label htmlFor="description">{tr.createTask.description}</Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder={tr.createTask.descriptionPlaceholder} rows={4} required />
            </div>
            <div>
              <Label>{tr.createTask.category}</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger><SelectValue placeholder={tr.createTask.selectCategory} /></SelectTrigger>
                <SelectContent>
                  {categoryKeys.map(key => (
                    <SelectItem key={key} value={key}>{(tr.categories as any)[key]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budgetFrom">{tr.createTask.budgetFrom}</Label>
                <Input id="budgetFrom" type="number" min="0" value={budgetFrom} onChange={e => setBudgetFrom(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="budgetTo">{tr.createTask.budgetTo}</Label>
                <Input id="budgetTo" type="number" min="0" value={budgetTo} onChange={e => setBudgetTo(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">{tr.createTask.city}</Label>
                <Input id="city" value={city} onChange={e => setCity(e.target.value)} placeholder={tr.createTask.cityPlaceholder} required />
              </div>
              <div>
                <Label htmlFor="address">{tr.createTask.address}</Label>
                <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder={tr.createTask.addressPlaceholder} />
              </div>
            </div>
            <div>
              <Label htmlFor="deadline">{tr.createTask.deadline}</Label>
              <Input id="deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '...' : tr.createTask.submit}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
