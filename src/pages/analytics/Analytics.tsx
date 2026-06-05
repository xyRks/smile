import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { useMoodData } from '@/hooks/useMoodData';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const MOOD_COLORS = {
  happy: '#10b981',   // green-500
  excited: '#f59e0b', // amber-500
  neutral: '#64748b', // slate-500
  tired: '#8b5cf6',   // violet-500
  sad: '#3b82f6',     // blue-500
  angry: '#ef4444',   // red-500
};

const MOOD_VALUES = {
  happy: 4,
  excited: 5,
  neutral: 3,
  tired: 2,
  sad: 1,
  angry: 0,
};

export function Analytics() {
  const { entries } = useMoodData();

  // Process data for charts
  const { trendData, distributionData, tagsData } = useMemo(() => {
    if (entries.length === 0) return { trendData: [], distributionData: [], tagsData: [] };

    // 1. Trend Data (Last 14 days)
    const trend = Array.from({ length: 14 }).map((_, i) => {
      const date = subDays(new Date(), 13 - i);
      const dayEntries = entries.filter(e => isSameDay(new Date(e.timestamp), date));
      const avgValue = dayEntries.length > 0
        ? dayEntries.reduce((acc, e) => acc + MOOD_VALUES[e.mood], 0) / dayEntries.length
        : null; // null for days with no entries so chart line breaks

      return {
        date: format(date, 'MMM dd'),
        value: avgValue
      };
    });

    // 2. Distribution Data
    const moodCounts = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const distribution = Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
      color: MOOD_COLORS[mood as keyof typeof MOOD_COLORS]
    })).sort((a, b) => b.value - a.value);

    // 3. Tags Data
    const tagCounts = entries.reduce((acc, entry) => {
      entry.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const tags = Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 tags

    return { trendData: trend, distributionData: distribution, tagsData: tags };
  }, [entries]);

  if (entries.length === 0) {
    return (
      <PageTransition className="flex items-center justify-center h-[60vh]">
        <Card className="glass-card border-none text-center p-12 max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Not enough data yet</h2>
          <p className="text-muted-foreground">Log your mood for a few days to unlock insights and trends.</p>
        </Card>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-8 max-w-6xl mx-auto pb-8">
      <div>
        <h1 className="text-3xl font-bold">Insights</h1>
        <p className="text-muted-foreground mt-1">Visualize your emotional well-being trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Trend Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle>Mood Trend (14 Days)</CardTitle>
              <CardDescription>Your average mood rating over the last two weeks.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                      domain={[0, 5]}
                      ticks={[0, 1, 2, 3, 4, 5]}
                    />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}
                      formatter={(value: unknown) => { if (typeof value === 'number') { return [value.toFixed(1), 'Avg Rating']; } return [String(value), 'Avg Rating']; }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="var(--primary)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Distribution Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-none h-full">
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>All-time breakdown of your logged moods.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                {distributionData.map(entry => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Tags Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-none h-full">
            <CardHeader>
              <CardTitle>Top Tags</CardTitle>
              <CardDescription>Most frequently used context tags.</CardDescription>
            </CardHeader>
            <CardContent>
              {tagsData.length > 0 ? (
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tagsData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                      <XAxis type="number" hide />
                      <YAxis
                        dataKey="name"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 500 }}
                      />
                      <RechartsTooltip
                        cursor={{ fill: 'var(--secondary)' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                  <p>No tags used yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </PageTransition>
  );
}
