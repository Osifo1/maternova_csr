import { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { User, Stethoscope, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Auth Context - synced with Supabase session
interface AuthContextType {
  user: { id: string; name: string; role: string } | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(supabaseUser: SupabaseUser | null): { id: string; name: string; role: string } | null {
  if (!supabaseUser) return null;
  const meta = supabaseUser.user_metadata || {};
  const name = meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'User';
  const role = meta.user_type === 'provider' ? 'provider' : 'user';
  return { id: supabaseUser.id, name, role };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const supabaseUser = session?.user ?? null;
      const meta = supabaseUser?.user_metadata ?? {};

      if (meta.user_type === 'provider' && meta.provider_status && meta.provider_status !== 'approved') {
        // Provider exists but is not yet approved – immediately sign them out
        supabase.auth.signOut();
        setUser(null);
        setIsLoading(false);
        return;
      }

      setUser(mapSupabaseUser(supabaseUser));
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const supabaseUser = session?.user ?? null;
      const meta = supabaseUser?.user_metadata ?? {};

      if (meta.user_type === 'provider' && meta.provider_status && meta.provider_status !== 'approved') {
        supabase.auth.signOut();
        setUser(null);
        return;
      }

      setUser(mapSupabaseUser(supabaseUser));
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthDialogProps {
  children: React.ReactNode;
}

export const AuthDialog = ({ children }: AuthDialogProps) => {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'user' | 'provider'>('main');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // User login form state
  const [userLoginEmail, setUserLoginEmail] = useState('');
  const [userLoginPassword, setUserLoginPassword] = useState('');

  // User signup form state
  const [userSignupName, setUserSignupName] = useState('');
  const [userSignupEmail, setUserSignupEmail] = useState('');
  const [userSignupPassword, setUserSignupPassword] = useState('');
  const [userSignupConfirmPassword, setUserSignupConfirmPassword] = useState('');

  // Provider login form state
  const [providerLoginEmail, setProviderLoginEmail] = useState('');
  const [providerLoginPassword, setProviderLoginPassword] = useState('');

  // Provider signup form state
  const [providerSignupName, setProviderSignupName] = useState('');
  const [providerSignupEmail, setProviderSignupEmail] = useState('');
  const [providerSignupLicense, setProviderSignupLicense] = useState('');
  const [providerSignupSpecialization, setProviderSignupSpecialization] = useState('');
  const [providerSignupPassword, setProviderSignupPassword] = useState('');
  const [providerSignupConfirmPassword, setProviderSignupConfirmPassword] = useState('');

  const resetUserForms = () => {
    setUserLoginEmail('');
    setUserLoginPassword('');
    setUserSignupName('');
    setUserSignupEmail('');
    setUserSignupPassword('');
    setUserSignupConfirmPassword('');
  };

  const resetProviderForms = () => {
    setProviderLoginEmail('');
    setProviderLoginPassword('');
    setProviderSignupName('');
    setProviderSignupEmail('');
    setProviderSignupLicense('');
    setProviderSignupSpecialization('');
    setProviderSignupPassword('');
    setProviderSignupConfirmPassword('');
  };

  const resetAllForms = () => {
    resetUserForms();
    resetProviderForms();
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentView('main');
    resetAllForms();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setCurrentView('main');
      resetAllForms();
    }
  };

  const handleUserSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userLoginEmail,
        password: userLoginPassword,
      });
      if (authError) throw authError;
      toast({ title: "Welcome back!", description: "Successfully signed in." });
      handleClose();
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Sign in failed. Please try again.';
      setError(msg);
      toast({ title: "Sign in failed", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (userSignupPassword !== userSignupConfirmPassword) {
      const msg = 'Passwords do not match.';
      setError(msg);
      toast({ title: "Sign up failed", description: msg, variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: userSignupEmail,
        password: userSignupPassword,
        options: { data: { full_name: userSignupName, user_type: 'user' } },
      });
      if (authError) throw authError;
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account. You can sign in once verified.",
        duration: 6000,
      });
      handleClose();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Sign up failed. Please try again.';
      setError(msg);
      toast({ title: "Sign up failed", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: providerLoginEmail,
        password: providerLoginPassword,
      });
      if (authError) throw authError;

      const signedInUser = data.user;
      const meta = signedInUser?.user_metadata ?? {};

      if (meta.user_type === 'provider' && meta.provider_status && meta.provider_status !== 'approved') {
        await supabase.auth.signOut();
        const msg =
          'Your healthcare provider account is still under review. An admin must approve it before you can log in.';
        setError(msg);
        toast({ title: "Account pending approval", description: msg, variant: "destructive" });
        return;
      }

      toast({ title: "Welcome back, Healthcare Provider!", description: "Successfully signed in." });
      handleClose();
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Sign in failed. Please try again.';
      setError(msg);
      toast({ title: "Sign in failed", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (providerSignupPassword !== providerSignupConfirmPassword) {
      const msg = 'Passwords do not match.';
      setError(msg);
      toast({ title: "Sign up failed", description: msg, variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: providerSignupEmail,
        password: providerSignupPassword,
        options: {
          data: {
            full_name: providerSignupName,
            license_number: providerSignupLicense,
            specialization: providerSignupSpecialization,
            user_type: 'provider',
            provider_status: 'pending',
          },
        },
      });
      if (authError) throw authError;
      await supabase.auth.signOut();
      toast({
        title: "Application submitted",
        description:
          "Your healthcare provider account is under review. An admin will approve it before you can log in. Please also check your email to confirm your address.",
        duration: 6000,
      });
      handleClose();
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Sign up failed. Please try again.';
      setError(msg);
      toast({ title: "Sign up failed", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMainView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-xl font-semibold">
          Welcome to Maternova
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-3 mt-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => {
            resetAllForms();
            setCurrentView('user');
          }}
        >
          <CardContent className="flex items-center space-x-3 p-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm">User</CardTitle>
              <CardDescription className="text-xs">Sign up or sign in as a regular user</CardDescription>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => {
            resetAllForms();
            setCurrentView('provider');
          }}
        >
          <CardContent className="flex items-center space-x-3 p-4">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-sm">Healthcare Provider</CardTitle>
              <CardDescription className="text-xs">For doctors, nurses, and midwives</CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        🔒 Your data is protected and secure
      </p>
    </>
  );

  const renderUserView = () => (
    <>
      <DialogHeader>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            resetUserForms();
            setCurrentView('main');
            setError(null);
          }}
          className="absolute left-4 top-4"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <DialogTitle className="text-center text-xl font-semibold">
          User Account
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <h3 className="text-sm font-medium mb-3">Sign In</h3>
          <form onSubmit={handleUserSignIn} className="space-y-3">
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={userLoginEmail}
              onChange={(e) => setUserLoginEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Input
              type="password"
              placeholder="Your password"
              value={userLoginPassword}
              onChange={(e) => setUserLoginPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Button type="submit" className="w-full btn-medical-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3">Sign Up</h3>
          <form onSubmit={handleUserSignUp} className="space-y-3">
            <Input
              type="text"
              placeholder="Your full name"
              value={userSignupName}
              onChange={(e) => setUserSignupName(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={userSignupEmail}
              onChange={(e) => setUserSignupEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Input
              type="password"
              placeholder="Password"
              value={userSignupPassword}
              onChange={(e) => setUserSignupPassword(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              autoComplete="new-password"
              required
              disabled={isSubmitting}
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={userSignupConfirmPassword}
              onChange={(e) => setUserSignupConfirmPassword(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              autoComplete="new-password"
              required
              disabled={isSubmitting}
            />
            <Button type="submit" className="w-full btn-medical-accent" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );

  const renderProviderView = () => (
    <>
      <DialogHeader>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => {
            resetProviderForms();
            setCurrentView('main');
            setError(null);
          }}
          className="absolute left-4 top-4"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <DialogTitle className="text-center text-xl font-semibold">
          Healthcare Provider
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div>
          <h3 className="text-sm font-medium mb-3">Sign In (Verified Providers)</h3>
          <form onSubmit={handleProviderSignIn} className="space-y-3">
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={providerLoginEmail}
              onChange={(e) => setProviderLoginEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Input
              type="password"
              placeholder="Your password"
              value={providerLoginPassword}
              onChange={(e) => setProviderLoginPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Button type="submit" className="w-full btn-medical-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3">Apply to Join</h3>
          <form onSubmit={handleProviderSignUp} className="space-y-3">
            <Input
              type="text"
              placeholder="Full name"
              value={providerSignupName}
              onChange={(e) => setProviderSignupName(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Input
              type="email"
              placeholder="Professional email"
              value={providerSignupEmail}
              onChange={(e) => setProviderSignupEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Input
              type="text"
              placeholder="License number"
              value={providerSignupLicense}
              onChange={(e) => setProviderSignupLicense(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Input
              type="text"
              placeholder="Specialization (e.g., Obstetrics, Pediatrics)"
              value={providerSignupSpecialization}
              onChange={(e) => setProviderSignupSpecialization(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <Input
              type="password"
              placeholder="Password"
              value={providerSignupPassword}
              onChange={(e) => setProviderSignupPassword(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              autoComplete="new-password"
              required
              disabled={isSubmitting}
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={providerSignupConfirmPassword}
              onChange={(e) => setProviderSignupConfirmPassword(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              autoComplete="new-password"
              required
              disabled={isSubmitting}
            />
            <Button type="submit" className="w-full btn-medical-secondary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Your application will be reviewed by our admin team
            </p>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {currentView === 'main' && renderMainView()}
        {currentView === 'user' && renderUserView()}
        {currentView === 'provider' && renderProviderView()}
      </DialogContent>
    </Dialog>
  );
};