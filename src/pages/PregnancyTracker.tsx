import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Baby, Heart, Bell } from "lucide-react";
import { format, differenceInWeeks, addWeeks, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/pregnancy-tracker-hero.jpg";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/components/AuthDialog";

const weeklyUpdates = [
  { week: 4, message: "Your baby is the size of a poppy seed. The neural tube is forming." },
  { week: 5, message: "Your baby's heart is beginning to beat. Major organs are starting to develop." },
  { week: 8, message: "Your baby is now called a fetus. Fingers and toes are forming." },
  { week: 12, message: "Your baby can make a fist and is developing reflexes. You might hear the heartbeat!" },
  { week: 16, message: "Your baby can hear sounds and may start moving. You might feel the first kicks soon!" },
  { week: 20, message: "You're halfway there! Your baby is practicing breathing and can recognize your voice." },
  { week: 24, message: "Your baby's lungs are developing. They can respond to sounds with movement." },
  { week: 28, message: "Your baby is dreaming! They're developing sleep patterns and growing rapidly." },
  { week: 32, message: "Your baby is practicing breathing and their bones are hardening." },
  { week: 36, message: "Your baby is getting ready for birth. They're gaining about an ounce per day!" },
  { week: 40, message: "You've reached full term! Your baby is ready to meet you anytime now." },
];

const PregnancyTracker = () => {
  const { user: authUser, isLoading: authLoadingContext } = useAuth();
  const [lmpDate, setLmpDate] = useState<Date>();
  const [currentWeekInput, setCurrentWeekInput] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>();
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [weeklyMessage, setWeeklyMessage] = useState<string>("");

  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [pregnancyRecordId, setPregnancyRecordId] = useState<string | null>(null);
  const [loadingFromSupabase, setLoadingFromSupabase] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  type WeekInfo = {
    week: number;
    title: string | null;
    description: string | null;
    trimester: string | null;
  };

  type Reminder = {
    id: string;
    title: string;
    description: string | null;
    due_at: string | null;
    is_completed: boolean;
  };

  const [weekInfo, setWeekInfo] = useState<WeekInfo | null>(null);
  const [weekInfoLoading, setWeekInfoLoading] = useState<boolean>(false);
  const [remindersData, setRemindersData] = useState<Reminder[]>([]);
  const [remindersLoading, setRemindersLoading] = useState<boolean>(false);
  const [newReminderTitle, setNewReminderTitle] = useState<string>("");
  const [newReminderDueAt, setNewReminderDueAt] = useState<string>("");

  // Sync auth loading state
  useEffect(() => {
    setAuthLoading(authLoadingContext);
  }, [authLoadingContext]);

  useEffect(() => {
    if (authLoadingContext) return;

    const userId = authUser?.id ?? null;
    setAuthUserId(userId);

    if (!userId) {
      setLoadingFromSupabase(false);
      setPregnancyRecordId(null);
      return;
    }

    let cancelled = false;
    setAuthLoading(false);
    setLoadError(null);
    setLoadingFromSupabase(true);

    const loadPregnancy = async () => {
      const { data: record, error: recordError } = await supabase
        .from("pregnancy_records")
        .select("id, lmp_date")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      if (recordError && recordError.code !== "PGRST116") {
        console.error(recordError);
        setLoadError(recordError.message ?? "Unable to load your pregnancy record.");
      }

      if (record && record.lmp_date) {
        setPregnancyRecordId(record.id as string);
        setLmpDate(new Date(record.lmp_date));
      } else {
        setPregnancyRecordId(null);
      }

      setLoadingFromSupabase(false);
    };

    loadPregnancy();

    return () => {
      cancelled = true;
    };
  }, [authUser?.id, authLoadingContext]);

  useEffect(() => {
    if (!lmpDate) return;

    const today = new Date();
    const calculatedDueDate = addDays(lmpDate, 280); // 40 weeks from LMP
    const weeksPregnant = differenceInWeeks(today, lmpDate);

    const week = Math.min(Math.max(weeksPregnant, 0), 40);
    setCurrentWeek(week);
    setDueDate(calculatedDueDate);

    const progress = (week / 40) * 100;
    setProgressPercentage(Math.min(progress, 100));

    if (!authUserId) return;

    const saveRecord = async () => {
      const lmpDateStr = lmpDate.toISOString().slice(0, 10);
      const dueDateStr = calculatedDueDate.toISOString().slice(0, 10);

      try {
        if (pregnancyRecordId) {
          const { error } = await supabase
            .from("pregnancy_records")
            .update({
              lmp_date: lmpDateStr,
              due_date: dueDateStr,
              updated_at: new Date().toISOString(),
            })
            .eq("id", pregnancyRecordId);
          if (error) {
            console.error(error);
          }
        } else {
          const { data: authData } = await supabase.auth.getUser();
          const authUser = authData?.user;
          if (authUser) {
            await supabase.from("profiles").upsert(
              {
                id: authUser.id,
                name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
                email: authUser.email ?? "",
                user_type: "mother",
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" }
            );
          }

          const { data, error } = await supabase
            .from("pregnancy_records")
            .insert({
              user_id: authUserId,
              lmp_date: lmpDateStr,
              due_date: dueDateStr,
            })
            .select("id")
            .single();
          if (error) {
            console.error(error);
          } else if (data?.id) {
            setPregnancyRecordId(data.id as string);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    void saveRecord();
  }, [lmpDate, authUserId, pregnancyRecordId]);

  useEffect(() => {
    if (currentWeekInput && !isNaN(Number(currentWeekInput))) {
      const week = Math.min(Math.max(Number(currentWeekInput), 0), 40);
      const today = new Date();
      const calculatedLMP = addWeeks(today, -week);

      setLmpDate(calculatedLMP);
    }
  }, [currentWeekInput]);

  useEffect(() => {
    if (!currentWeek || currentWeek <= 0) {
      setWeekInfo(null);
      setWeeklyMessage("");
      return;
    }

    let cancelled = false;

    const loadWeekInfo = async () => {
      setWeekInfoLoading(true);
      try {
        const { data, error } = await supabase
          .from("pregnancy_weeks")
          .select("week, title, description, trimester")
          .eq("week", currentWeek)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.error(error);
          setWeekInfo(null);
        } else if (data) {
          setWeekInfo({
            week: data.week,
            title: (data as any).title ?? null,
            description: (data as any).description ?? null,
            trimester: (data as any).trimester ?? null,
          });
        } else {
          setWeekInfo(null);
        }
      } finally {
        if (!cancelled) {
          setWeekInfoLoading(false);
        }
      }
    };

    loadWeekInfo();

    return () => {
      cancelled = true;
    };
  }, [currentWeek]);

  useEffect(() => {
    if (weekInfo && weekInfo.description) {
      setWeeklyMessage(weekInfo.description);
    } else if (currentWeek > 0) {
      const closestUpdate = weeklyUpdates
        .filter((u) => u.week <= currentWeek)
        .sort((a, b) => b.week - a.week)[0];
      setWeeklyMessage(closestUpdate?.message || "Your pregnancy journey has begun!");
    } else {
      setWeeklyMessage("");
    }
  }, [weekInfo, currentWeek]);

  useEffect(() => {
    if (!authUserId || !pregnancyRecordId) {
      setRemindersData([]);
      return;
    }

    let cancelled = false;

    const loadReminders = async () => {
      setRemindersLoading(true);
      try {
        const { data, error } = await supabase
          .from("pregnancy_reminders")
          .select("id, title, description, due_at, is_completed")
          .eq("user_id", authUserId)
          .eq("pregnancy_record_id", pregnancyRecordId)
          .order("due_at", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error(error);
        } else {
          setRemindersData(data ?? []);
        }
      } finally {
        if (!cancelled) {
          setRemindersLoading(false);
        }
      }
    };

    loadReminders();

    return () => {
      cancelled = true;
    };
  }, [authUserId, pregnancyRecordId]);

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUserId || !pregnancyRecordId || !newReminderTitle) return;

    setRemindersLoading(true);
    try {
      const { error } = await supabase.from("pregnancy_reminders").insert({
        user_id: authUserId,
        pregnancy_record_id: pregnancyRecordId,
        reminder_type: "other",
        title: newReminderTitle,
        description: null,
        due_at: newReminderDueAt ? new Date(newReminderDueAt).toISOString() : null,
      });

      if (error) {
        console.error(error);
        return;
      }

      setNewReminderTitle("");
      setNewReminderDueAt("");

      const { data, error: reloadError } = await supabase
        .from("pregnancy_reminders")
        .select("id, title, description, due_at, is_completed")
        .eq("user_id", authUserId)
        .eq("pregnancy_record_id", pregnancyRecordId)
        .order("due_at", { ascending: true });

      if (reloadError) {
        console.error(reloadError);
      } else {
        setRemindersData(data ?? []);
      }
    } finally {
      setRemindersLoading(false);
    }
  };

  const handleCompleteReminder = async (id: string) => {
    if (!authUserId || !pregnancyRecordId) return;

    setRemindersLoading(true);
    try {
      const { error } = await supabase
        .from("pregnancy_reminders")
        .update({ is_completed: true, completed_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", authUserId);

      if (error) {
        console.error(error);
        return;
      }

      setRemindersData((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_completed: true } : r)),
      );
    } finally {
      setRemindersLoading(false);
    }
  };

  const trimesterLabel =
    weekInfo?.trimester ??
    (currentWeek > 0 && currentWeek <= 12
      ? "first"
      : currentWeek >= 13 && currentWeek <= 27
      ? "second"
      : currentWeek >= 28
      ? "third"
      : "");

  return (
    <div className="min-h-screen">
      <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Pregnant woman in peaceful meditation" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8 py-12 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Pregnancy Tracker</h1>
          <p className="text-muted-foreground text-lg">
            Track your journey to motherhood with personalized weekly updates
          </p>
        </div>

        {loadError && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive text-base">Unable to load your saved data</CardTitle>
              <CardDescription className="text-destructive/80 text-sm">{loadError}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {!authLoading && !authUserId && (
          <Card className="border-dashed border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle>Sign in to save your pregnancy tracking</CardTitle>
              <CardDescription>
                You can still use the tracker now, but your progress and reminders will only be saved when you
                create an account and sign in.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Track Your Pregnancy
            </CardTitle>
            <CardDescription>
              Enter information to calculate your due date and track your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lmp" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lmp">Last Menstrual Period</TabsTrigger>
                <TabsTrigger value="week">Current Week</TabsTrigger>
              </TabsList>
              <TabsContent value="lmp" className="space-y-4 mt-4">
                <div className="flex flex-col space-y-2">
                  <Label>When was the first day of your last menstrual period?</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !lmpDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lmpDate ? format(lmpDate, "PPP") : "Select LMP date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={lmpDate}
                        onSelect={setLmpDate}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </TabsContent>
              <TabsContent value="week" className="space-y-4 mt-4">
                <div className="flex flex-col space-y-2">
                  <Label>How many weeks pregnant are you?</Label>
                  <Input
                    type="number"
                    min="0"
                    max="40"
                    placeholder="Enter week (0-40)"
                    value={currentWeekInput}
                    onChange={(e) => setCurrentWeekInput(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {dueDate && currentWeek > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5" />
                  Your Pregnancy Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">You are:</p>
                  <div className="text-5xl font-bold text-primary">Week {currentWeek}</div>
                  <p className="text-lg text-muted-foreground">
                    Expected due date: {format(dueDate, "MMMM d, yyyy")}
                  </p>
                  {trimesterLabel && (
                    <p className="text-sm text-muted-foreground">
                      Trimester: {trimesterLabel.charAt(0).toUpperCase() + trimesterLabel.slice(1)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress: {Math.round(progressPercentage)}% ({currentWeek}/40 weeks)</span>
                    <span>{40 - currentWeek} weeks until due date</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  This Week's Update
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weekInfoLoading ? (
                  <p className="text-sm text-muted-foreground">Loading this week's update...</p>
                ) : (
                  <p className="text-foreground leading-relaxed">{weeklyMessage}</p>
                )}
              </CardContent>
            </Card>

            {authUserId && pregnancyRecordId && (
              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Bell className="h-5 w-5" />
                    Pregnancy reminders
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-primary">
                    Add important checkups and tasks, and mark them as done as you progress.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleAddReminder} className="grid gap-3 md:grid-cols-[2fr,2fr,auto] items-end">
                    <div className="space-y-1">
                      <Label htmlFor="reminder-title">Reminder</Label>
                      <Input
                        id="reminder-title"
                        placeholder="e.g. Schedule anatomy scan"
                        value={newReminderTitle}
                        onChange={(e) => setNewReminderTitle(e.target.value)}
                        disabled={remindersLoading}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="reminder-due">Due date</Label>
                      <Input
                        id="reminder-due"
                        type="datetime-local"
                        value={newReminderDueAt}
                        onChange={(e) => setNewReminderDueAt(e.target.value)}
                        disabled={remindersLoading}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="btn-medical-accent"
                      disabled={remindersLoading || !newReminderTitle}
                    >
                      Add
                    </Button>
                  </form>

                  <div className="space-y-3">
                    {remindersLoading && (
                      <p className="text-sm text-muted-foreground">Loading reminders...</p>
                    )}
                    {!remindersLoading && remindersData.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        You don't have any reminders yet. Add your first one above.
                      </p>
                    )}
                    {remindersData.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-start justify-between rounded-md border border-primary/40 bg-background p-3"
                      >
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              r.is_completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {r.title}
                          </p>
                          {r.due_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Due {new Date(r.due_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                        {!r.is_completed && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCompleteReminder(r.id)}
                            disabled={remindersLoading}
                          >
                            Mark done
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PregnancyTracker;