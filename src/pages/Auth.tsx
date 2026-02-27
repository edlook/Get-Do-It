import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLang } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

export default function Auth() {
  const { lang } = useLang();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate('/dashboard');
  }, [user, authLoading, navigate]);

  const tr = {
    de: {
      loginTitle: 'Anmelden',
      registerTitle: 'Registrieren',
      email: 'E-Mail',
      password: 'Passwort',
      name: 'Vollständiger Name',
      city: 'Stadt',
      roleClient: 'Auftraggeber',
      roleProvider: 'Dienstleister',
      roleLabel: 'Ich bin',
      submit: 'Absenden',
      switchToRegister: 'Noch kein Konto? Registrieren',
      switchToLogin: 'Bereits registriert? Anmelden',
      loginSuccess: 'Erfolgreich angemeldet!',
      registerSuccess: 'Registrierung erfolgreich!',
      checkEmail: 'Bitte bestätigen Sie Ihre E-Mail-Adresse über den Link in Ihrem Postfach.',
      registeredTitle: 'Fast geschafft!',
      registeredMessage: 'Wir haben Ihnen eine Bestätigungs-E-Mail gesendet. Bitte klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.',
      backToLogin: 'Zurück zur Anmeldung',
      error: 'Fehler',
    },
    en: {
      loginTitle: 'Log In',
      registerTitle: 'Sign Up',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      city: 'City',
      roleClient: 'Client',
      roleProvider: 'Service Provider',
      roleLabel: 'I am a',
      submit: 'Submit',
      switchToRegister: "Don't have an account? Sign up",
      switchToLogin: 'Already registered? Log in',
      loginSuccess: 'Successfully logged in!',
      registerSuccess: 'Registration successful!',
      checkEmail: 'Please confirm your email address via the link sent to your inbox.',
      registeredTitle: 'Almost there!',
      registeredMessage: 'We sent you a confirmation email. Please click the link in the email to activate your account.',
      backToLogin: 'Back to login',
      error: 'Error',
    },
  };
  const t = tr[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: t.loginSuccess });
        navigate('/dashboard');
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name, role, city },
          },
        });
        if (error) throw error;
        toast({ title: t.registerSuccess });
        // If session is returned immediately (auto-confirm), navigate
        if (data.session) {
          navigate('/dashboard');
        } else {
          // Fallback: sign in immediately after signup
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) throw signInError;
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      toast({ title: t.error, description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {registered ? (
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm text-center space-y-4">
              <div className="text-5xl">📧</div>
              <h2 className="text-2xl font-display font-bold text-foreground">{t.registeredTitle}</h2>
              <p className="text-muted-foreground">{t.registeredMessage}</p>
              <Button variant="outline" className="mt-4" onClick={() => { setRegistered(false); setIsLogin(true); }}>
                {t.backToLogin}
              </Button>
            </div>
          ) : (
          <>
          <h1 className="text-3xl font-display font-bold text-foreground text-center mb-8">
            {isLogin ? t.loginTitle : t.registerTitle}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 bg-card rounded-xl p-6 border border-border shadow-sm">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name">{t.name}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="city">{t.city}</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <Label>{t.roleLabel}</Label>
                  <div className="flex gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setRole('client')}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                        role === 'client'
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {t.roleClient}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('provider')}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                        role === 'provider'
                          ? 'bg-accent text-accent-foreground border-accent'
                          : 'bg-background text-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {t.roleProvider}
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">{t.password}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '...' : t.submit}
            </Button>

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-sm text-accent hover:underline mt-2"
            >
              {isLogin ? t.switchToRegister : t.switchToLogin}
            </button>
          </form>
          </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
