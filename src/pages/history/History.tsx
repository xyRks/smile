import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { format } from 'date-fns';
import { useMoodData } from '@/hooks/useMoodData';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { MoodEntry } from '@/types';

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
    case 'happy': return 'bg-green-500/20 text-green-500 border-green-500/30';
    case 'excited': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    case 'neutral': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    case 'tired': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
    case 'sad': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    case 'angry': return 'bg-red-500/20 text-red-500 border-red-500/30';
    default: return 'bg-secondary text-secondary-foreground border-border';
  }
};

function HistoryCard({ entry }: { entry: MoodEntry }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative pl-8 md:pl-0"
    >
      {/* Timeline connector line (mobile) */}
      <div className="md:hidden absolute left-3.5 top-8 bottom-[-24px] w-0.5 bg-border z-0" />

      {/* Timeline dot (mobile) */}
      <div className="md:hidden absolute left-[9px] top-6 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />

      <Card className={`glass-card border ${getMoodColor(entry.mood).split(' ')[2]} overflow-hidden hover:shadow-lg transition-all duration-300 group`}>
        <div className={`absolute left-0 top-0 bottom-0 w-2 ${getMoodColor(entry.mood).split(' ')[0]} opacity-50`} />

        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
          <div className="flex flex-col md:items-center min-w-[120px] shrink-0">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-3 ${getMoodColor(entry.mood).split(' ').slice(0,2).join(' ')} shadow-inner`}>
              {getMoodEmoji(entry.mood)}
            </div>
            <div className="text-sm font-medium capitalize">{entry.mood}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
              <Clock className="w-3 h-3" /> {format(new Date(entry.timestamp), 'h:mm a')}
            </div>
            <div className="hidden md:block text-xs font-semibold text-primary/60 mt-1 uppercase tracking-wider">
               {format(new Date(entry.timestamp), 'MMM dd')}
            </div>
          </div>

          <div className="flex-1">
             <div className="md:hidden text-xs font-semibold text-primary/60 mb-2 uppercase tracking-wider">
               {format(new Date(entry.timestamp), 'MMM dd, yyyy')}
            </div>

            {entry.note ? (
              <p className="text-foreground/90 leading-relaxed mb-4 text-sm md:text-base">"{entry.note}"</p>
            ) : (
              <p className="text-muted-foreground italic mb-4 text-sm">No details provided.</p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-auto">
              {entry.tags && entry.tags.map(tag => (
                <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md">
                  #{tag}
                </span>
              ))}

              <div className="ml-auto flex items-center gap-1.5 text-xs font-medium bg-primary/5 text-primary px-2.5 py-1 rounded-md border border-primary/10">
                <span className="text-amber-500">⚡</span> Energy: {entry.energyLevel}/5
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function History() {
  const { entries } = useMoodData();
  const [displayCount, setDisplayCount] = useState(10);

  // Group entries by Month/Year
  const groupedEntries = entries.reduce((acc, entry) => {
    const monthYear = format(new Date(entry.timestamp), 'MMMM yyyy');
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(entry);
    return acc;
  }, {} as Record<string, MoodEntry[]>);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  const displayedEntries = entries.slice(0, displayCount);
  const hasMore = entries.length > displayCount;

  return (
    <PageTransition className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Journal History</h1>
          <p className="text-muted-foreground mt-1">Review your past emotional states and reflections.</p>
        </div>
        <div className="bg-secondary/50 px-4 py-2 rounded-xl text-sm font-medium">
          Total Entries: <span className="text-primary">{entries.length}</span>
        </div>
      </div>

      {entries.length === 0 ? (
        <Card className="glass-card border-none text-center p-12">
           <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
             <CalendarIcon className="h-10 w-10 text-muted-foreground opacity-50" />
           </div>
           <h3 className="text-xl font-medium mb-2">Your journal is empty</h3>
           <p className="text-muted-foreground">Entries you create will appear here in a timeline.</p>
        </Card>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedEntries).map(([monthYear, monthEntries]) => {
            // Only show entries that are within the current display count
            const visibleMonthEntries = monthEntries.filter(e => displayedEntries.some(de => de.id === e.id));

            if (visibleMonthEntries.length === 0) return null;

            return (
              <div key={monthYear} className="space-y-6">
                <h2 className="text-xl font-semibold sticky top-20 z-10 bg-background/80 backdrop-blur-md py-2 -mx-4 px-4 md:mx-0 md:px-0 rounded-lg">
                  {monthYear}
                </h2>

                <div className="space-y-6 md:space-y-8">
                  {visibleMonthEntries.map((entry) => (
                    <HistoryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            );
          })}

          {hasMore && (
            <div className="flex justify-center pt-8">
              <button
                onClick={handleLoadMore}
                className="text-primary font-medium hover:underline bg-primary/10 px-6 py-3 rounded-full transition-colors hover:bg-primary/20"
              >
                Load Older Entries
              </button>
            </div>
          )}
        </div>
      )}
    </PageTransition>
  );
}
