import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { useMoodData } from '@/hooks/useMoodData';

import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Reusing helpers
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
    case 'happy': return 'bg-green-500/80 hover:bg-green-500 text-white shadow-green-500/20';
    case 'excited': return 'bg-yellow-500/80 hover:bg-yellow-500 text-white shadow-yellow-500/20';
    case 'neutral': return 'bg-gray-500/80 hover:bg-gray-500 text-white shadow-gray-500/20';
    case 'tired': return 'bg-purple-500/80 hover:bg-purple-500 text-white shadow-purple-500/20';
    case 'sad': return 'bg-blue-500/80 hover:bg-blue-500 text-white shadow-blue-500/20';
    case 'angry': return 'bg-red-500/80 hover:bg-red-500 text-white shadow-red-500/20';
    default: return 'bg-secondary hover:bg-secondary/80 text-foreground';
  }
};

export function Calendar() {
  const { entries } = useMoodData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { monthStart, paddingDays, days } = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const startD = start.getDay();
    const padding = Array.from({ length: startD === 0 ? 6 : startD - 1 }).map(() => null);
    const d = eachDayOfInterval({ start, end });
    return { monthStart: start, paddingDays: padding, days: d };
  }, [currentDate]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Find entries for selected date
  const selectedEntries = useMemo(() => {
    return selectedDate
      ? entries.filter(e => isSameDay(new Date(e.timestamp), selectedDate))
      : [];
  }, [entries, selectedDate]);

  return (
    <PageTransition className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Calendar View */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mood Calendar</h1>
          <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-xl shadow-sm border border-border">
            <button onClick={prevMonth} className="p-1 hover:bg-secondary rounded-md transition-colors"><ChevronLeft size={20} /></button>
            <span className="font-medium min-w-[120px] text-center">{format(currentDate, 'MMMM yyyy')}</span>
            <button onClick={nextMonth} className="p-1 hover:bg-secondary rounded-md transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>

        <Card className="glass-card border-none overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {paddingDays.map((_, index) => (
                <div key={`padding-${index}`} className="aspect-square rounded-xl bg-transparent" />
              ))}

              {days.map((day, index) => {
                const dayEntries = entries.filter(e => isSameDay(new Date(e.timestamp), day));
                const mainEntry = dayEntries[0]; // Take most recent if multiple
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);

                return (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all
                      ${!isCurrentMonth ? 'opacity-30' : 'opacity-100'}
                      ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 z-10' : 'hover:scale-105 hover:z-10'}
                      ${mainEntry ? getMoodColor(mainEntry.mood) + ' shadow-md' : 'bg-secondary/50 hover:bg-secondary'}
                    `}
                  >
                    <span className={`text-xs font-medium z-10 ${isToday(day) && !mainEntry ? 'text-primary' : ''} ${mainEntry ? 'text-white' : ''}`}>
                      {format(day, 'd')}
                    </span>

                    {mainEntry && (
                      <span className="text-xl md:text-2xl mt-1 z-10 drop-shadow-md filter">
                        {getMoodEmoji(mainEntry.mood)}
                      </span>
                    )}

                    {dayEntries.length > 1 && (
                       <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white shadow-sm" />
                    )}

                    {isToday(day) && (
                      <div className={`absolute inset-0 border border-primary/50 rounded-xl pointer-events-none ${mainEntry ? 'border-white/50' : ''}`} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Slide-out / Side Panel for Selected Date Details */}
      <div className="w-full md:w-80 shrink-0">
        <AnimatePresence mode="wait">
          {selectedDate ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="sticky top-24"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)} className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {selectedEntries.length > 0 ? (
                <div className="space-y-4">
                  {selectedEntries.map((entry) => (
                    <Card key={entry.id} className="glass border-none shadow-sm overflow-hidden relative group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getMoodColor(entry.mood).split(' ')[0]}`} />
                      <CardContent className="p-4 pt-5">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                             <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                             <span className="font-medium capitalize text-lg">{entry.mood}</span>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" /> {format(new Date(entry.timestamp), 'h:mm a')}
                          </span>
                        </div>

                        {entry.note && (
                          <p className="text-sm text-foreground/80 mb-3 bg-background/50 p-2 rounded-lg border border-border/50">"{entry.note}"</p>
                        )}

                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags?.map(tag => (
                            <span key={tag} className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="glass border-none text-center p-8 bg-secondary/30">
                  <div className="text-4xl mb-2 opacity-50">📝</div>
                  <p className="text-sm text-muted-foreground mb-4">No entries found for this day.</p>
                  {isToday(selectedDate) || selectedDate < new Date() ? (
                     <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to="/new-entry">Log Mood for this day</Link>
                     </Button>
                  ) : null}
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sticky top-24 hidden md:flex h-full min-h-[400px] flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border rounded-2xl bg-secondary/10"
            >
              <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Select a day on the calendar to view entry details.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
