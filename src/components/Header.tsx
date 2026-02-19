import { useLang } from '@/contexts/LanguageContext';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
import { useState } from 'react';

export default function Header() {
  const { lang, setLang, tr } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-10">
          <a href="/" className="flex items-center gap-2">
            <img src={logo} alt="GetDoIt" className="h-12 md:h-14" />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              {tr.nav.createTask}
            </a>
            <a href="#" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
              {tr.nav.findTasks}
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
            className="text-xs font-bold px-3 py-1.5 rounded-md border border-border text-foreground hover:bg-muted transition-colors"
          >
            {lang === 'de' ? '🇬🇧 EN' : '🇩🇪 DE'}
          </button>
          <Button variant="outline" size="sm" className="hidden md:inline-flex border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            {tr.nav.login}
          </Button>
          <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <a href="#" className="block text-sm font-medium text-foreground">{tr.nav.createTask}</a>
          <a href="#" className="block text-sm font-medium text-foreground">{tr.nav.findTasks}</a>
          <Button variant="outline" size="sm" className="w-full border-accent text-accent">
            {tr.nav.login}
          </Button>
        </div>
      )}
    </header>
  );
}
