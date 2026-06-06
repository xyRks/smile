import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoodEntry } from '@/types';


// Reusing helpers

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

export function FriendHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users, user } = useAuth();

  const friend = users.find(u => u.id === id);




  // Security check: ensure they are actually friends
  const isFriend = user?.friends?.includes(id || '');

  // Fetch entries for this friend directly from local storage for demo purposes
  const allEntriesRaw = localStorage.getItem('mood_diary_entries');
  const allEntries: MoodEntry[] = allEntriesRaw ? JSON.parse(allEntriesRaw) : [];
  const friendEntries = allEntries
    .filter(e => e.userId === id)
    .sort((a, b) => b.timestamp - a.timestamp); // Newest first

  if (!friend || !isFriend) {
    return (
      <PageTransition className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">User Not Found or Not a Friend</h2>
        <Button onClick={() => navigate('/friends')}>Return to Friends</Button>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate('/friends')} className="rounded-full hover:bg-secondary shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={friend.avatarUrl} />
            <AvatarFallback>{friend.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{friend.displayName}'s History</h1>
            <p className="text-muted-foreground mt-1">Viewing timeline for @{friend.username}</p>
          </div>
        </div>
      </div>

      {friendEntries.length === 0 ? (
        <Card className="glass-card border-none text-center p-12 bg-secondary/20">
          <div className="text-6xl mb-4 opacity-50">📭</div>
          <h3 className="text-xl font-medium mb-2">{friend.displayName} hasn't logged any moods yet.</h3>
        </Card>
      ) : (
        <div className="space-y-6 md:space-y-8">
          {friendEntries.map((entry, index) => (
             <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative pl-8 md:pl-0"
            >
              {/* Timeline connector line (mobile) */}
              <div className="md:hidden absolute left-3.5 top-8 bottom-[-24px] w-0.5 bg-border z-0" />
              <div className="md:hidden absolute left-[9px] top-6 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />

              <Card className={`glass-card border ${getMoodColor(entry.mood).split(' ')[2]} overflow-hidden hover:shadow-lg transition-all duration-300 group`}>
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${getMoodColor(entry.mood).split(' ')[0]} opacity-50`} />

                <CardContent className="p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col md:items-center min-w-[120px] shrink-0">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-3 ${getMoodColor(entry.mood).split(' ').slice(0,2).join(' ')} shadow-inner`}>
                      {entry.mood === "happy" ? "😊" : entry.mood === "sad" ? "😢" : entry.mood === "angry" ? "😠" : entry.mood === "tired" ? "😴" : entry.mood === "excited" ? "🤩" : "😐"}
                    </div>
                    <div className="text-sm font-medium capitalize">{entry.mood}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                      <Clock className="w-3 h-3" /> {format(new Date(entry.timestamp), 'h:mm a')}
                    </div>
                    <div className="hidden md:block text-xs font-semibold text-primary/60 mt-1 uppercase tracking-wider">
                       {format(new Date(entry.timestamp), 'MMM dd, yyyy')}
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
              ))}
            </div>
          )}

    </PageTransition>
  );
}
