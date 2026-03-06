import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, MessageCircle, BookOpen, Users, Stethoscope, Brain, LogIn, LogOut, HelpCircle, Calendar, Baby, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog, useAuth } from '@/components/AuthDialog';
import maternovaLogo from '@/assets/maternova-logo.jpg';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Heart },
    ...(user ? [{ path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] as const : []),
    { path: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
    { path: '/pregnancy-tracker', label: 'Pregnancy Tracker', icon: Calendar },
    { path: '/maternal-preparation', label: 'Preparation Guide', icon: Baby },
    { path: '/quiz', label: 'Quiz', icon: Brain },
    { path: '/community', label: 'Community', icon: MessageCircle },
    { path: '/articles', label: 'Articles', icon: BookOpen },
    { path: '/team', label: 'Meet the Team', icon: Users },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={maternovaLogo} 
                alt="Maternova Logo - Guiding Mothers, Protecting Children" 
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Auth Button */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">
                    {user.name} ({user.role})
                  </span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <AuthDialog>
                  <Button size="sm" className="btn-medical-accent">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login / Sign Up
                  </Button>
                </AuthDialog>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center space-x-3 ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      {user.name} ({user.role})
                    </div>
                    <Button variant="ghost" size="sm" className="justify-start w-full" onClick={logout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <AuthDialog>
                    <Button size="sm" className="btn-medical-accent justify-start w-full">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login / Sign Up
                    </Button>
                  </AuthDialog>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-muted border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={maternovaLogo} 
                  alt="Maternova Logo - Guiding Mothers, Protecting Children" 
                  className="h-12 w-auto object-contain"
                />
              </div>
              <p className="text-muted-foreground max-w-md">
                Supporting mothers and families with trusted medical guidance, community support, and expert care throughout your journey.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/articles" className="hover:text-foreground">Health Articles</Link></li>
                <li><Link to="/symptom-checker" className="hover:text-foreground">Symptom Checker</Link></li>
                <li><Link to="/community" className="hover:text-foreground">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/team" className="hover:text-foreground">Our Team</Link></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Maternova. Your data is protected and secure.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;