import { MysticWidget } from '@/components/mystic/MysticWidget';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format, isToday, isYesterday, startOfWeek, addDays } from 'date-fns';
import { Plus, Flame, TrendingUp, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMoodData } from '@/hooks/useMoodData';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Helper to get mood emoji
const getMoodEmoji = (mood: string) => {
  switch (mood) {
    case 'happy': return '😊';
    case 'excited': return '🤩';
    case 'neutral': return '😐';
    case 'tired': return '😴';
    case 'sad': return '😢';
    case 'angry': return '😡';
    default: return '❓';
  }
};

const getMoodColor = (mood: string) => {
  switch (mood) {
    case 'happy': return 'bg-green-500/20 text-green-500';
    case 'excited': return 'bg-yellow-500/20 text-yellow-500';
    case 'neutral': return 'bg-gray-500/20 text-gray-500';
    case 'tired': return 'bg-purple-500/20 text-purple-500';
    case 'sad': return 'bg-blue-500/20 text-blue-500';
    case 'angry': return 'bg-red-500/20 text-red-500';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

export function Dashboard() {
  const { user } = useAuth();
  const { entries } = useMoodData();
  const [greeting, setGreeting] = useState('');

  // Calculate streak
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Simple streak calculation
    let currentStreak = 0;

    // Sort ascending for streak check
    const sortedEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);

    if (sortedEntries.length > 0) {
      const latestEntry = new Date(sortedEntries[sortedEntries.length - 1].timestamp);
      if (isToday(latestEntry) || isYesterday(latestEntry)) {
        currentStreak = 1;
        for (let i = sortedEntries.length - 2; i >= 0; i--) {
           const prevEntryDate = new Date(sortedEntries[i].timestamp);
           const currEntryDate = new Date(sortedEntries[i+1].timestamp);
           const diffTime = Math.abs(currEntryDate.getTime() - prevEntryDate.getTime());
           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

           if(diffDays === 1 || diffDays === 0) {
              if(diffDays === 1) currentStreak++;
           } else {
             break;
           }
        }
      }
    }
    setStreak(currentStreak);
  }, [entries]);

  const recentEntries = entries.slice(0, 3);
  const todayEntry = entries.find(e => isToday(new Date(e.timestamp)));

  // Generate weekly mini-chart data
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <PageTransition className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-bold"
          >
            {greeting}, <span className="text-gradient">{user?.displayName?.split(' ')[0]}</span>
          </motion.h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), 'EEEE, MMMM do')}
          </p>
        </div>

        {!todayEntry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
              <Link to="/new-entry">
                <Plus className="mr-2 h-5 w-5" /> Log Today's Mood
              </Link>
            </Button>
          </motion.div>
        )}
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-card border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
              <Flame className={`h-5 w-5 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-baseline gap-2">
                {streak} <span className="text-sm font-normal text-muted-foreground">days</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {streak > 0 ? 'Keep it up!' : 'Log today to start a streak'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-card border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
              <TrendingUp className="h-5 w-5 text-teal-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{entries.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Since {user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'joining'}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="md:col-span-1">
           <Card className="bg-card border-border/50 shadow-sm h-full bg-gradient-premium text-white">
            <CardContent className="p-6 flex flex-col h-full justify-between">
              <div>
                <h3 className="font-medium text-white/90">Your Weekly Overview</h3>
                <p className="text-sm text-white/70 mt-1">You've logged {entries.filter(e => e.timestamp > weekStart.getTime()).length} days this week</p>
              </div>
              <div className="flex justify-between items-end mt-4">
                {weekDays.map((day, i) => {
                  const entry = entries.find(e => isToday(new Date(e.timestamp)) ? isToday(day) : format(new Date(e.timestamp), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm bg-white/20 backdrop-blur-md`}>
                        {entry ? getMoodEmoji(entry.mood) : ''}
                      </div>
                      <span className="text-[10px] text-white/60">{format(day, 'EEEEE')}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Entries */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Entries</h2>
            <Link to="/history" className="text-sm text-primary hover:underline flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {recentEntries.length > 0 ? (
            <div className="space-y-4">
              {recentEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-card border-border/50 shadow-sm hover:shadow-sm transition-shadow overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl opacity-80" />
                    <CardContent className="p-5 flex gap-4">
                      <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${getMoodColor(entry.mood)}`}>
                        {getMoodEmoji(entry.mood)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium truncate pr-4 text-lg capitalize">{entry.mood}</h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap bg-secondary px-2 py-1 rounded-full">
                            {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{entry.note}</p>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {entry.tags.map(tag => (
                              <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border/50 shadow-sm text-center p-12 flex flex-col items-center justify-center h-[300px]">
               <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                 <CalendarIcon className="h-10 w-10 text-muted-foreground opacity-50" />
               </div>
               <h3 className="text-lg font-medium mb-2">No entries yet</h3>
               <p className="text-muted-foreground text-sm max-w-[250px] mb-6">
                 Start your journaling journey by logging your first mood today.
               </p>
               <Button asChild>
                 <Link to="/new-entry">Log your first entry</Link>
               </Button>
            </Card>
          )}
        </div>

        {/* Motivation / Tips Sidebar */}
          <MysticWidget />

        <div className="space-y-6">
          <Card className="bg-card border-border/50 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>💡</span> Daily Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Consistency is key. Logging your mood every day, even when you feel neutral, helps build a comprehensive picture of your emotional well-being over time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-accent/50 ">
             <CardContent className="p-6 flex items-center gap-4">
               <div className="w-12 h-12 bg-white dark:bg-black rounded-full flex items-center justify-center text-2xl shadow-sm">
                 🧘‍♀️
               </div>
               <div>
                 <h4 className="font-medium text-sm">Need a moment?</h4>
                 <p className="text-xs text-muted-foreground mt-1">Take 3 deep breaths before logging your mood.</p>
               </div>
             </CardContent>
          </Card>
        </div>

      </div>
    </PageTransition>
  );
}
