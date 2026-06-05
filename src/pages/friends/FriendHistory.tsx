import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Repeat2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoodEntry } from '@/types';

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
    case 'happy': return 'bg-green-500/20 text-green-500 border-green-500/30';
    case 'excited': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    case 'neutral': return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    case 'tired': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
    case 'sad': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    case 'angry': return 'bg-red-500/20 text-red-500 border-red-500/30';
    default: return 'bg-secondary text-foreground border-border';
  }
};

export function FriendHistory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, users } = useAuth();
  const { addPost } = usePosts();

  const friend = users.find(u => u.id === id);

  // Fallback to fetch entries from localStorage.
  // A real app would fetch from an API based on friend's ID.
  const storedEntries = localStorage.getItem('mood_diary_entries');
  const allEntries: MoodEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
  const friendEntries = allEntries
    .filter(e => e.userId === id)
    .sort((a, b) => b.timestamp - a.timestamp);

  const handleRepost = (entry: MoodEntry) => {
    if (!currentUser || !friend) return;

    addPost({
      userId: currentUser.id,
      type: 'repost',
      originalEntryId: entry.id,
      originalUserId: friend.id,
      content: JSON.stringify(entry) // We store a snapshot to render it easily
    });

    // Optional: Add a toast notification here
    alert("Reposted to your wall!");
  };

  if (!friend) {
    return (
      <PageTransition className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-4">Friend not found</h2>
        <Button onClick={() => navigate('/friends')}>Back to Friends</Button>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/friends')} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-12 w-12 border border-border shadow-sm">
            <AvatarImage src={friend.avatarUrl} />
            <AvatarFallback>{friend.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{friend.displayName}'s Journey</h1>
            <p className="text-sm text-muted-foreground">@{friend.username}</p>
          </div>
        </div>
      </div>

      {friendEntries.length === 0 ? (
        <Card className="glass-card border-none text-center p-12">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No history yet</h3>
            <p className="text-muted-foreground text-sm">
              {friend.displayName} hasn't logged any moods yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 relative">
          <div className="hidden md:block absolute left-[88px] top-4 bottom-4 w-0.5 bg-border z-0" />

          {friendEntries.map((entry, index) => (
             <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:hidden absolute left-3.5 top-8 bottom-[-24px] w-0.5 bg-border z-0" />
              <div className="md:hidden absolute left-[9px] top-6 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />

              <Card className={`glass-card border ${getMoodColor(entry.mood).split(' ')[2]} overflow-hidden hover:shadow-lg transition-all duration-300 group`}>
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${getMoodColor(entry.mood).split(' ')[0]} opacity-50`} />

                <CardContent className="p-6 flex flex-col md:flex-row gap-6 relative">
                  {/* Repost Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-primary gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRepost(entry)}
                  >
                    <Repeat2 size={16} /> <span className="hidden sm:inline">Repost</span>
                  </Button>

                  <div className="flex flex-col md:items-center min-w-[120px] shrink-0">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-3 ${getMoodColor(entry.mood).split(' ').slice(0,2).join(' ')} shadow-inner`}>
                      {getMoodEmoji(entry.mood)}
                    </div>
                    <div className="text-sm font-medium capitalize">{entry.mood}</div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                      <Clock className="w-3 h-3" /> {format(new Date(entry.timestamp), 'h:mm a')}
                    </div>
                    <div className="hidden md:block text-xs font-semibold text-primary/60 mt-1 uppercase tracking-wider">
                       {format(new Date(entry.timestamp), 'MMM dd, yyyy')}
                    </div>
                  </div>

                  <div className="flex-1 mt-2 md:mt-0 pr-8">
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
