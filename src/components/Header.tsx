import { useLang } from '@/contexts/LanguageContext';
import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';

export default function Header() {
  const { lang, setLang, tr } = useLang();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <img src={logo} alt="GetDoIt" className="h-10" />
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {tr.nav.createTask}
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {tr.nav.findTasks}
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
            className="text-xs font-bold px-2.5 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
          >
            {lang === 'de' ? 'EN' : 'DE'}
          </button>
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            {tr.nav.login}
          </Button>
          <Button className="md:hidden" variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
