import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, Search, UserMinus, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { isToday } from 'date-fns';

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



export function Friends() {
  const { user, users, addFriend, removeFriend } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Need to get all entries to show friend's current mood
  // In a real app this would be an API call, here we read the raw local storage
  const allEntriesRaw = localStorage.getItem('mood_diary_entries');
  const allEntries = allEntriesRaw ? JSON.parse(allEntriesRaw) : [];

  const { friendsList, nonFriendsList } = useMemo(() => {
    if (!user) return { friendsList: [], nonFriendsList: [] };

    const userFriends = user.friends || [];

    const fList = users.filter(u => u.id !== user.id && userFriends.includes(u.id));

    let nfList = users.filter(u => u.id !== user.id && !userFriends.includes(u.id));
    if (searchQuery) {
      nfList = nfList.filter(u =>
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return { friendsList: fList, nonFriendsList: nfList };
  }, [user, users, searchQuery]);

  const getFriendLatestMood = (friendId: string) => {
     const friendEntries = allEntries.filter((e: any) => e.userId === friendId).sort((a: any, b: any) => b.timestamp - a.timestamp);
     if(friendEntries.length > 0 && isToday(new Date(friendEntries[0].timestamp))) {
         return friendEntries[0].mood;
     }
     return null;
  };

  return (
    <PageTransition className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-primary w-8 h-8" /> Friends
          </h1>
          <p className="text-muted-foreground mt-1">Connect with others and track moods together.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Col: Friends List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Your Friends <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{friendsList.length}</span>
          </h2>

          {friendsList.length === 0 ? (
            <Card className="glass-card border-none text-center p-12 bg-secondary/20">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-medium mb-2">No friends yet</h3>
              <p className="text-muted-foreground text-sm">Use the search panel to find and add friends.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {friendsList.map(friend => {
                  const latestMood = getFriendLatestMood(friend.id);
                  return (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <Card className="glass-card border-none hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 border-2 border-primary/20">
                              <AvatarImage src={friend.avatarUrl} />
                              <AvatarFallback>{friend.displayName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{friend.displayName}</h3>
                              <p className="text-sm text-muted-foreground">@{friend.username}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                             {latestMood && (
                                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-secondary rounded-full">
                                    <span className="text-xs text-muted-foreground font-medium">Feeling today:</span>
                                    <span className="text-xl" title={latestMood}>{getMoodEmoji(latestMood)}</span>
                                </div>
                             )}
                            <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                              <Link to={`/friends/${friend.id}`}>
                                <Activity className="w-4 h-4 mr-2" /> View History
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeFriend(friend.id)}
                              title="Remove Friend"
                            >
                              <UserMinus className="w-5 h-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Col: Add Friends */}
        <div className="space-y-6">
          <Card className="glass-card border-none sticky top-24">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" /> Discover
              </h2>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 bg-background/50 border-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {nonFriendsList.length === 0 ? (
                  <p className="text-sm text-center text-muted-foreground py-4">No users found.</p>
                ) : (
                  nonFriendsList.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={u.avatarUrl} />
                          <AvatarFallback>{u.displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{u.displayName}</p>
                          <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-full shrink-0 ml-2"
                        onClick={() => addFriend(u.id)}
                      >
                        Add
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </PageTransition>
  );
}
