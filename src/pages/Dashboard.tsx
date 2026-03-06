import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/supabaseClient';
import { useAuth } from '@/components/AuthDialog';
import { Heart, Stethoscope, Calendar, MessageCircle, Activity, BookOpen, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  name: string | null;
}

interface PregnancyRecord {
  id: string;
  lmp_date: string | null;
  due_date: string | null;
}

interface DashboardStats {
  symptomChecks: number;
  savedArticles: number;
  communityPosts: number;
}

function calculateCurrentWeek(lmpDate: string | null): number | null {
  if (!lmpDate) return null;
  const lmp = new Date(lmpDate);
  if (Number.isNaN(lmp.getTime())) return null;
  const today = new Date();
  const diffMs = today.getTime() - lmp.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const weeks = Math.floor(diffDays / 7);
  if (!Number.isFinite(weeks)) return null;
  const clamped = Math.max(0, Math.min(40, weeks));
  return clamped;
}

const Dashboard = () => {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fallbackName, setFallbackName] = useState<string | null>(null);
  const [pregnancy, setPregnancy] = useState<PregnancyRecord | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    symptomChecks: 0,
    savedArticles: 0,
    communityPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    const userId = authUser?.id ?? null;
    if (!userId) {
      setError('You must be logged in to view your dashboard.');
      setProfile(null);
      setPregnancy(null);
      setStats({ symptomChecks: 0, savedArticles: 0, communityPosts: 0 });
      setLoading(false);
      return;
    }

    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      setFallbackName(authUser?.name ?? 'there');

      const [
        { data: profileRows, error: profileError },
        { data: pregnancyRows, error: pregnancyError },
        { count: symptomCount, error: symptomError },
        { count: savedCount, error: savedError },
        { count: postsCount, error: postsError },
      ] = await Promise.all([
        supabase.from('profiles').select('id, name').eq('id', userId).limit(1),
        supabase
          .from('pregnancy_records')
          .select('id, lmp_date, due_date')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1),
        supabase.from('symptom_checks').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('saved_articles').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('community_posts').select('*', { count: 'exact', head: true }).eq('author_id', userId),
      ]);

      if (!isMounted) return;

      if (profileError) {
        console.error(profileError);
      }
      if (pregnancyError) {
        console.error(pregnancyError);
      }
      if (symptomError) {
        console.error(symptomError);
      }
      if (savedError) {
        console.error(savedError);
      }
      if (postsError) {
        console.error(postsError);
      }

      setProfile(profileRows && profileRows.length > 0 ? (profileRows[0] as Profile) : null);
      setPregnancy(pregnancyRows && pregnancyRows.length > 0 ? (pregnancyRows[0] as PregnancyRecord) : null);
      setStats({
        symptomChecks: symptomCount ?? 0,
        savedArticles: savedCount ?? 0,
        communityPosts: postsCount ?? 0,
      });

      setLoading(false);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [authUser?.id, authLoading]);

  const currentWeek = calculateCurrentWeek(pregnancy?.lmp_date ?? null);

  const quickLinks = [
    { path: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
    { path: '/pregnancy-tracker', label: 'Pregnancy Tracker', icon: Calendar },
    { path: '/community', label: 'Community', icon: MessageCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary" />
          Welcome back, {profile?.name || fallbackName || 'there'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Your maternal health companion. Here's how we can help you today.
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground mb-6">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading your dashboard...</span>
        </div>
      )}

      {error && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  Pregnancy overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pregnancy && currentWeek !== null ? (
                  <>
                    <CardDescription>
                      Based on your last menstrual period, you're currently around:
                    </CardDescription>
                    <p className="text-3xl font-semibold mt-2">Week {currentWeek}</p>
                    {pregnancy.due_date && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Estimated due date: {new Date(pregnancy.due_date).toLocaleDateString()}
                      </p>
                    )}
                    <Button asChild variant="link" className="mt-2 px-0 h-auto">
                      <Link to="/pregnancy-tracker">View full pregnancy tracker →</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <CardDescription>
                      You haven't set up your pregnancy details yet.
                    </CardDescription>
                    <Button asChild className="mt-3 btn-medical-accent">
                      <Link to="/pregnancy-tracker">Set up your pregnancy</Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your activity</CardTitle>
                <CardDescription>Quick overview of your usage</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Activity className="w-3 h-3" />
                    Symptom checks
                  </div>
                  <p className="text-2xl font-semibold">{stats.symptomChecks}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="w-3 h-3" />
                    Saved articles
                  </div>
                  <p className="text-2xl font-semibold">{stats.savedArticles}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="w-3 h-3" />
                    Posts
                  </div>
                  <p className="text-2xl font-semibold">{stats.communityPosts}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Icon className="w-5 h-5 text-primary" />
                        {item.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        {item.path === '/symptom-checker' && 'Check symptoms and get guidance'}
                        {item.path === '/pregnancy-tracker' && 'Track your pregnancy progress'}
                        {item.path === '/community' && 'Connect with other mothers'}
                      </CardDescription>
                      <Button variant="link" className="mt-2 p-0 h-auto">
                        Go →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
