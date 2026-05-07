import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Bell, MessageSquare, Wallet, User, Settings, CreditCard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import logo from '@/assets/logo.png';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Header() {
  const { lang, setLang, tr } = useLang();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletAmount, setWalletAmount] = useState('10');
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [notifsRes, msgsRes, profileRes] = await Promise.all([
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
        supabase.from('messages').select('id', { count: 'exact', head: true }).eq('receiver_id', user.id).eq('read', false),
        supabase.from('profiles').select('avatar_url, name, balance').eq('id', user.id).single(),
      ]);
      if (notifsRes.data) {
        setNotifications(notifsRes.data);
        setUnreadNotifs(notifsRes.data.filter((n: any) => !n.read).length);
      }
      setUnreadMessages(msgsRes.count ?? 0);
      if (profileRes.data) setProfile(profileRes.data);
    };
    fetchData();
  }, [user]);

  const t = {
    de: {
      profile: 'Profil',
      tariffs: 'Tarife',
      taskSub: 'Auftragsbenachrichtigungen',
      settings: 'Einstellungen',
      logout: 'Abmelden',
      topUp: 'Aufladen',
      walletTitle: 'Wie viel möchten Sie aufladen?',
      walletMin: 'Mindestbetrag — 5 €',
      walletDiscount: 'Rabatt auf das erste Paket',
      walletDiscountDesc: 'Erwerben Sie das erste unbegrenzte Antwortpaket mit 50% Rabatt.',
      walletChoose: 'Paket wählen',
      walletPay: 'Zur Zahlung',
      notifications: 'Benachrichtigungen',
      noNotifs: 'Keine Benachrichtigungen',
      messages: 'Nachrichten',
    },
    en: {
      profile: 'Profile',
      tariffs: 'Tariffs',
      taskSub: 'Task notifications',
      settings: 'Settings',
      logout: 'Log out',
      topUp: 'Top up',
      walletTitle: 'How much would you like to top up?',
      walletMin: 'Minimum amount — €5',
      walletDiscount: 'Discount on first package',
      walletDiscountDesc: 'Get your first unlimited response package with 50% off.',
      walletChoose: 'Choose package',
      walletPay: 'Proceed to payment',
      notifications: 'Notifications',
      noNotifs: 'No notifications',
      messages: 'Messages',
    },
  };
  const lt = t[lang];

  const amountNum = parseFloat(walletAmount) || 0;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-10">
            <a href="#/" className="flex items-center gap-2">
              <img src={logo} alt="GetDoIt" className="h-12 md:h-14" />
            </a>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#/create-task" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                {tr.nav.createTask}
              </a>
              <a href="#/tasks" className="text-sm font-medium text-foreground hover:text-accent transition-colors">
                {tr.nav.findTasks}
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
              className="text-xs font-bold px-3 py-1.5 rounded-md border border-border text-foreground hover:bg-muted transition-colors"
            >
              {lang === 'de' ? '🇬🇧 EN' : '🇩🇪 DE'}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-1">
                {/* Notifications */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadNotifs > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                          {unreadNotifs}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 p-0">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-bold text-foreground">{lt.notifications}</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground text-center">{lt.noNotifs}</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-3 border-b border-border last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-foreground">{n.title}</p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {new Date(n.created_at).toLocaleDateString(lang)}
                              </span>
                            </div>
                            {n.body && <p className="text-xs text-muted-foreground mt-1">{n.body}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Messages */}
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <a href="#/messages">
                    <MessageSquare className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadMessages}
                      </span>
                    )}
                  </a>
                </Button>

                {/* Wallet */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-primary font-medium"
                  onClick={() => setWalletOpen(true)}
                >
                  <Wallet className="h-4 w-4" />
                  {lt.topUp}
                </Button>

                {/* Avatar dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-primary transition-colors ml-1">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {(profile?.name || user.email?.charAt(0) || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=about')} className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" /> {lt.profile}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=tariffs')} className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="w-4 h-4" /> {lt.tariffs}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=settings&sub=subscriptions')} className="flex items-center gap-2 cursor-pointer">
                      <Bell className="w-4 h-4" /> {lt.taskSub}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard?tab=settings')} className="flex items-center gap-2 cursor-pointer">
                      <Settings className="w-4 h-4" /> {lt.settings}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4" /> {lt.logout}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                asChild
              >
                <a href="#/auth">{tr.nav.login}</a>
              </Button>
            )}
            <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
            <a href="#/create-task" className="block text-sm font-medium text-foreground">{tr.nav.createTask}</a>
            <a href="#/tasks" className="block text-sm font-medium text-foreground">{tr.nav.findTasks}</a>
            {user ? (
              <>
                <a href="#/dashboard" className="block text-sm font-medium text-foreground">{lt.profile}</a>
                <a href="#/messages" className="block text-sm font-medium text-foreground">{lt.messages}</a>
                <Button variant="outline" size="sm" className="w-full" onClick={() => { setMobileOpen(false); setWalletOpen(true); }}>
                  <Wallet className="h-4 w-4 mr-2" /> {lt.topUp}
                </Button>
                <Button variant="outline" size="sm" className="w-full border-accent text-accent" onClick={signOut}>
                  {lt.logout}
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" className="w-full border-accent text-accent" asChild>
                <a href="#/auth">{tr.nav.login}</a>
              </Button>
            )}
          </div>
        )}
      </header>

      {/* Wallet top-up dialog */}
      <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
        <DialogContent className="sm:max-w-md p-8 text-center">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">{lt.walletTitle}</h2>

          <div className="mb-2">
            <div className="flex items-center justify-center gap-1">
              <Input
                type="number"
                min={5}
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
                className="text-center text-3xl font-bold border-0 border-b-2 border-border rounded-none shadow-none focus-visible:ring-0 w-32 h-auto py-2"
              />
              <span className="text-3xl font-bold text-foreground">€</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{lt.walletMin}</p>
          </div>

          <div className="bg-muted/30 rounded-xl p-5 my-6 text-center">
            <p className="text-lg font-bold text-foreground">🌟 {lt.walletDiscount}</p>
            <p className="text-sm text-muted-foreground mt-1">{lt.walletDiscountDesc}</p>
            <button className="text-sm text-primary hover:underline mt-2">{lt.walletChoose}</button>
          </div>

          <Button
            size="lg"
            className="w-full py-6 text-base"
            disabled={amountNum < 5}
            onClick={() => {
              setWalletOpen(false);
              // TODO: Stripe integration
            }}
          >
            {lt.walletPay} {amountNum >= 5 ? `${amountNum} €` : ''}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
