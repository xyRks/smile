import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { PageTransition } from '@/components/layout/PageTransition';
import { PostCard } from '@/components/posts/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, UserPlus, UserMinus, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function Profile() {
  const { id } = useParams<{ id?: string }>();
  const { user, users, updateProfile, addFriend, removeFriend } = useAuth();
  const { getPostsByUser, addPost, deletePost } = usePosts();

  const [newStatus, setNewStatus] = useState('');
  const [editingProfileStatus, setEditingProfileStatus] = useState(false);
  const [profileStatusText, setProfileStatusText] = useState('');

  // If no ID is provided, assume it's the current user's profile
  const profileUserId = id || user?.id;
  const profileUser = users.find(u => u.id === profileUserId);
  const isOwner = user?.id === profileUserId;
  const isFriend = user?.friends?.includes(profileUserId || '');

  if (!profileUser) {
    return <Navigate to="/" replace />;
  }

  const posts = getPostsByUser(profileUser.id);

  const handlePostStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus.trim() || !user) return;

    addPost({
      userId: user.id,
      type: 'status',
      content: newStatus.trim()
    });
    setNewStatus('');
  };

  const handleUpdateProfileStatus = () => {
    updateProfile({ statusText: profileStatusText });
    setEditingProfileStatus(false);
  };

  return (
    <PageTransition className="space-y-8 max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-32 md:h-48 rounded-2xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 border border-border/50 overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
        </div>

        <div className="px-6 relative -mt-12 sm:-mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-4 pb-4">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-xl">
            <AvatarImage src={profileUser.avatarUrl} />
            <AvatarFallback className="text-3xl">{profileUser.displayName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{profileUser.displayName}</h1>
            <p className="text-muted-foreground text-sm">@{profileUser.username}</p>

            {/* Short Profile Status Line */}
            <div className="mt-2 min-h-[1.5rem]">
               {isOwner ? (
                 editingProfileStatus ? (
                   <div className="flex items-center gap-2 max-w-md mx-auto sm:mx-0">
                     <Input
                       value={profileStatusText}
                       onChange={e => setProfileStatusText(e.target.value)}
                       placeholder="What's on your mind?"
                       className="h-8 text-sm"
                       autoFocus
                       onKeyDown={e => e.key === 'Enter' && handleUpdateProfileStatus()}
                     />
                     <Button size="sm" onClick={handleUpdateProfileStatus}>Save</Button>
                   </div>
                 ) : (
                   <div
                     className="text-sm font-medium italic text-primary/80 hover:text-primary cursor-pointer transition-colors"
                     onClick={() => {
                        setProfileStatusText(profileUser.statusText || '');
                        setEditingProfileStatus(true);
                     }}
                     title="Click to edit status"
                   >
                     {profileUser.statusText ? `"${profileUser.statusText}"` : "Set a status..."}
                   </div>
                 )
               ) : (
                 profileUser.statusText && (
                   <div className="text-sm font-medium italic text-primary/80">
                     "{profileUser.statusText}"
                   </div>
                 )
               )}
            </div>
          </div>

          {/* Action Buttons */}
          {!isOwner && user && (
            <div className="flex gap-2 shrink-0">
              {isFriend ? (
                <Button variant="outline" onClick={() => removeFriend(profileUser.id)} className="gap-2">
                  <UserMinus size={16} /> Unfriend
                </Button>
              ) : (
                <Button onClick={() => addFriend(profileUser.id)} className="gap-2">
                  <UserPlus size={16} /> Add Friend
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Wall Feed */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-semibold border-b border-border/50 pb-2">
             <MessageSquare className="h-5 w-5 text-primary" />
             <h2>Wall</h2>
          </div>

          {/* Create Post Area */}
          {isOwner && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-card border-none shadow-sm">
                <CardContent className="p-4">
                  <form onSubmit={handlePostStatus} className="flex gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={user?.avatarUrl} />
                      <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Share a status update..."
                        value={newStatus}
                        onChange={e => setNewStatus(e.target.value)}
                        className="bg-background/50 border-border/50"
                      />
                      <Button type="submit" disabled={!newStatus.trim()}>
                        <Send size={16} className="mr-2" /> Post
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PostCard post={post} onDelete={deletePost} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-2xl border border-border/50 border-dashed">
                 <p>{isOwner ? "You haven't posted anything yet." : "This user hasn't posted anything yet."}</p>
                 {isOwner && <p className="text-sm mt-1">Use the field above to share your first status!</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
